import { ExerciseDef } from "../../types/curriculum";

export const recursive_exercises: ExerciseDef[] = [
  {
    "id": "recursive-series",
    "module": "recursive",
    "db": "store",
    "title": "Generating a series with WITH RECURSIVE",
    "concept": "WITH RECURSIVE has two parts joined by UNION ALL: a starting case and a query that refers to the CTE itself to produce the next row. It repeats until that query returns nothing, so it needs a stop condition.",
    "example": "WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x + 2 FROM n WHERE x < 9) SELECT x FROM n;",
    "steps": [
      {
        "task": "Generate the numbers 1 to 10 and, in another column, their square.",
        "solution": "WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < 10) SELECT n, n * n FROM numbers",
        "hints": [
          "Start: SELECT 1. Step: SELECT n + 1 FROM numbers WHERE n < 10.",
          "WITH RECURSIVE numbers(n) AS (… UNION ALL …) SELECT n, n * n FROM numbers"
        ],
        "requires": [
          "RECURSIVE"
        ]
      }
    ]
  },
  {
    "id": "recursive-calendar",
    "module": "recursive",
    "db": "store",
    "title": "A calendar so no day is missing",
    "concept": "Grouping orders by day hides days with no orders. In DuckDB and standard SQL, generate every date with a recursive CTE using d + INTERVAL 1 DAY, then LEFT JOIN the orders.",
    "example": "WITH RECURSIVE dates(d) AS (SELECT DATE '2025-01-01' UNION ALL SELECT d + INTERVAL 1 DAY FROM dates WHERE d < DATE '2025-01-07') SELECT d FROM dates;",
    "steps": [
      {
        "task": "Show every day of September 2025 (2025-09-01 to 2025-09-30) with how many orders there were that day, including days with 0 (as total_orders).",
        "solution": "WITH RECURSIVE dates(d) AS (SELECT DATE '2025-09-01' UNION ALL SELECT d + INTERVAL 1 DAY FROM dates WHERE d < DATE '2025-09-30') SELECT strftime(d, '%Y-%m-%d') AS order_date, COUNT(p.id) AS total_orders FROM dates LEFT JOIN orders p ON p.order_date = strftime(d, '%Y-%m-%d') GROUP BY d ORDER BY d",
        "hints": [
          "Generate the dates: SELECT DATE '2025-09-01' UNION ALL SELECT d + INTERVAL 1 DAY … WHERE d < DATE '2025-09-30'",
          "LEFT JOIN orders p ON p.order_date = strftime(d, '%Y-%m-%d'), group by d and COUNT(p.id)."
        ],
        "requires": [
          "RECURSIVE",
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "recursive-hierarchy",
    "module": "recursive",
    "db": "company",
    "title": "Walking a hierarchy",
    "concept": "With a table that points to itself (manager_id), the recursive CTE goes down level by level: it starts at one person and each step joins the people who report to those already found. It is how org charts or nested categories are walked.",
    "example": "WITH RECURSIVE chain(id, name, manager_id) AS (SELECT id, name, manager_id FROM employees WHERE name = 'Ali' UNION ALL SELECT e.id, e.name, e.manager_id FROM employees e JOIN chain c ON e.id = c.manager_id) SELECT name FROM chain;",
    "steps": [
      {
        "task": "Show everyone who reports to Ali, directly or indirectly, with their level (1 = reports directly, 2 = reports to someone who reports to him…). Name the level column level.",
        "solution": "WITH RECURSIVE reports(id, name, level) AS (SELECT id, name, 0 FROM employees WHERE name = 'Ali' UNION ALL SELECT e.id, e.name, r.level + 1 FROM employees e JOIN reports r ON e.manager_id = r.id) SELECT name, level FROM reports WHERE level > 0",
        "hints": [
          "Start: SELECT id, name, 0 FROM employees WHERE name = 'Ali'",
          "Step: join employees e to the CTE r ON e.manager_id = r.id and add 1 to the level. Finally drop level 0."
        ],
        "requires": [
          "RECURSIVE"
        ]
      }
    ]
  }
];
