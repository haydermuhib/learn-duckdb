import { describe, it, expect } from 'vitest';
import { formatSql } from '../src/utils/sqlFormatter';

describe('formatSql utility tests', () => {
  it('places major clauses on separate lines and capitalizes keywords', () => {
    const raw = "select id, name, price from products where price > 50 and category = 'Electronics' order by price desc limit 10;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT id, name, price
FROM products
WHERE price > 50 AND category = 'Electronics'
ORDER BY price DESC
LIMIT 10;`
    );
  });

  it('preserves lowercase keywords inside single-quoted string literals', () => {
    const raw = "select * from logs where message = 'select all from here where error occurs';";
    const formatted = formatSql(raw);

    expect(formatted).toContain("'select all from here where error occurs'");
    const lines = formatted.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('SELECT *');
    expect(lines[1]).toBe('FROM logs');
    expect(lines[2]).toBe("WHERE message = 'select all from here where error occurs';");
  });

  it('preserves escaped single quotes within strings', () => {
    const raw = "select name from customers where note = 'it''s a valid string with select and from inside';";
    const formatted = formatSql(raw);

    expect(formatted).toContain("'it''s a valid string with select and from inside'");
  });

  it('preserves double-quoted identifiers that share names with SQL keywords', () => {
    const raw = 'select "from", "where", "group" from "order" where "from" > 1;';
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT "from", "where", "group"
FROM "order"
WHERE "from" > 1;`
    );
  });

  it('preserves single-line and multi-line comments', () => {
    const raw = `-- get active users
select id, name /* select from comment */ from users where active = true;`;
    const formatted = formatSql(raw);

    expect(formatted).toContain('-- get active users');
    expect(formatted).toContain('/* select from comment */');
    expect(formatted).toContain('FROM users');
  });

  it('formats JOIN and ON clauses on separate lines', () => {
    const raw = "select c.name, o.total from customers c left join orders o on c.id = o.customer_id where o.total > 100;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o
ON c.id = o.customer_id
WHERE o.total > 100;`
    );
  });

  it('formats GROUP BY and HAVING clauses cleanly', () => {
    const raw = "select category, count(*) as cnt, avg(price) from items group by category having count(*) > 5 order by cnt desc;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT category, COUNT(*) AS cnt, AVG(price)
FROM items
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY cnt DESC;`
    );
  });

  it('handles DuckDB specific syntax like EXCLUDE and COLUMNS', () => {
    const raw = "select * exclude (password, salt) from accounts where active is not null;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT * EXCLUDE (password, salt)
FROM accounts
WHERE active IS NOT NULL;`
    );
  });

  it('handles subqueries and CTEs', () => {
    const raw = "with top_products as (select id, price from products order by price desc limit 5) select * from top_products;";
    const formatted = formatSql(raw);

    expect(formatted).toContain('WITH top_products AS (');
    expect(formatted).toContain('SELECT id, price');
    expect(formatted).toContain('FROM products');
    expect(formatted).toContain('SELECT *');
  });

  it('formats window functions with OVER and PARTITION BY', () => {
    const raw = "select dept, name, salary, rank() over (partition by dept order by salary desc) as rnk from employees;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT dept, name, salary, rank() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
FROM employees;`
    );
  });

  it('formats CASE WHEN THEN ELSE END expressions cleanly', () => {
    const raw = "select name, case when score >= 90 then 'A' when score >= 80 then 'B' else 'C' end as grade from students;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT name, CASE WHEN score >= 90 THEN 'A' WHEN score >= 80 THEN 'B' ELSE 'C' END AS grade
FROM students;`
    );
  });

  it('formats DuckDB native ANTI JOIN and SEMI JOIN properly on separate lines', () => {
    const rawAnti = "select c.name from customers c anti join orders o on c.id = o.customer_id;";
    expect(formatSql(rawAnti)).toBe(
`SELECT c.name
FROM customers c
ANTI JOIN orders o
ON c.id = o.customer_id;`
    );

    const rawSemi = "select c.name from customers c semi join orders o on c.id = o.customer_id;";
    expect(formatSql(rawSemi)).toBe(
`SELECT c.name
FROM customers c
SEMI JOIN orders o
ON c.id = o.customer_id;`
    );
  });

  it('is idempotent: formatting already-formatted SQL produces identical output', () => {
    const queries = [
      "SELECT id, name FROM users WHERE active = TRUE ORDER BY name ASC LIMIT 10;",
      "SELECT c.id, o.id FROM customers c INNER JOIN orders o ON c.id = o.customer_id WHERE o.total > 50;",
      "SELECT dept, AVG(salary) FROM employees GROUP BY dept HAVING AVG(salary) > 50000;",
      "SELECT * EXCLUDE (secret) FROM accounts WHERE status = 'active';"
    ];

    for (const q of queries) {
      const firstPass = formatSql(q);
      const secondPass = formatSql(firstPass);
      expect(secondPass).toBe(firstPass);
    }
  });

  it('returns empty or whitespace strings unchanged without throwing', () => {
    expect(formatSql('')).toBe('');
    expect(formatSql('   ')).toBe('   ');
  });

  it('safely handles strings containing comment markers without truncation', () => {
    const raw = "select id, 'Hello -- not a comment' as greeting, '/* also not comment */' as note from users;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT id, 'Hello -- not a comment' AS greeting, '/* also not comment */' AS note
FROM users;`
    );
  });

  it('preserves dollar patterns in strings without JS replace injection ($&, $1)', () => {
    const raw = "select price, '$& is a special string' as literal, '$100 discount' as note from sales;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT price, '$& is a special string' AS literal, '$100 discount' AS note
FROM sales;`
    );
  });

  it('preserves quotes inside comments without token collision', () => {
    const raw = "-- Don't remove this user's filter\nselect id from users;";
    const formatted = formatSql(raw);

    expect(formatted).toContain("-- Don't remove this user's filter");
    expect(formatted).toContain("SELECT id");
    expect(formatted).toContain("FROM users;");
  });

  it('handles window functions with nested expressions inside OVER clause', () => {
    const raw = "select name, rank() over (partition by coalesce(dept, 'General') order by salary desc) as rnk from employees;";
    const formatted = formatSql(raw);

    expect(formatted).toBe(
`SELECT name, rank() OVER (PARTITION BY coalesce(dept, 'General') ORDER BY salary DESC) AS rnk
FROM employees;`
    );
  });
});
