import { describe, it, expect } from 'vitest';
import { EXERCISES, MODULES, DATABASES, getExerciseById, getExercisesForModule, getDatabaseById } from '../src/data/curriculum';

describe('Curriculum Data Integrity', () => {
  it('should contain 18 structured modules', () => {
    expect(MODULES).toHaveLength(18);
    const moduleIds = MODULES.map(m => m.id);
    expect(moduleIds).toContain('select');
    expect(moduleIds).toContain('where');
    expect(moduleIds).toContain('order');
    expect(moduleIds).toContain('group');
    expect(moduleIds).toContain('joins');
    expect(moduleIds).toContain('window');
    expect(moduleIds).toContain('interview');
  });

  it('should contain exactly 149 interactive exercises', () => {
    expect(EXERCISES.length).toBe(149);
  });

  it('should ensure every exercise has unique id and valid properties', () => {
    const idSet = new Set<string>();
    for (const ex of EXERCISES) {
      expect(idSet.has(ex.id)).toBe(false);
      idSet.add(ex.id);

      expect(ex.title).toBeTruthy();
      expect(ex.concept).toBeTruthy();
      expect(ex.steps.length).toBeGreaterThan(0);

      const step = ex.steps[0];
      expect(step.task).toBeTruthy();
      expect(step.solution).toBeTruthy();
      expect(typeof step.solution).toBe('string');
      expect(step.solution.length).toBeGreaterThan(5);

      // Verify DB binding
      expect(['store', 'company', 'school']).toContain(ex.db);
    }
  });

  it('should include DuckDB superpower exercises', () => {
    const duckDbExercises = EXERCISES.filter(e => e.isDuckDbFeature);
    expect(duckDbExercises.length).toBe(6);

    const antiJoinEx = getExerciseById('duckdb-anti-join');
    expect(antiJoinEx).toBeDefined();
    expect(antiJoinEx?.steps[0].solution).toContain('ANTI JOIN');

    const excludeEx = getExerciseById('select-exclude');
    expect(excludeEx).toBeDefined();
    expect(excludeEx?.steps[0].solution).toContain('EXCLUDE');

    const replaceEx = getExerciseById('select-replace');
    expect(replaceEx).toBeDefined();
    expect(replaceEx?.steps[0].solution).toContain('REPLACE');

    const groupByAllEx = getExerciseById('group-by-all');
    expect(groupByAllEx).toBeDefined();
    expect(groupByAllEx?.steps[0].solution).toContain('GROUP BY ALL');

    const orderByAllEx = getExerciseById('order-by-all');
    expect(orderByAllEx).toBeDefined();
    expect(orderByAllEx?.steps[0].solution).toContain('ORDER BY ALL');

    const qualifyEx = getExerciseById('qualify-clause');
    expect(qualifyEx).toBeDefined();
    expect(qualifyEx?.steps[0].solution).toContain('QUALIFY');
  });

  it('should verify helper functions', () => {
    const selectExs = getExercisesForModule('select');
    expect(selectExs.length).toBeGreaterThan(5);

    const storeDb = getDatabaseById('store');
    expect(storeDb.id).toBe('store');
    expect(storeDb.tables.length).toBe(5);
  });

  it('should ensure no legacy city or mismatched seed data names exist', () => {
    const legacyNames = ['monterrey', 'guadalajara', 'cdmx', 'tijuana', 'puebla'];
    for (const ex of EXERCISES) {
      for (const step of ex.steps) {
        for (const legacy of legacyNames) {
          expect(step.task.toLowerCase()).not.toContain(legacy);
          expect(step.solution.toLowerCase()).not.toContain(legacy);
          expect(ex.concept.toLowerCase()).not.toContain(legacy);
          for (const h of step.hints || []) {
            expect(h.toLowerCase()).not.toContain(legacy);
          }
        }
      }
    }
  });
});
