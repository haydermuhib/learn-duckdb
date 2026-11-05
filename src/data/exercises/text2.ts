import { ExerciseDef } from "../../types/curriculum";

export const text2_exercises: ExerciseDef[] = [
  {
    "id": "substr-instr",
    "module": "text2",
    "db": "store",
    "title": "Cutting text: SUBSTR and STRPOS",
    "concept": "SUBSTR(text, start, length) extracts a substring (1-indexed). In DuckDB and PostgreSQL, STRPOS(string, search) finds the 1-based index of a substring (standard SQL also supports POSITION(search IN string)).",
    "example": "SELECT name, SUBSTR(name, 1, 3), STRPOS(name, 'a') FROM products;",
    "steps": [
      {
        "task": "Show the name of each customer with an email and their email domain (what comes after the @, e.g. gmail.com) as domain.",
        "solution": "SELECT name, SUBSTR(email, STRPOS(email, '@') + 1) AS domain FROM customers WHERE email IS NOT NULL",
        "hints": [
          "STRPOS(email, '@') gives the position of the @; the domain starts one position later.",
          "SUBSTR(email, STRPOS(email, '@') + 1) AS domain"
        ],
        "requires": [
          "SUBSTR"
        ]
      }
    ]
  },
  {
    "id": "replace-length",
    "module": "text2",
    "db": "store",
    "title": "REPLACE, LENGTH and TRIM",
    "concept": "REPLACE(text, find, put) swaps every occurrence of a text for another. LENGTH counts characters and TRIM removes spaces at both ends. LOWER and UPPER change case.",
    "example": "SELECT REPLACE(email, '@gmail.com', ''), LENGTH(email) FROM customers;",
    "steps": [
      {
        "task": "Show each product name with spaces replaced by underscores (_) as slug and, in another column, how many characters the original name has as char_count.",
        "solution": "SELECT REPLACE(name, ' ', '_') AS slug, LENGTH(name) AS char_count FROM products",
        "hints": [
          "REPLACE(name, ' ', '_') AS slug and LENGTH(name) AS char_count"
        ],
        "requires": [
          "REPLACE",
          "LENGTH"
        ]
      }
    ]
  },
  {
    "id": "date-diff",
    "module": "text2",
    "db": "company",
    "title": "Days between dates: DATE_DIFF",
    "concept": "In DuckDB, date_diff('day', start_date, end_date) calculates the number of days between two dates. You can also subtract dates directly: CAST(date2 AS DATE) - CAST(date1 AS DATE).",
    "example": "SELECT name, date_diff('day', CAST(hire_date AS DATE), DATE '2026-01-01') FROM employees;",
    "steps": [
      {
        "task": "Show each employee’s name and how many days passed from their hire date to 2026-01-01 (as days).",
        "solution": "SELECT name, date_diff('day', CAST(hire_date AS DATE), DATE '2026-01-01') AS days FROM employees",
        "hints": [
          "date_diff('day', CAST(hire_date AS DATE), DATE '2026-01-01') AS days",
          "SELECT name, date_diff('day', CAST(hire_date AS DATE), DATE '2026-01-01') AS days FROM employees"
        ],
        "requires": [
          "DATE_DIFF"
        ]
      }
    ]
  },
  {
    "id": "date-add",
    "module": "text2",
    "db": "store",
    "title": "Adding days: Date arithmetic with INTERVAL",
    "concept": "In DuckDB and standard SQL, you add intervals directly to dates: date_col + INTERVAL 30 DAY. You can also subtract: CURRENT_DATE - INTERVAL 30 DAY.",
    "example": "SELECT name, CAST(signup_date AS DATE) + INTERVAL 1 YEAR FROM customers;",
    "steps": [
      {
        "task": "Show id, order_date and each order’s return deadline: 30 days after the order date (as return_deadline).",
        "solution": "SELECT id, order_date, CAST(order_date AS DATE) + INTERVAL 30 DAY AS return_deadline FROM orders",
        "hints": [
          "CAST(order_date AS DATE) + INTERVAL 30 DAY AS return_deadline"
        ],
        "requires": [
          "INTERVAL"
        ]
      }
    ]
  },
  {
    "id": "weekday",
    "module": "text2",
    "db": "store",
    "title": "Day of the week",
    "concept": "strftime('%w', date) gives the day of the week as a number: 0 is Sunday, 1 Monday… and 6 Saturday. Grouping by it shows which days sell the most.",
    "example": "SELECT name, strftime('%w', signup_date) FROM customers;",
    "steps": [
      {
        "task": "Show how many orders were placed on each day of the week (the day number as weekday and the count as total_orders).",
        "solution": "SELECT strftime('%w', order_date) AS weekday, COUNT(*) AS total_orders FROM orders GROUP BY weekday",
        "hints": [
          "strftime('%w', order_date) AS weekday … GROUP BY weekday"
        ],
        "requires": [
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "hire-year",
    "module": "text2",
    "db": "company",
    "title": "Grouping by year",
    "concept": "strftime('%Y', date) pulls the year out of a date. Grouping by that value gives a count per year, the basis of almost any trend chart.",
    "steps": [
      {
        "task": "Show how many people joined the company each year (as hire_year and total), from the oldest year to the newest.",
        "solution": "SELECT strftime('%Y', hire_date) AS hire_year, COUNT(*) AS total FROM employees GROUP BY hire_year ORDER BY hire_year",
        "hints": [
          "strftime('%Y', hire_date) AS hire_year, then group and sort by hire_year."
        ],
        "requires": [
          "STRFTIME",
          "GROUP BY"
        ]
      }
    ]
  }
];
