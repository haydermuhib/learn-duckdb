import { ExerciseDef } from "../../types/curriculum";

export const group_exercises: ExerciseDef[] = [
  {
    "id": "group-by",
    "module": "group",
    "db": "store",
    "title": "Grouping with GROUP BY",
    "concept": "GROUP BY puts rows with the same value together and computes the aggregate for each group. Every SELECT column that is not inside an aggregate must be in the GROUP BY.",
    "example": "SELECT category, COUNT(*) FROM products GROUP BY category;",
    "steps": [
      {
        "task": "Show each city and how many customers it has.",
        "solution": "SELECT city, COUNT(*) FROM customers GROUP BY city",
        "hints": [
          "Group by city and count with COUNT(*)."
        ],
        "requires": [
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "group-sum",
    "module": "group",
    "db": "company",
    "title": "Totals per group",
    "concept": "Any aggregate works per group: SUM, AVG, MIN, MAX… An alias on the calculated column makes the result easier to read.",
    "example": "SELECT role, AVG(salary) AS avg_salary FROM employees GROUP BY role;",
    "steps": [
      {
        "task": "Show each job title and the total salary of the people who hold it.",
        "solution": "SELECT role, SUM(salary) FROM employees GROUP BY role",
        "hints": [
          "SELECT job_title, SUM(salary) … GROUP BY job_title"
        ],
        "requires": [
          "GROUP BY",
          "SUM"
        ]
      }
    ]
  },
  {
    "id": "having",
    "module": "group",
    "db": "store",
    "title": "Filtering groups with HAVING",
    "concept": "WHERE filters rows before grouping; HAVING filters groups afterwards. That is why conditions on an aggregate, like COUNT(*) > 2, go in HAVING, not WHERE.",
    "example": "SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 2;",
    "steps": [
      {
        "task": "Show the cities with at least 2 customers, with their customer count.",
        "solution": "SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) >= 2",
        "hints": [
          "Group by city and add HAVING COUNT(*) >= 2."
        ],
        "requires": [
          "HAVING"
        ]
      }
    ]
  },
  {
    "id": "group-order",
    "module": "group",
    "db": "store",
    "title": "Group and sort",
    "concept": "Clauses always go in this order: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. ORDER BY can use a calculated column’s alias.",
    "example": "SELECT city, COUNT(*) AS total FROM customers GROUP BY city ORDER BY total DESC;",
    "steps": [
      {
        "task": "Show each category with the average price of its products rounded to 2 decimals, from most to least expensive. Name the average column avg_price.",
        "solution": "SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY avg_price DESC",
        "hints": [
          "ROUND(AVG(price), 2) AS avg_price",
          "End with ORDER BY avg_price DESC."
        ],
        "requires": [
          "GROUP BY",
          "ORDER BY"
        ]
      }
    ]
  },
  {
    "id": "where-and-having",
    "module": "group",
    "db": "store",
    "title": "WHERE and HAVING together",
    "concept": "You can use both: WHERE drops rows before grouping and HAVING drops groups afterwards. Ask whether the condition is about a row (WHERE) or a group summary (HAVING).",
    "example": "SELECT city, COUNT(*) FROM customers WHERE email IS NOT NULL GROUP BY city HAVING COUNT(*) > 1;",
    "steps": [
      {
        "task": "Counting only products with stock above 0, show the categories with at least 3 such products and how many.",
        "solution": "SELECT category, COUNT(*) FROM products WHERE stock > 0 GROUP BY category HAVING COUNT(*) >= 3",
        "hints": [
          "stock > 0 is about each product: it goes in WHERE.",
          "COUNT(*) >= 3 is about the group: it goes in HAVING."
        ],
        "requires": [
          "WHERE",
          "HAVING"
        ]
      }
    ]
  },
  {
    "id": "group-concat",
    "module": "group",
    "db": "store",
    "title": "Joining a group’s values: STRING_AGG",
    "concept": "STRING_AGG(column, ', ') joins each group's values into a single text string separated by a delimiter. You can add ORDER BY inside the parentheses to control the order. (While SQLite uses GROUP_CONCAT, modern SQL standards and DuckDB use STRING_AGG).",
    "example": "SELECT city, STRING_AGG(name, ', ') FROM customers GROUP BY city;",
    "steps": [
      {
        "task": "Show each category with the list of its products in alphabetical order, separated by comma and space (', '). Name the column product_list.",
        "solution": "SELECT category, STRING_AGG(name, ', ' ORDER BY name) AS product_list FROM products GROUP BY category",
        "hints": [
          "STRING_AGG(name, ', ' ORDER BY name) AS product_list",
          "SELECT category, STRING_AGG(name, ', ' ORDER BY name) AS product_list FROM products GROUP BY category"
        ],
        "requires": [
          "STRING_AGG"
        ]
      }
    ]
  },
  {
    "id": "group-having-sum",
    "module": "group",
    "db": "store",
    "title": "HAVING with a sum",
    "concept": "HAVING can use any aggregate, not just COUNT. First GROUP BY builds the groups, then each one’s sum is calculated and HAVING keeps those that qualify.",
    "steps": [
      {
        "task": "Show the categories whose inventory is worth more than 20000 in total (sum of price times stock), naming the column total_value.",
        "solution": "SELECT category, SUM(price * stock) AS total_value FROM products GROUP BY category HAVING SUM(price * stock) > 20000",
        "hints": [
          "Group by category and sum price * stock AS total_value.",
          "HAVING SUM(price * stock) > 20000"
        ],
        "requires": [
          "HAVING"
        ]
      }
    ]
  },
  {
    "id": "group-avg-dept",
    "module": "group",
    "db": "company",
    "title": "Counting and averaging by group",
    "concept": "One GROUP BY can compute several aggregates at once. Rows with NULL in the grouping column form their own group; if you do not want them, drop them with WHERE before grouping.",
    "steps": [
      {
        "task": "For each department, show its id, how many employees it has and its average salary rounded to 2 decimals. Leave out anyone without a department.",
        "solution": "SELECT department_id, COUNT(*), ROUND(AVG(salary), 2) FROM employees WHERE department_id IS NOT NULL GROUP BY department_id",
        "hints": [
          "WHERE department_id IS NOT NULL goes before GROUP BY.",
          "SELECT department_id, COUNT(*), ROUND(AVG(salary), 2) …"
        ],
        "requires": [
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "group-by-all",
    "module": "group",
    "db": "store",
    "title": "DuckDB Superpower: GROUP BY ALL",
    "concept": "DuckDB eliminates the tedious repetition of GROUP BY column1, column2... with GROUP BY ALL. DuckDB automatically infers all non-aggregated columns and groups by them!",
    "example": "SELECT category, COUNT(*), AVG(price) FROM products GROUP BY ALL;",
    "steps": [
      {
        "task": "Show category and total stock per category (SUM(stock)) using GROUP BY ALL.",
        "solution": "SELECT category, SUM(stock) AS total_stock FROM products GROUP BY ALL",
        "hints": [
          "Select category, SUM(stock) AS total_stock FROM products",
          "Add GROUP BY ALL at the end instead of naming category"
        ]
      }
    ],
    "isDuckDbFeature": true
  }
];
