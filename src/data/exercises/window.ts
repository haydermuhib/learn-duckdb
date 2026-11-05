import { ExerciseDef } from "../../types/curriculum";

export const window_exercises: ExerciseDef[] = [
  {
    "id": "row-number",
    "module": "window",
    "db": "store",
    "title": "Numbering rows: ROW_NUMBER",
    "concept": "A window function computes something by looking at other rows, but without collapsing them like GROUP BY: every row stays in the result. ROW_NUMBER() OVER (ORDER BY …) numbers rows 1, 2, 3… in that order.",
    "example": "SELECT name, ROW_NUMBER() OVER (ORDER BY signup_date) FROM customers;",
    "steps": [
      {
        "task": "Show name, price and each product’s position from most expensive (1) to cheapest.",
        "solution": "SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS posicion FROM products",
        "hints": [
          "ROW_NUMBER() OVER (ORDER BY price DESC)"
        ],
        "requires": [
          "ROW_NUMBER",
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "rank",
    "module": "window",
    "db": "store",
    "title": "Ties: RANK and DENSE_RANK",
    "concept": "With ties, RANK gives tied rows the same place and skips the next ones (1, 2, 2, 4); DENSE_RANK skips none (1, 2, 2, 3). A window function can order by an aggregate, like COUNT(*), when there is a GROUP BY.",
    "example": "SELECT city, COUNT(*), RANK() OVER (ORDER BY COUNT(*) DESC) FROM customers GROUP BY city;",
    "steps": [
      {
        "task": "For each customer_id show how many orders they have and their place in a ranking by order count (most orders = place 1), using RANK.",
        "solution": "SELECT customer_id, COUNT(*) AS total_pedidos, RANK() OVER (ORDER BY COUNT(*) DESC) AS lugar FROM orders GROUP BY customer_id",
        "hints": [
          "Group by customer_id and add RANK() OVER (ORDER BY COUNT(*) DESC)."
        ],
        "requires": [
          "RANK",
          "OVER"
        ]
      },
      {
        "task": "Make the same ranking with DENSE_RANK and compare: what place do customers with 1 order get now?",
        "solution": "SELECT customer_id, COUNT(*) AS total_pedidos, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS lugar FROM orders GROUP BY customer_id",
        "hints": [
          "Swap RANK for DENSE_RANK."
        ],
        "requires": [
          "DENSE_RANK"
        ]
      }
    ]
  },
  {
    "id": "partition-by",
    "module": "window",
    "db": "company",
    "title": "Per group: PARTITION BY",
    "concept": "PARTITION BY inside OVER restarts the calculation for each group, without collapsing rows. RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) makes a separate ranking in each department.",
    "example": "SELECT name, role, AVG(salary) OVER (PARTITION BY role) FROM employees;",
    "steps": [
      {
        "task": "Show name, department_id, salary and each employee’s place in a salary ranking within their department (highest paid = 1).",
        "solution": "SELECT name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS lugar FROM employees",
        "hints": [
          "RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)"
        ],
        "requires": [
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "running-total",
    "module": "window",
    "db": "company",
    "title": "Running totals",
    "concept": "SUM(x) OVER (ORDER BY date) adds the current row and every earlier one in that order: a running total. With PARTITION BY it accumulates separately per group.",
    "example": "SELECT name, hire_date, COUNT(*) OVER (ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show name, hire date, salary and the running payroll: the total salary of everyone hired up to that date.",
        "solution": "SELECT name, hire_date, salary, SUM(salary) OVER (ORDER BY hire_date) AS nomina_acumulada FROM employees",
        "hints": [
          "SUM(salary) OVER (ORDER BY hire_date)"
        ],
        "requires": [
          "SUM",
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "lag",
    "module": "window",
    "db": "store",
    "title": "Comparing with the previous row: LAG",
    "concept": "LAG(x) OVER (ORDER BY …) brings x from the previous row; LEAD from the next one. They are how you compute month-to-month changes. On the first row LAG gives NULL because there is no previous one.",
    "example": "SELECT order_date, LAG(order_date) OVER (ORDER BY order_date) FROM orders;",
    "steps": [
      {
        "task": "Show each month (2025-03), how many orders it had and the difference from the previous month.",
        "solution": "WITH m AS (SELECT strftime('%Y-%m', order_date) AS mes, COUNT(*) AS total FROM orders GROUP BY mes) SELECT mes, total, total - LAG(total) OVER (ORDER BY mes) AS cambio FROM m",
        "hints": [
          "First count orders per month in a WITH.",
          "total - LAG(total) OVER (ORDER BY month)"
        ],
        "requires": [
          "LAG"
        ]
      }
    ]
  },
  {
    "id": "percent-total",
    "module": "window",
    "db": "store",
    "title": "Percent of total",
    "concept": "OVER () with empty parentheses makes the window the whole table: SUM(stock) OVER () is the total on every row. That lets you divide each value by the total without a subquery.",
    "example": "SELECT name, stock, SUM(stock) OVER () FROM products;",
    "steps": [
      {
        "task": "Show each product name and what percentage of total inventory its stock is, rounded to 2 decimals.",
        "solution": "SELECT name, ROUND(100.0 * stock / SUM(stock) OVER (), 2) AS porcentaje FROM products",
        "hints": [
          "ROUND(100.0 * stock / SUM(stock) OVER (), 2)"
        ],
        "requires": [
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "top-n-group",
    "module": "window",
    "db": "store",
    "title": "Top N per group",
    "concept": "A window function cannot go in WHERE, because it is computed afterwards. Number the rows in a WITH and filter in the outer query: the standard way to get \"the top 2 of each group\".",
    "example": "WITH r AS (SELECT name, ROW_NUMBER() OVER (ORDER BY price) AS n FROM products) SELECT name FROM r WHERE n <= 3;",
    "steps": [
      {
        "task": "Show the 2 most expensive products in each category: category, name and price.",
        "solution": "WITH r AS (SELECT category, name, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS n FROM products) SELECT category, name, price FROM r WHERE n <= 2",
        "hints": [
          "ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS n inside a WITH.",
          "Outside: WHERE n <= 2."
        ],
        "requires": [
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "lead",
    "module": "window",
    "db": "store",
    "title": "The next row: LEAD",
    "concept": "LEAD(x) OVER (PARTITION BY … ORDER BY …) brings the next row’s value within the same group. On the last row of each group it gives NULL.",
    "example": "SELECT name, LEAD(name) OVER (ORDER BY signup_date) FROM customers;",
    "steps": [
      {
        "task": "For each order show customer_id, order_date and the date of that customer’s next order.",
        "solution": "SELECT customer_id, order_date, LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS siguiente FROM orders",
        "hints": [
          "LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)"
        ],
        "requires": [
          "LEAD"
        ]
      }
    ]
  },
  {
    "id": "running-partition",
    "module": "window",
    "db": "company",
    "title": "Running total per group",
    "concept": "PARTITION BY and ORDER BY combine in one OVER: the total accumulates in order and restarts for each group.",
    "example": "SELECT name, role, COUNT(*) OVER (PARTITION BY role ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show name, department_id, hire date and their department’s running payroll up to their hire.",
        "solution": "SELECT name, department_id, hire_date, SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date) AS nomina_depto FROM employees",
        "hints": [
          "SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date)"
        ],
        "requires": [
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "moving-average",
    "module": "window",
    "db": "store",
    "title": "Moving average with ROWS",
    "concept": "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW limits the window to the current row and the 2 before it. With AVG it gives a 3-period moving average that smooths ups and downs.",
    "example": "SELECT order_date, COUNT(*) OVER (ORDER BY order_date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) FROM orders;",
    "steps": [
      {
        "task": "Show each month, its orders and the 3-month moving average (that month and the 2 before), rounded to 2 decimals.",
        "solution": "WITH m AS (SELECT strftime('%Y-%m', order_date) AS mes, COUNT(*) AS total FROM orders GROUP BY mes) SELECT mes, total, ROUND(AVG(total) OVER (ORDER BY mes ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS promedio_movil FROM m",
        "hints": [
          "Count orders per month in a WITH.",
          "AVG(total) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)"
        ],
        "requires": [
          "ROWS"
        ]
      }
    ]
  },
  {
    "id": "ntile",
    "module": "window",
    "db": "company",
    "title": "Splitting into buckets: NTILE",
    "concept": "NTILE(4) OVER (ORDER BY …) splits the rows into 4 groups as even as possible and says which one each row is in: quartiles. If they cannot be equal, the first groups get one extra row.",
    "example": "SELECT name, NTILE(2) OVER (ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show name, salary and each employee’s salary quartile (1 = the top-paid 25%).",
        "solution": "SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) AS cuartil FROM employees",
        "hints": [
          "NTILE(4) OVER (ORDER BY salary DESC)"
        ],
        "requires": [
          "NTILE"
        ]
      }
    ]
  },
  {
    "id": "first-value",
    "module": "window",
    "db": "company",
    "title": "The first in the group: FIRST_VALUE",
    "concept": "FIRST_VALUE(x) OVER (PARTITION BY … ORDER BY …) returns the first row’s value in each group by that order, repeated on every row of the group.",
    "example": "SELECT name, FIRST_VALUE(name) OVER (ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show each employee’s name and department_id next to the name of the top earner in their department.",
        "solution": "SELECT name, department_id, FIRST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary DESC) AS mejor_pagado FROM employees",
        "hints": [
          "FIRST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary DESC)"
        ],
        "requires": [
          "FIRST_VALUE"
        ]
      }
    ]
  },
  {
    "id": "window-avg",
    "module": "window",
    "db": "company",
    "title": "Comparing with the group average",
    "concept": "AVG(...) OVER (PARTITION BY ...) puts each row’s group average on that row without collapsing the rows, unlike GROUP BY. You see each person next to their area’s average.",
    "steps": [
      {
        "task": "Show each employee’s name, department_id and salary, along with their department’s average salary rounded to 2 decimals.",
        "solution": "SELECT name, department_id, salary, ROUND(AVG(salary) OVER (PARTITION BY department_id), 2) AS promedio_depto FROM employees",
        "hints": [
          "ROUND(AVG(salary) OVER (PARTITION BY department_id), 2)"
        ],
        "requires": [
          "OVER",
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "qualify-clause",
    "module": "window",
    "db": "store",
    "title": "DuckDB Superpower: The QUALIFY Clause",
    "concept": "In Postgres or MySQL, filtering by a window function requires nesting your query inside a CTE or subquery. DuckDB supports QUALIFY, which works like HAVING but for window functions!",
    "example": "SELECT name, category, price FROM products QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) <= 1;",
    "steps": [
      {
        "task": "Find the single most expensive product in each category using QUALIFY with ROW_NUMBER() <= 1.",
        "solution": "SELECT name, category, price FROM products QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1",
        "hints": [
          "SELECT name, category, price FROM products",
          "Add QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1"
        ]
      }
    ],
    "isDuckDbFeature": true
  }
];
