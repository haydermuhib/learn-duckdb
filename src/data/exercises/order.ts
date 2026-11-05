import { ExerciseDef } from "../../types/curriculum";

export const order_exercises: ExerciseDef[] = [
  {
    "id": "order-by",
    "module": "order",
    "db": "store",
    "title": "Sorting with ORDER BY",
    "concept": "Without ORDER BY, the database may return rows in any order. ORDER BY column sorts from low to high (ASC); add DESC for high to low. It goes at the end of the query.",
    "example": "SELECT name, signup_date FROM customers ORDER BY signup_date;",
    "steps": [
      {
        "task": "Show the name and price of every product, from most to least expensive.",
        "solution": "SELECT name, price FROM products ORDER BY price DESC",
        "hints": [
          "ORDER BY price DESC"
        ],
        "requires": [
          "ORDER BY"
        ]
      }
    ]
  },
  {
    "id": "order-two",
    "module": "order",
    "db": "store",
    "title": "Sorting by two columns",
    "concept": "With several columns in ORDER BY, the second only matters when the first is tied. Each column takes its own ASC or DESC.",
    "example": "SELECT category, name, price FROM products ORDER BY category, price DESC;",
    "steps": [
      {
        "task": "Show city and name of the customers, sorted by city (A-Z) and, within each city, by name (A-Z).",
        "solution": "SELECT city, name FROM customers ORDER BY city, name",
        "hints": [
          "ORDER BY city, name"
        ],
        "requires": [
          "ORDER BY"
        ]
      }
    ]
  },
  {
    "id": "limit",
    "module": "order",
    "db": "store",
    "title": "The top rows with LIMIT",
    "concept": "LIMIT n returns only the first n rows. With ORDER BY it gives you a \"top\": the most expensive, the most recent… SQL Server uses SELECT TOP n instead.",
    "example": "SELECT name FROM customers ORDER BY signup_date DESC LIMIT 2;",
    "steps": [
      {
        "task": "Show name and price of the 3 most expensive products.",
        "solution": "SELECT name, price FROM products ORDER BY price DESC LIMIT 3",
        "hints": [
          "First sort from most to least expensive.",
          "End with LIMIT 3."
        ],
        "requires": [
          "LIMIT"
        ]
      }
    ]
  },
  {
    "id": "limit-bottom",
    "module": "order",
    "db": "company",
    "title": "The bottom rows: ORDER BY ASC with LIMIT",
    "concept": "For the lowest values sort from low to high (ASC, the default) and limit. It is the same pattern as a \"top\", reversed.",
    "example": "SELECT name, hire_date FROM employees ORDER BY hire_date LIMIT 2;",
    "steps": [
      {
        "task": "Show name and salary of the 3 lowest-paid employees, from lowest to highest.",
        "solution": "SELECT name, salary FROM employees ORDER BY salary LIMIT 3",
        "hints": [
          "ORDER BY salary LIMIT 3"
        ],
        "requires": [
          "LIMIT"
        ]
      }
    ]
  },
  {
    "id": "order-nulls",
    "module": "order",
    "db": "company",
    "title": "Where NULLs go when sorting",
    "concept": "In SQL sorting, NULL placement depends on the engine. In DuckDB, NULLs come last when sorting ASC by default. To decide yourself, write NULLS FIRST or NULLS LAST after the column.",
    "example": "SELECT name, manager_id FROM employees ORDER BY manager_id NULLS LAST;",
    "steps": [
      {
        "task": "Show name and department_id of the employees sorted by department and then by name, with those who have no department at the end.",
        "solution": "SELECT name, department_id FROM employees ORDER BY department_id NULLS LAST, name",
        "hints": [
          "ORDER BY department_id NULLS LAST, name"
        ],
        "requires": [
          "ORDER BY"
        ]
      }
    ]
  },
  {
    "id": "order-expression",
    "module": "order",
    "db": "store",
    "title": "Sorting by a calculation",
    "concept": "ORDER BY accepts the alias of a calculated column, so you do not repeat the calculation. When two rows tie, a second column decides the order and the result always comes out the same.",
    "example": "SELECT name, price * 1.16 AS with_tax FROM products ORDER BY with_tax;",
    "steps": [
      {
        "task": "Show the name and inventory value (price times stock, named inventory_value) of each product, from highest to lowest. If two tie, sort them by name.",
        "solution": "SELECT name, price * stock AS inventory_value FROM products ORDER BY inventory_value DESC, name",
        "hints": [
          "Name the calculation with AS inventory_value and use it in ORDER BY.",
          "ORDER BY inventory_value DESC, name"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "order-by-all",
    "module": "order",
    "db": "store",
    "title": "DuckDB Superpower: ORDER BY ALL",
    "concept": "Just like GROUP BY ALL, DuckDB lets you order by all selected columns in left-to-right order using ORDER BY ALL.",
    "example": "SELECT category, name, price FROM products ORDER BY ALL DESC;",
    "steps": [
      {
        "task": "Show category, name, and price from products, ordered by all columns using ORDER BY ALL.",
        "solution": "SELECT category, name, price FROM products ORDER BY ALL",
        "hints": [
          "Select category, name, price FROM products",
          "Add ORDER BY ALL"
        ]
      }
    ],
    "isDuckDbFeature": true
  }
];
