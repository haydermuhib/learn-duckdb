import { ExerciseDef } from "../../types/curriculum";

export const subqueries_exercises: ExerciseDef[] = [
  {
    "id": "subquery-scalar",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery that returns a value",
    "concept": "A subquery is a SELECT in parentheses inside another query. If it returns a single value, you can use it like a number: price > (SELECT AVG(price) FROM products).",
    "example": "SELECT name FROM products WHERE price = (SELECT MAX(price) FROM products);",
    "steps": [
      {
        "task": "Show name and price of the products that cost more than the average price. Work out the average with a subquery.",
        "solution": "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)",
        "hints": [
          "WHERE price > (SELECT AVG(price) FROM products)"
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "subquery-in",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery with IN",
    "concept": "If the subquery returns a list, use it with IN: WHERE id IN (SELECT …). It is another way to relate tables without a JOIN.",
    "example": "SELECT name FROM products WHERE id IN (SELECT product_id FROM order_items WHERE quantity >= 3);",
    "steps": [
      {
        "task": "Show the names of the customers with at least one order in shipped status. Use IN with a subquery.",
        "solution": "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'shipped')",
        "hints": [
          "The subquery is SELECT customer_id FROM orders WHERE status = 'shipped'."
        ],
        "requires": [
          "IN",
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "not-exists",
    "module": "subqueries",
    "db": "store",
    "title": "NOT IN and unsold products",
    "concept": "NOT IN keeps the rows whose value is not in the subquery’s list. Careful: if that list contains a NULL, NOT IN returns nothing; use NOT EXISTS or a LEFT JOIN then.",
    "example": "SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);",
    "steps": [
      {
        "task": "Show the names of the products that have never been ordered.",
        "solution": "SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM order_items)",
        "hints": [
          "id NOT IN (SELECT product_id FROM order_items)"
        ],
        "requires": [
          "NOT IN",
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "cte",
    "module": "subqueries",
    "db": "store",
    "title": "Step-by-step queries with WITH",
    "concept": "WITH name AS (SELECT …) creates a temporary table (a CTE) the next query can use as if it existed. It splits a hard query into steps you read top to bottom.",
    "example": "WITH caros AS (SELECT * FROM products WHERE price > 1000) SELECT category, COUNT(*) FROM caros GROUP BY category;",
    "steps": [
      {
        "task": "With WITH, first work out the units ordered per product, then show the name and total of the products with 4 units or more.",
        "solution": "WITH unidades AS (SELECT product_id, SUM(quantity) AS total FROM order_items GROUP BY product_id) SELECT pr.name, u.total FROM unidades u JOIN products pr ON pr.id = u.product_id WHERE u.total >= 4",
        "hints": [
          "WITH units AS (SELECT product_id, SUM(quantity) AS total FROM order_items GROUP BY product_id)",
          "Then join units with products and filter total >= 4."
        ],
        "requires": [
          "WITH"
        ]
      }
    ]
  },
  {
    "id": "derived-table",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery in FROM",
    "concept": "A subquery in FROM is used as if it were a table (some databases require an alias). It lets you aggregate twice: count per customer first, then average those counts.",
    "example": "SELECT MAX(total) FROM (SELECT city, COUNT(*) AS total FROM customers GROUP BY city);",
    "steps": [
      {
        "task": "Work out the average number of orders per customer who has bought, rounded to 2 decimals. Count per customer in a subquery first.",
        "solution": "SELECT ROUND(AVG(total), 2) FROM (SELECT customer_id, COUNT(*) AS total FROM orders GROUP BY customer_id)",
        "hints": [
          "SELECT ROUND(AVG(total), 2) FROM (SELECT customer_id, COUNT(*) AS total FROM orders GROUP BY customer_id)"
        ],
        "requires": [
          "FROM (SELECT"
        ]
      }
    ]
  },
  {
    "id": "scalar-select",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery in SELECT",
    "concept": "A subquery returning one value can be a SELECT column. If correlated, it runs for each row. When it finds nothing it gives NULL, which COALESCE can turn into 0.",
    "example": "SELECT name, (SELECT COUNT(*) FROM orders WHERE customer_id = customers.id) FROM customers;",
    "steps": [
      {
        "task": "Show each product’s name and how many units of it have been ordered (0 if never), using a subquery in the SELECT.",
        "solution": "SELECT name, (SELECT COALESCE(SUM(quantity), 0) FROM order_items d WHERE d.product_id = products.id) AS unidades FROM products",
        "hints": [
          "(SELECT SUM(quantity) FROM order_items i WHERE i.product_id = products.id)",
          "Wrap the sum in COALESCE(…, 0)."
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "cte-chain",
    "module": "subqueries",
    "db": "store",
    "title": "Chaining several WITHs",
    "concept": "One WITH can define several temporary tables separated by commas, and each can use the earlier ones. A hard question becomes named steps.",
    "example": "WITH a AS (SELECT * FROM products WHERE stock > 0), b AS (SELECT category, COUNT(*) AS total FROM a GROUP BY category) SELECT * FROM b;",
    "steps": [
      {
        "task": "Show the name and total spending of the customers who spent more than average (quantity times price, no cancelled orders). Use two WITH steps: spending per customer, then its average.",
        "solution": "WITH gasto AS (SELECT p.customer_id, SUM(d.quantity * pr.price) AS total FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY p.customer_id), promedio AS (SELECT AVG(total) AS valor FROM gasto) SELECT c.name, g.total FROM gasto g JOIN customers c ON c.id = g.customer_id JOIN promedio ON g.total > promedio.valor",
        "hints": [
          "WITH spending AS (…per customer…), average AS (SELECT AVG(total) AS value FROM spending)",
          "Join spending with customers and keep total > average.value."
        ],
        "requires": [
          "WITH"
        ]
      }
    ]
  },
  {
    "id": "subquery-max",
    "module": "subqueries",
    "db": "company",
    "title": "Who has the maximum",
    "concept": "MAX(salary) tells you the highest salary, but not whose it is. To see the whole row, compare against a subquery: WHERE salary = (SELECT MAX(salary) FROM employees). If there is a tie, all of them show up.",
    "steps": [
      {
        "task": "Show the name, job title and salary of whoever earns the most in the company.",
        "solution": "SELECT name, role, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees)",
        "hints": [
          "WHERE salary = (SELECT MAX(salary) FROM employees)"
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "correlated-latest",
    "module": "subqueries",
    "db": "store",
    "title": "Correlated subquery: the latest of each",
    "concept": "A correlated subquery uses a column from the outer query, so it is computed again for each row. It lets you compare each row with its own group, like each customer’s latest order.",
    "steps": [
      {
        "task": "For each customer with orders, show their customer_id and the id and date of their most recent order.",
        "solution": "SELECT p.customer_id, p.id, p.order_date FROM orders p WHERE p.order_date = (SELECT MAX(p2.order_date) FROM orders p2 WHERE p2.customer_id = p.customer_id)",
        "hints": [
          "Use two aliases of orders: o outside and o2 inside.",
          "WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id)"
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "cte-filter",
    "module": "subqueries",
    "db": "company",
    "title": "Filtering the result of a WITH",
    "concept": "A WITH can compute totals and the main query can filter them with a plain WHERE, no HAVING needed. It often reads more easily than one long query.",
    "steps": [
      {
        "task": "With a WITH named payroll, compute the total salary of each department. Then show the names of the departments whose payroll is over 100000, with that total.",
        "solution": "WITH nomina AS (SELECT department_id, SUM(salary) AS total FROM employees GROUP BY department_id) SELECT d.name, n.total FROM nomina n JOIN departments d ON d.id = n.department_id WHERE n.total > 100000",
        "hints": [
          "WITH payroll AS (SELECT department_id, SUM(salary) AS total FROM employees GROUP BY department_id)",
          "Join payroll to departments and filter WHERE p.total > 100000."
        ],
        "requires": [
          "WITH"
        ]
      }
    ]
  }
];
