import { ExerciseDef } from "../../types/curriculum";

export const functions_exercises: ExerciseDef[] = [
  {
    "id": "concat",
    "module": "functions",
    "db": "store",
    "title": "Joining text with ||",
    "concept": "In SQLite and PostgreSQL, || joins text: name || ' - ' || city. MySQL uses CONCAT(name, ' - ', city) and SQL Server uses +.",
    "example": "SELECT name || ' (' || category || ')' FROM products;",
    "steps": [
      {
        "task": "Show one column called contact with each customer’s name and city like this: Ana López - Monterrey.",
        "solution": "SELECT name || ' - ' || city AS contacto FROM customers",
        "hints": [
          "name || ' - ' || city AS contact"
        ],
        "requires": [
          "||"
        ]
      }
    ]
  },
  {
    "id": "dates",
    "module": "functions",
    "db": "store",
    "title": "Parts of a date",
    "concept": "In SQLite, strftime('%m', date) gives the month, '%Y' the year and '%Y-%m' year and month. Other databases use MONTH(date) or EXTRACT(MONTH FROM date), but the idea is the same.",
    "example": "SELECT name, strftime('%m', signup_date) FROM customers;",
    "steps": [
      {
        "task": "Show how many orders there were each month (format 2025-03), sorted from the oldest month to the newest.",
        "solution": "SELECT strftime('%Y-%m', order_date) AS mes, COUNT(*) FROM orders GROUP BY mes ORDER BY mes",
        "hints": [
          "strftime('%Y-%m', order_date) AS month",
          "Group and sort by month."
        ],
        "requires": [
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "case",
    "module": "functions",
    "db": "store",
    "title": "Conditions with CASE",
    "concept": "CASE is SQL’s \"if\": CASE WHEN condition THEN value … ELSE other END. It checks the conditions in order and uses the first one that is true.",
    "example": "SELECT name, CASE WHEN stock = 0 THEN 'Agotado' ELSE 'Disponible' END FROM products;",
    "steps": [
      {
        "task": "Show each product’s name and a price_range column: 'Expensive' if it costs 3000 or more, 'Mid-range' if it costs 500 or more, and 'Budget' otherwise.",
        "solution": "SELECT name, CASE WHEN price >= 3000 THEN 'Caro' WHEN price >= 500 THEN 'Medio' ELSE 'Económico' END AS rango FROM products",
        "hints": [
          "Put the highest condition first: WHEN price >= 3000.",
          "CASE WHEN … THEN 'Expensive' WHEN … THEN 'Mid-range' ELSE 'Budget' END"
        ],
        "requires": [
          "CASE"
        ]
      }
    ]
  },
  {
    "id": "coalesce",
    "module": "functions",
    "db": "store",
    "title": "Replacing NULL with COALESCE",
    "concept": "COALESCE(a, b, …) returns the first value that is not NULL. Use it to show a text or a 0 when a value is missing.",
    "example": "SELECT name, COALESCE(email, city) FROM customers;",
    "steps": [
      {
        "task": "Show each customer’s name and email; if there is no email, show the text 'No email'.",
        "solution": "SELECT name, COALESCE(email, 'Sin email') FROM customers",
        "hints": [
          "COALESCE(email, 'No email')"
        ],
        "requires": [
          "COALESCE"
        ]
      }
    ]
  },
  {
    "id": "cast",
    "module": "functions",
    "db": "store",
    "title": "Converting types with CAST",
    "concept": "CAST(value AS INTEGER) converts to a whole number by dropping decimals (it does not round); CAST(x AS TEXT) or AS REAL convert to text or decimal. ROUND rounds, CAST truncates.",
    "example": "SELECT CAST(2.9 AS INTEGER), ROUND(2.9);",
    "steps": [
      {
        "task": "Show each product name and its price with tax (price times 1.16) as a whole number, dropping the cents (no rounding).",
        "solution": "SELECT name, CAST(price * 1.16 AS INTEGER) AS precio_entero FROM products",
        "hints": [
          "CAST(price * 1.16 AS INTEGER)"
        ],
        "requires": [
          "CAST"
        ]
      }
    ]
  },
  {
    "id": "nullif",
    "module": "functions",
    "db": "store",
    "title": "Avoiding division by zero: NULLIF",
    "concept": "NULLIF(a, b) returns NULL if a equals b, otherwise a. Dividing by NULLIF(total, 0) avoids the division-by-zero error in SQL Server and PostgreSQL (SQLite already returns NULL, but the habit protects you elsewhere).",
    "example": "SELECT name, price / NULLIF(stock, 0) FROM products;",
    "steps": [
      {
        "task": "For each customer, show what percentage of their orders was cancelled, rounded to 1 decimal. Customers with no orders must show NULL: divide by NULLIF(order count, 0).",
        "solution": "SELECT c.name, ROUND(SUM(CASE WHEN p.status = 'cancelled' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(p.id), 0), 1) AS porcentaje FROM customers c LEFT JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name",
        "hints": [
          "LEFT JOIN customers to orders and count with COUNT(o.id).",
          "SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(o.id), 0)"
        ],
        "requires": [
          "NULLIF",
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "case-order",
    "module": "functions",
    "db": "store",
    "title": "Custom order with CASE",
    "concept": "ORDER BY takes any expression, including a CASE. That lets you sort by your own criterion that is neither alphabetical nor numeric, like a status priority.",
    "example": "SELECT name, category FROM products ORDER BY CASE category WHEN 'Sports' THEN 1 ELSE 2 END, name;",
    "steps": [
      {
        "task": "Show id, order_date and status of the orders: shipped first, then delivered, then cancelled; within each status, oldest first.",
        "solution": "SELECT id, order_date, status FROM orders ORDER BY CASE status WHEN 'shipped' THEN 1 WHEN 'delivered' THEN 2 ELSE 3 END, order_date",
        "hints": [
          "ORDER BY CASE status WHEN 'shipped' THEN 1 WHEN 'delivered' THEN 2 ELSE 3 END, order_date"
        ],
        "requires": [
          "CASE",
          "ORDER BY"
        ]
      }
    ]
  },
  {
    "id": "upper-lower",
    "module": "functions",
    "db": "store",
    "title": "Upper and lower case",
    "concept": "UPPER turns text into upper case and LOWER into lower case. They help compare text regardless of case, or clean data before saving it.",
    "example": "SELECT UPPER(city) FROM customers;",
    "steps": [
      {
        "task": "Show each product’s name in upper case and its category in lower case.",
        "solution": "SELECT UPPER(name), LOWER(category) FROM products",
        "hints": [
          "SELECT UPPER(name), LOWER(category) FROM products"
        ],
        "requires": [
          "UPPER",
          "LOWER"
        ]
      }
    ]
  },
  {
    "id": "printf",
    "module": "functions",
    "db": "store",
    "title": "Formatting with printf",
    "concept": "printf (or format) builds text from a template: %.2f writes a number with 2 decimals, %d an integer and %s text. printf('$%.2f', 45) gives $45.00. MySQL uses FORMAT and PostgreSQL to_char.",
    "example": "SELECT printf('%s (%d)', name, stock) FROM products;",
    "steps": [
      {
        "task": "Show each product’s name and its price as text with a dollar sign and two decimals, like $649.00. Name that column price_text.",
        "solution": "SELECT name, printf('$%.2f', price) AS precio_texto FROM products",
        "hints": [
          "printf('$%.2f', price) AS price_text"
        ],
        "requires": [
          "PRINTF"
        ]
      }
    ]
  }
];
