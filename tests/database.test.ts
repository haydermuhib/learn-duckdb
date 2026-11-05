import { describe, it, expect } from 'vitest';
import { DATABASES } from '../src/data/databases';

describe('Database Schemas and Seed Integrity', () => {
  it('should define all 3 core databases', () => {
    expect(DATABASES.store).toBeDefined();
    expect(DATABASES.company).toBeDefined();
    expect(DATABASES.school).toBeDefined();
  });

  it('should verify store database tables and English names', () => {
    const tableNames = DATABASES.store.tables.map(t => t.name);
    expect(tableNames).toEqual(['customers', 'products', 'orders', 'order_items', 'subscribers']);

    const customersTable = DATABASES.store.tables.find(t => t.name === 'customers')!;
    expect(customersTable.rows.length).toBe(10);

    // Verify short English & Punjabi names, no "Al-" prefix, Latin script
    const names = customersTable.rows.map(r => r[1]);
    expect(names).toContain('Bilal');
    expect(names).toContain('Emma');
    expect(names).toContain('Tariq');
    expect(names).toContain('Simran');
    expect(names).toContain('Jack');
    expect(names).toContain('Aman');
    expect(names).toContain('Fatima');

    for (const name of names) {
      expect(name).not.toMatch(/^Al-/i);
      expect(name).not.toMatch(/^El-/i);
    }
  });

  it('should verify company database tables and employees', () => {
    const tableNames = DATABASES.company.tables.map(t => t.name);
    expect(tableNames).toEqual(['departments', 'employees']);

    const employeesTable = DATABASES.company.tables.find(t => t.name === 'employees')!;
    expect(employeesTable.rows.length).toBe(14);

    const empNames = employeesTable.rows.map(r => r[1]);
    expect(empNames).toContain('Ali');
    expect(empNames).toContain('Maya');
    expect(empNames).toContain('Navjot');
    expect(empNames).toContain('Hamza');
    expect(empNames).toContain('Sunny');

    for (const name of empNames) {
      expect(name).not.toMatch(/^Al-/i);
    }
  });

  it('should verify school database tables and students', () => {
    const tableNames = DATABASES.school.tables.map(t => t.name);
    expect(tableNames).toEqual(['students', 'subjects', 'grades']);

    const studentsTable = DATABASES.school.tables.find(t => t.name === 'students')!;
    expect(studentsTable.rows.length).toBe(8);

    const studentNames = studentsTable.rows.map(r => r[1]);
    expect(studentNames).toContain('Anas');
    expect(studentNames).toContain('Hiba');
    expect(studentNames).toContain('Rania');
    expect(studentNames).toContain('Bobby');
    expect(studentNames).toContain('Noor');

    for (const name of studentNames) {
      expect(name).not.toMatch(/^Al-/i);
    }
  });
});
