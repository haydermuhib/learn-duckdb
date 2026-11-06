import { ExerciseDef } from "../../types/curriculum";

export const joins_exercises: ExerciseDef[] = [
  {
    "id": "inner-join",
    "module": "joins",
    "db": "store",
    "title": "Joining two tables with JOIN",
    "concept": "Orders store customer_id, not the name. JOIN matches each order with its customer, with ON saying which columns line up. When both tables have a column with the same name, write table.column.",
    "example": "SELECT orders.id, customers.city FROM orders JOIN customers ON orders.customer_id = customers.id;",
    "steps": [
      {
        "task": "Show each order’s id, the name of the customer who placed it and the date.",
        "solution": "SELECT orders.id, customers.name, orders.order_date FROM orders JOIN customers ON orders.customer_id = customers.id",
        "hints": [
          "Join orders with customers ON orders.customer_id = customers.id.",
          "Both tables have an id, so write orders.id."
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "join-alias",
    "module": "joins",
    "db": "store",
    "title": "Table aliases and filters",
    "concept": "A table alias saves typing: FROM orders o JOIN customers c lets you write o.id and c.name. After the JOIN, WHERE can filter on columns from either table.",
    "example": "SELECT p.id, c.name FROM orders p JOIN customers c ON p.customer_id = c.id WHERE p.status = 'cancelled';",
    "steps": [
      {
        "task": "Show id and order_date of the orders placed by customers from Birmingham.",
        "solution": "SELECT p.id, p.order_date FROM orders p JOIN customers c ON p.customer_id = c.id WHERE c.city = 'Birmingham'",
        "hints": [
          "Join orders and customers and filter with c.city = 'Birmingham'."
        ],
        "requires": [
          "JOIN",
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "join-group",
    "module": "joins",
    "db": "store",
    "title": "JOIN with GROUP BY",
    "concept": "Tables are joined first, then the result is grouped as if it were one table. That way you can summarize one table’s data by another table’s columns.",
    "example": "SELECT c.city, COUNT(*) FROM orders p JOIN customers c ON p.customer_id = c.id GROUP BY c.city;",
    "steps": [
      {
        "task": "Show each category and the total units ordered of its products (the quantity column in order_items).",
        "solution": "SELECT pr.category, SUM(d.quantity) FROM order_items d JOIN products pr ON d.product_id = pr.id GROUP BY pr.category",
        "hints": [
          "Join order_items with products ON i.product_id = p.id.",
          "Group by category and add up quantity."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "left-join",
    "module": "joins",
    "db": "store",
    "title": "LEFT JOIN: keep every row",
    "concept": "JOIN keeps only rows with a match in both tables: a customer with no orders disappears. LEFT JOIN keeps every row of the left table and fills the other table’s columns with NULL when there is no match.",
    "example": "SELECT c.name, p.id FROM customers c LEFT JOIN orders p ON p.customer_id = c.id;",
    "steps": [
      {
        "task": "Show every customer with how many orders each has placed, including those with 0.",
        "solution": "SELECT c.name, COUNT(p.id) FROM customers c LEFT JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name",
        "hints": [
          "With a plain JOIN, customers without orders would not appear.",
          "COUNT(o.id) gives 0 when there is no order; COUNT(*) would give 1."
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "left-join-null",
    "module": "joins",
    "db": "store",
    "title": "Finding what is missing",
    "concept": "A LEFT JOIN followed by WHERE right_table_column IS NULL keeps only the unmatched rows: customers with no orders, products never sold…",
    "example": "SELECT pr.name FROM products pr LEFT JOIN order_items d ON d.product_id = pr.id WHERE d.order_id IS NULL;",
    "steps": [
      {
        "task": "Show the names of the customers who have never placed an order.",
        "solution": "SELECT c.name FROM customers c LEFT JOIN orders p ON p.customer_id = c.id WHERE p.id IS NULL",
        "hints": [
          "LEFT JOIN customers to orders and WHERE o.id IS NULL."
        ],
        "requires": [
          "LEFT JOIN",
          "IS NULL"
        ]
      }
    ]
  },
  {
    "id": "duckdb-anti-join",
    "module": "joins",
    "db": "store",
    "title": "DuckDB Superpower: ANTI JOIN",
    "isDuckDbFeature": true,
    "concept": "In standard SQL, finding unmatched rows requires a clunky pattern: LEFT JOIN followed by WHERE right_table.id IS NULL. DuckDB introduces first-class native ANTI JOIN. Simply write `FROM table_a ANTI JOIN table_b ON ...` to directly return rows from the left table that have NO match in the right table (DuckDB uses the exact keyword ANTI JOIN, without the word LEFT). DuckDB also supports SEMI JOIN to find rows that DO have a match.",
    "example": "SELECT pr.name FROM products pr ANTI JOIN order_items d ON pr.id = d.product_id;",
    "steps": [
      {
        "task": "Show the names of the customers who have never placed an order using DuckDB's native ANTI JOIN.",
        "solution": "SELECT c.name FROM customers c ANTI JOIN orders o ON c.id = o.customer_id",
        "hints": [
          "Join customers c and orders o using ANTI JOIN on c.id = o.customer_id.",
          "In DuckDB, the keyword is simply ANTI JOIN (DuckDB does not use 'LEFT ANTI JOIN'). No WHERE or IS NULL clause needed!"
        ],
        "requires": [
          "ANTI JOIN"
        ]
      }
    ]
  },
  {
    "id": "self-join",
    "module": "joins",
    "db": "company",
    "title": "Joining a table to itself",
    "concept": "manager_id points to another employee in the same table. To see the manager’s name, join employees to employees with two different aliases: one for the employee and one for the manager.",
    "example": "SELECT e.name, j.role FROM employees e JOIN employees j ON e.manager_id = j.id;",
    "steps": [
      {
        "task": "Show the name of each employee who has a manager next to the manager’s name.",
        "solution": "SELECT e.name, j.name AS jefe FROM employees e JOIN employees j ON e.manager_id = j.id",
        "hints": [
          "FROM employees e JOIN employees m",
          "The condition is e.manager_id = m.id."
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "multi-join",
    "module": "joins",
    "db": "store",
    "title": "Three or more tables",
    "concept": "You can chain several JOINs: each one adds a table to the result. Working out what each customer spent takes four: customers, orders, order_items (quantities) and products (prices).",
    "example": "SELECT p.id, pr.name, d.quantity FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id;",
    "steps": [
      {
        "task": "Show each customer with the total they have spent (quantity times price), not counting cancelled orders, from highest to lowest.",
        "solution": "SELECT c.name, SUM(d.quantity * pr.price) AS total FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY c.id, c.name ORDER BY total DESC",
        "hints": [
          "Join customers → orders → order_items → products.",
          "Filter with o.status <> 'cancelled', group by customer and add up i.quantity * p.price."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "join-detail",
    "module": "joins",
    "db": "store",
    "title": "Order details across tables",
    "concept": "Many real questions chain tables without grouping: each JOIN adds columns and WHERE picks the rows. Think of the path: customer → order → item → product.",
    "example": "SELECT p.id, pr.name FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id;",
    "steps": [
      {
        "task": "Show everything Bilal has ordered: order date, product name and quantity.",
        "solution": "SELECT p.order_date, pr.name, d.quantity FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE c.name = 'Bilal'",
        "hints": [
          "Join customers, orders, order_items and products, and filter with c.name = 'Bilal'."
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "full-join",
    "module": "joins",
    "db": "company",
    "title": "RIGHT JOIN and FULL OUTER JOIN",
    "concept": "RIGHT JOIN is a LEFT JOIN reversed: it keeps every row of the right table. FULL OUTER JOIN keeps both sides and fills unmatched columns with NULL. MySQL has no FULL JOIN; it is simulated there with a UNION of two LEFT JOINs.",
    "example": "SELECT e.name, d.name FROM employees e RIGHT JOIN departments d ON e.department_id = d.id;",
    "steps": [
      {
        "task": "Show each employee’s name next to their department name, including the employee with no department and the department with no employees.",
        "solution": "SELECT e.name, d.name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.id",
        "hints": [
          "FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.id"
        ],
        "requires": [
          "FULL"
        ]
      }
    ]
  },
  {
    "id": "cross-join",
    "module": "joins",
    "db": "company",
    "title": "Every combination: CROSS JOIN",
    "concept": "CROSS JOIN pairs every row of one table with every row of the other, with no condition: 5 rows by 4 rows give 20. It builds templates, like every department and job title combination. A subquery in FROM works like another table.",
    "example": "SELECT d.name, c.city FROM departments d CROSS JOIN (SELECT DISTINCT city FROM departments) c;",
    "steps": [
      {
        "task": "Show every possible combination of department name and job title (each distinct job title once).",
        "solution": "SELECT d.name, p.role FROM departments d CROSS JOIN (SELECT DISTINCT role FROM employees) p",
        "hints": [
          "The distinct titles come from (SELECT DISTINCT job_title FROM employees).",
          "FROM departments d CROSS JOIN (…) t"
        ],
        "requires": [
          "CROSS JOIN"
        ]
      }
    ]
  },
  {
    "id": "join-distinct",
    "module": "joins",
    "db": "store",
    "title": "A four-table JOIN without repeats",
    "concept": "When joining several tables, the same row can show up several times (a product bought in two orders). DISTINCT keeps each value once.",
    "steps": [
      {
        "task": "List, without repeats, the products ordered by customers from London.",
        "solution": "SELECT DISTINCT pr.name FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE c.city = 'London'",
        "hints": [
          "Path: customers → orders → order_items → products.",
          "SELECT DISTINCT pr.name … WHERE c.city = 'London'"
        ],
        "requires": [
          "JOIN",
          "DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "left-join-coalesce",
    "module": "joins",
    "db": "store",
    "title": "LEFT JOIN with zeros instead of NULL",
    "concept": "With LEFT JOIN, a sum over a group with no rows gives NULL. COALESCE(SUM(...), 0) turns it into 0, which is usually what a report needs.",
    "steps": [
      {
        "task": "Show every product with the units sold of each (as units_sold). Those never sold must show 0.",
        "solution": "SELECT pr.name, COALESCE(SUM(d.quantity), 0) AS units_sold FROM products pr LEFT JOIN order_items d ON d.product_id = pr.id GROUP BY pr.id, pr.name",
        "hints": [
          "products LEFT JOIN order_items, grouping by product.",
          "COALESCE(SUM(d.quantity), 0) AS units_sold"
        ],
        "requires": [
          "LEFT JOIN",
          "COALESCE"
        ]
      }
    ]
  },
  {
    "id": "anti-join",
    "module": "joins",
    "db": "company",
    "title": "Empty departments with LEFT JOIN",
    "concept": "The LEFT JOIN … WHERE right.id IS NULL pattern finds the left rows without a match. It is called an anti-join and works just like NOT EXISTS.",
    "steps": [
      {
        "task": "Show the departments that have no employees. Use LEFT JOIN.",
        "solution": "SELECT d.name FROM departments d LEFT JOIN employees e ON e.department_id = d.id WHERE e.id IS NULL",
        "hints": [
          "Join departments to employees and keep the rows where e.id IS NULL."
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  }
];
