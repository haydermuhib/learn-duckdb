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
        "solution": "WITH RECURSIVE numeros(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numeros WHERE n < 10) SELECT n, n * n FROM numeros",
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
    "concept": "Grouping orders by day hides the days with no orders. Generate every date first with a recursive CTE and date(d, '+1 day'), then LEFT JOIN the orders.",
    "example": "WITH RECURSIVE d(dia) AS (SELECT '2025-01-01' UNION ALL SELECT date(dia, '+1 day') FROM d WHERE dia < '2025-01-07') SELECT dia FROM d;",
    "steps": [
      {
        "task": "Show every day of September 2025 (1 to 30) with how many orders there were that day, including days with 0.",
        "solution": "WITH RECURSIVE dias_mes(d) AS (SELECT '2025-09-01' UNION ALL SELECT date(d, '+1 day') FROM dias_mes WHERE d < '2025-09-30') SELECT d, COUNT(p.id) FROM dias_mes LEFT JOIN orders p ON p.order_date = d GROUP BY d",
        "hints": [
          "Generate the dates: SELECT '2025-09-01' UNION ALL SELECT date(d, '+1 day') … WHERE d < '2025-09-30'",
          "LEFT JOIN orders o ON o.order_date = d, group by d and count COUNT(o.id)."
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
    "example": "WITH RECURSIVE cadena(id, name, manager_id) AS (SELECT id, name, manager_id FROM employees WHERE name = 'Paula Ortega' UNION ALL SELECT e.id, e.name, e.manager_id FROM employees e JOIN cadena c ON e.id = c.manager_id) SELECT name FROM cadena;",
    "steps": [
      {
        "task": "Show everyone who reports to Daniel Castro, directly or indirectly, with their level (1 = reports directly, 2 = reports to someone who reports to him…).",
        "solution": "WITH RECURSIVE subordinados(id, name, nivel) AS (SELECT id, name, 0 FROM employees WHERE name = 'Daniel Castro' UNION ALL SELECT e.id, e.name, s.nivel + 1 FROM employees e JOIN subordinados s ON e.manager_id = s.id) SELECT name, nivel FROM subordinados WHERE nivel > 0",
        "hints": [
          "Start: SELECT id, name, 0 FROM employees WHERE name = 'Daniel Castro'",
          "Step: join employees e to the CTE s ON e.manager_id = s.id and add 1 to the level. Finally drop level 0."
        ],
        "requires": [
          "RECURSIVE"
        ]
      }
    ]
  }
];
