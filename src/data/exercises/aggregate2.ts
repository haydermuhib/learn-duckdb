import { ExerciseDef } from "../../types/curriculum";

export const aggregate2_exercises: ExerciseDef[] = [
  {
    "id": "count-distinct",
    "module": "aggregate2",
    "db": "store",
    "title": "Counting distinct values: COUNT(DISTINCT)",
    "concept": "COUNT(DISTINCT column) counts how many different values there are. COUNT(customer_id) would count a customer once per order.",
    "example": "SELECT COUNT(DISTINCT city) FROM customers;",
    "steps": [
      {
        "task": "Count how many different customers have placed at least one order.",
        "solution": "SELECT COUNT(DISTINCT customer_id) FROM orders",
        "hints": [
          "COUNT(DISTINCT customer_id) on the orders table."
        ],
        "requires": [
          "COUNT(DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "group-two",
    "module": "aggregate2",
    "db": "company",
    "title": "Grouping by two columns",
    "concept": "With GROUP BY a, b each group is a distinct combination of a and b. Use it to cross two categories, like department and job title.",
    "example": "SELECT role, strftime('%Y', hire_date) AS hire_year, COUNT(*) FROM employees GROUP BY role, hire_year;",
    "steps": [
      {
        "task": "Show how many employees hold each job title within each department (department_id, job_title and the count).",
        "solution": "SELECT department_id, role, COUNT(*) FROM employees GROUP BY department_id, role",
        "hints": [
          "GROUP BY department_id, job_title"
        ],
        "requires": [
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "conditional-sum",
    "module": "aggregate2",
    "db": "store",
    "title": "Counting with CASE inside SUM",
    "concept": "SUM(CASE WHEN condition THEN 1 ELSE 0 END) counts only the rows that meet the condition. Several of these columns make a pivot table: one column per value.",
    "example": "SELECT category, SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) FROM products GROUP BY category;",
    "steps": [
      {
        "task": "For each customer_id, show in two columns how many orders were delivered (as delivered) and how many were cancelled (as cancelled).",
        "solution": "SELECT customer_id, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled FROM orders GROUP BY customer_id",
        "hints": [
          "SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered",
          "Do the same for cancelled and group by customer_id."
        ],
        "requires": [
          "CASE",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "integer-division",
    "module": "aggregate2",
    "db": "store",
    "title": "Percentages and division",
    "concept": "In standard SQL, dividing integers can truncate decimals depending on the database engine. In DuckDB, / produces floating-point decimals, while // performs integer division. Multiplying by 100.0 or using CAST(x AS DOUBLE) guarantees exact decimal division across all engines.",
    "example": "SELECT 8 / 14, 8 * 100.0 / 14;",
    "steps": [
      {
        "task": "Work out the percentage of delivered orders, rounded to 1 decimal.",
        "solution": "SELECT ROUND(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) FROM orders",
        "hints": [
          "Delivered / total * 100. Count the delivered ones with SUM(CASE …).",
          "Use 100.0, not 100, so the division keeps decimals."
        ],
        "requires": [
          "ROUND"
        ]
      }
    ]
  },
  {
    "id": "offset",
    "module": "aggregate2",
    "db": "store",
    "title": "Paging with OFFSET",
    "concept": "LIMIT n OFFSET m skips the first m rows and returns the next n. That is how result pages work: page 2 with 5 per page is LIMIT 5 OFFSET 5. Always with ORDER BY, or each page could change.",
    "example": "SELECT name FROM customers ORDER BY name LIMIT 3 OFFSET 3;",
    "steps": [
      {
        "task": "Sort the products by name (A-Z) and show the second page of 5 products: name and price.",
        "solution": "SELECT name, price FROM products ORDER BY name LIMIT 5 OFFSET 5",
        "hints": [
          "ORDER BY name LIMIT 5 OFFSET 5"
        ],
        "requires": [
          "OFFSET"
        ]
      }
    ]
  }
];
