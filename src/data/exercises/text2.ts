import { ExerciseDef } from "../../types/curriculum";

export const text2_exercises: ExerciseDef[] = [
  {
    "id": "substr-instr",
    "module": "text2",
    "db": "store",
    "title": "Cutting text: SUBSTR and INSTR",
    "concept": "SUBSTR(text, start, length) takes a piece of text (the first letter is position 1; without length it runs to the end). INSTR(text, '@') tells where a character appears. MySQL and SQL Server use SUBSTRING and LOCATE or CHARINDEX.",
    "example": "SELECT name, SUBSTR(name, 1, 3) FROM products;",
    "steps": [
      {
        "task": "Show the name of each customer with an email and their email domain (what comes after the @, e.g. gmail.com).",
        "solution": "SELECT name, SUBSTR(email, INSTR(email, '@') + 1) AS dominio FROM customers WHERE email IS NOT NULL",
        "hints": [
          "INSTR(email, '@') gives the position of the @; the domain starts one position later.",
          "SUBSTR(email, INSTR(email, '@') + 1)"
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
    "concept": "REPLACE(text, find, put) swaps every occurrence of a text for another. LENGTH counts characters and TRIM removes spaces at both ends. LOWER and UPPER change case, though in SQLite only for unaccented letters.",
    "example": "SELECT REPLACE(email, '@gmail.com', ''), LENGTH(email) FROM customers;",
    "steps": [
      {
        "task": "Show each product name with spaces replaced by underscores (_) and, in another column, how many characters the original name has.",
        "solution": "SELECT REPLACE(name, ' ', '_') AS guion, LENGTH(name) AS letras FROM products",
        "hints": [
          "REPLACE(name, ' ', '_') and LENGTH(name)"
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
    "title": "Days between dates: julianday",
    "concept": "julianday(date) turns a date into a day number, so subtracting two juliandays gives the days between them. date('now') is today. MySQL uses DATEDIFF and PostgreSQL subtracts dates directly.",
    "example": "SELECT name, julianday('now') - julianday(hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show each employee’s name and how many days passed from their hire date to 2026-01-01.",
        "solution": "SELECT name, julianday('2026-01-01') - julianday(hire_date) AS dias FROM employees",
        "hints": [
          "julianday('2026-01-01') - julianday(hire_date)"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "date-add",
    "module": "text2",
    "db": "store",
    "title": "Adding days to a date",
    "concept": "date(date, '+30 days') adds 30 days. It also takes '-1 month', '+1 year' or 'start of month'. date('now', '-30 days') gives the date a month ago, handy for filtering recent rows.",
    "example": "SELECT name, date(signup_date, '+1 year') FROM customers;",
    "steps": [
      {
        "task": "Show id, order_date and each order’s return deadline: 30 days after the order date.",
        "solution": "SELECT id, order_date, date(order_date, '+30 days') AS limite_devolucion FROM orders",
        "hints": [
          "date(order_date, '+30 days')"
        ],
        "requires": []
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
        "task": "Show how many orders were placed on each day of the week (the day number and the count).",
        "solution": "SELECT strftime('%w', order_date) AS dia, COUNT(*) FROM orders GROUP BY dia",
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
        "task": "Show how many people joined the company each year, from the oldest year to the newest.",
        "solution": "SELECT strftime('%Y', hire_date) AS anio, COUNT(*) FROM employees GROUP BY anio ORDER BY anio",
        "hints": [
          "strftime('%Y', hire_date) AS year, then group and sort by year."
        ],
        "requires": [
          "STRFTIME",
          "GROUP BY"
        ]
      }
    ]
  }
];
