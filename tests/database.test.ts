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

    // Verify presence of unsold product (Pen Set) for outer join and subquery exercises
    const productsTable = DATABASES.store.tables.find(t => t.name === 'products')!;
    const orderItemsTable = DATABASES.store.tables.find(t => t.name === 'order_items')!;
    const penSet = productsTable.rows.find(r => r[1] === 'Pen Set');
    expect(penSet).toBeDefined();

    const penSetOrders = orderItemsTable.rows.filter(r => r[1] === penSet![0]);
    expect(penSetOrders.length).toBe(0);

    // Verify presence of out of stock product (Headphones)
    const headphones = productsTable.rows.find(r => r[1] === 'Headphones');
    expect(headphones).toBeDefined();
    expect(headphones![4]).toBe(0);

    // Verify order statuses include delivered
    const ordersTable = DATABASES.store.tables.find(t => t.name === 'orders')!;
    const statuses = new Set(ordersTable.rows.map(r => r[3]));
    expect(statuses.has('delivered')).toBe(true);
    expect(statuses.has('shipped')).toBe(true);
    expect(statuses.has('cancelled')).toBe(true);

    const custIds = new Set(customersTable.rows.map(r => r[0]));
    const prodIds = new Set(productsTable.rows.map(r => r[0]));
    const orderIds = new Set(ordersTable.rows.map(r => r[0]));

    for (const order of ordersTable.rows) {
      expect(custIds.has(order[1])).toBe(true);
    }
    for (const item of orderItemsTable.rows) {
      expect(orderIds.has(item[0])).toBe(true);
      expect(prodIds.has(item[1])).toBe(true);
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

    // Verify presence of unassigned employee (Harun) and empty department (HR) for outer join exercises
    const harun = employeesTable.rows.find(r => r[1] === 'Harun');
    expect(harun).toBeDefined();
    expect(harun![4]).toBeNull(); // department_id is null

    const hrDept = DATABASES.company.tables.find(t => t.name === 'departments')!.rows.find(r => r[1] === 'HR');
    expect(hrDept).toBeDefined();
    const employeesInHr = employeesTable.rows.filter(r => r[4] === hrDept![0]);
    expect(employeesInHr.length).toBe(0);

    // Verify presence of employee earning more than manager (Layla > Chloe)
    const layla = employeesTable.rows.find(r => r[1] === 'Layla')!;
    const chloe = employeesTable.rows.find(r => r[1] === 'Chloe')!;
    expect(layla).toBeDefined();
    expect(chloe).toBeDefined();
    expect(layla[5]).toBe(chloe[0]); // Layla's manager is Chloe
    expect(layla[3]).toBeGreaterThan(chloe[3]); // Layla earns more than Chloe

    // Verify company relational integrity
    const deptIds = new Set(DATABASES.company.tables.find(t => t.name === 'departments')!.rows.map(r => r[0]));
    const empIds = new Set(employeesTable.rows.map(r => r[0]));
    for (const emp of employeesTable.rows) {
      if (emp[4] !== null) expect(deptIds.has(emp[4])).toBe(true);
      if (emp[5] !== null) expect(empIds.has(emp[5])).toBe(true);
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

    // Verify sections 1A/1B and null scholarship values exist
    const classGroups = new Set(studentsTable.rows.map(r => r[2]));
    expect(classGroups.has('1A')).toBe(true);
    expect(classGroups.has('1B')).toBe(true);
    const hasNullScholarship = studentsTable.rows.some(r => r[4] === null);
    expect(hasNullScholarship).toBe(true);

    // Verify failing grades (< 6) exist for school-failed exercise
    const gradesTable = DATABASES.school.tables.find(t => t.name === 'grades')!;
    const hasFailingGrade = gradesTable.rows.some(r => r[2] < 6);
    expect(hasFailingGrade).toBe(true);

    const studentIds = new Set(studentsTable.rows.map(r => r[0]));
    const subjectIds = new Set(DATABASES.school.tables.find(t => t.name === 'subjects')!.rows.map(r => r[0]));
    for (const grade of gradesTable.rows) {
      expect(studentIds.has(grade[0])).toBe(true);
      expect(subjectIds.has(grade[1])).toBe(true);
    }
  });

  it('should verify default playground table names include ecommerce_sales and store dataset', async () => {
    const { DEFAULT_TABLE_NAMES } = await import('../src/engine/playgroundDuckdb');
    expect(DEFAULT_TABLE_NAMES.has('ecommerce_sales')).toBe(true);
    expect(DEFAULT_TABLE_NAMES.has('customers')).toBe(true);
    expect(DEFAULT_TABLE_NAMES.has('products')).toBe(true);
    expect(DEFAULT_TABLE_NAMES.has('orders')).toBe(true);
    expect(DEFAULT_TABLE_NAMES.has('order_items')).toBe(true);
    expect(DEFAULT_TABLE_NAMES.has('subscribers')).toBe(true);
  });

  it('should verify seed tables have positive contiguous IDs for auto-increment sequence initialization', () => {
    for (const [dbName, db] of Object.entries(DATABASES)) {
      for (const table of db.tables) {
        const hasPk = table.columns.some(([_, type]) => type.toUpperCase().includes('INTEGER PRIMARY KEY'));
        if (hasPk && table.rows.length > 0) {
          const maxId = Math.max(...table.rows.map(r => (typeof r[0] === 'number' ? r[0] : 0)));
          expect(maxId).toBeGreaterThan(0);
          const nextStartVal = maxId + 1;
          if (table.name === 'products') {
            expect(nextStartVal).toBe(13);
          }
          if (table.name === 'customers') {
            expect(nextStartVal).toBe(11);
          }
        }
      }
    }
  });
});
