import { describe, it, expect } from 'vitest';

describe('Progress Backup & Draft Eviction Logic', () => {
  it('formats progress backup including completed exercises, hints, and drafts', () => {
    const completedIds = new Set(['select-all', 'select-columns', 'where-simple']);
    const assistedIds = new Set(['where-simple']);
    const drafts = {
      'select-all': 'SELECT * FROM products;',
      'custom-ex': 'SELECT name FROM customers;'
    };

    let assistedCount = 0;
    completedIds.forEach(id => {
      if (assistedIds.has(id)) assistedCount++;
    });
    const masteredCount = completedIds.size - assistedCount;

    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      completedIds: Array.from(completedIds),
      assistedIds: Array.from(assistedIds),
      drafts,
      stats: {
        total: 149,
        completed: completedIds.size,
        mastered: masteredCount,
        withHints: assistedCount,
        draftCount: Object.keys(drafts).length,
      },
    };

    expect(backup.completedIds).toHaveLength(3);
    expect(backup.stats.mastered).toBe(2);
    expect(backup.stats.withHints).toBe(1);
    expect(backup.drafts['select-all']).toBe('SELECT * FROM products;');
  });

  it('restores backup correctly and is backward-compatible with legacy backups lacking drafts', () => {
    const legacyBackupJson = JSON.stringify({
      version: 1,
      completedIds: ['select-all', 'where-simple'],
      assistedIds: ['where-simple']
    });

    const parsed = JSON.parse(legacyBackupJson);
    const completed = new Set(parsed.completedIds);
    const assisted = new Set(parsed.assistedIds);
    const importedDrafts = parsed.drafts && typeof parsed.drafts === 'object' ? parsed.drafts : undefined;

    expect(completed.has('select-all')).toBe(true);
    expect(assisted.has('where-simple')).toBe(true);
    expect(importedDrafts).toBeUndefined();
  });

  it('evicts oldest drafts when count exceeds the maximum limit (LRU)', () => {
    const MAX_SAVED_DRAFTS = 5;
    let drafts: Record<string, string> = {};

    function saveDraft(id: string, sql: string) {
      const next = { ...drafts };
      delete next[id]; // delete to move key to end of insertion order
      if (sql.trim()) {
        next[id] = sql;
      }
      const keys = Object.keys(next);
      if (keys.length > MAX_SAVED_DRAFTS) {
        const toEvict = keys.slice(0, keys.length - MAX_SAVED_DRAFTS);
        for (const k of toEvict) delete next[k];
      }
      drafts = next;
    }

    // Add 5 drafts
    for (let i = 1; i <= 5; i++) {
      saveDraft(`ex-${i}`, `SELECT ${i}`);
    }
    expect(Object.keys(drafts)).toEqual(['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5']);

    // Access/update ex-1 (should move ex-1 to MRU position at end)
    saveDraft('ex-1', 'SELECT 1 UPDATED');
    expect(Object.keys(drafts)).toEqual(['ex-2', 'ex-3', 'ex-4', 'ex-5', 'ex-1']);

    // Add ex-6 (should evict ex-2)
    saveDraft('ex-6', 'SELECT 6');
    expect(Object.keys(drafts)).toEqual(['ex-3', 'ex-4', 'ex-5', 'ex-1', 'ex-6']);
    expect(drafts['ex-2']).toBeUndefined();
    expect(drafts['ex-1']).toBe('SELECT 1 UPDATED');

    // Saving empty string clears the draft
    saveDraft('ex-3', '   ');
    expect(drafts['ex-3']).toBeUndefined();
    expect(Object.keys(drafts)).toEqual(['ex-4', 'ex-5', 'ex-1', 'ex-6']);
  });
});

