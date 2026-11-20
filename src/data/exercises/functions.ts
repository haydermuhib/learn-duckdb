import { ExerciseDef } from "../../types/curriculum";

export const functions_exercises: ExerciseDef[] = [
  {
    "id": "concat-pipe",
    "module": "functions",
    "db": "store",
    "title": "Joining text with ||",
    "concept": "In DuckDB, PostgreSQL, and SQLite, the || operator concatenates strings: name || ' - ' || city. Note that in standard SQL, if any operand is NULL, the entire expression evaluates to NULL.",
    "example": "SELECT name || ' (' || category || ')' FROM products;",
    "compatibility": {
      "postgres": "native",
      "mysql": "CONCAT() preferred (|| is logical OR in standard MySQL mode)",
      "sqlite": "native",
      "notes": "In standard ANSI SQL and PostgreSQL, || produces NULL if any operand is NULL. In MySQL, || defaults to boolean OR unless PIPES_AS_CONCAT mode is enabled."
    },
    "steps": [
      {
        "task": "Show one column called contact with each customer’s name and city like this: Bilal - London.",
        "solution": "SELECT name || ' - ' || city AS contact FROM customers",
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
    "id": "concat",
    "module": "functions",
    "db": "store",
    "title": "Joining text with CONCAT",
    "concept": "CONCAT(str1, str2, …) is a standard SQL function supported by DuckDB, PostgreSQL, and MySQL. Unlike the || operator, CONCAT() safely ignores NULL values instead of turning the whole result into NULL.",
    "example": "SELECT CONCAT(name, ' (', category, ')') FROM products;",
    "compatibility": {
      "postgres": "native",
      "mysql": "native",
      "sqlite": "Unsupported (use || operator instead)",
      "notes": "CONCAT() safely ignores NULL values across DuckDB, PostgreSQL, and MySQL. SQLite does not have a built-in CONCAT() function."
    },
    "steps": [
      {
        "task": "Combine each customer’s name and city into a single column called contact using CONCAT, formatted like: Bilal - London.",
        "solution": "SELECT CONCAT(name, ' - ', city) AS contact FROM customers",
        "hints": [
          "CONCAT(name, ' - ', city) AS contact"
        ],
        "requires": [
          "CONCAT"
        ]
      }
    ]
  },
  {
    "id": "concat-ws",
    "module": "functions",
    "db": "store",
    "title": "Joining text with separator: CONCAT_WS",
    "concept": "CONCAT_WS(separator, str1, str2, …) stands for \"Concat With Separator\". The first argument is the separator placed between all non-NULL values. If a field is NULL (like a customer without an email), CONCAT_WS skips it cleanly without creating double delimiters.",
    "example": "SELECT CONCAT_WS(' / ', name, category) FROM products;",
    "compatibility": {
      "postgres": "native",
      "mysql": "native",
      "sqlite": "Unsupported (requires custom CASE / || expressions)",
      "notes": "CONCAT_WS is supported identically in DuckDB, PostgreSQL, and MySQL. It automatically skips NULL values without leaving duplicate delimiters."
    },
    "steps": [
      {
        "task": "For each customer, combine their name, email, and city separated by ' - ' into a single column called contact_info.",
        "solution": "SELECT CONCAT_WS(' - ', name, email, city) AS contact_info FROM customers",
        "hints": [
          "CONCAT_WS(' - ', name, email, city) AS contact_info"
        ],
        "requires": [
          "CONCAT_WS"
        ]
      }
    ]
  },
  {
    "id": "dates",
    "module": "functions",
    "db": "store",
    "title": "Parts of a date",
    "concept": "In DuckDB, strftime('%m', date) gives the month, '%Y' the year and '%Y-%m' year and month. You can also use date_trunc('month', date) or month(date).",
    "example": "SELECT name, strftime('%m', signup_date) FROM customers;",
    "steps": [
      {
        "task": "Show how many orders there were each month (format 2025-03) as month and total, sorted from the oldest month to the newest.",
        "solution": "SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS total FROM orders GROUP BY month ORDER BY month",
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
    "example": "SELECT name, CASE WHEN stock = 0 THEN 'Out of Stock' ELSE 'In Stock' END FROM products;",
    "steps": [
      {
        "task": "Show each product’s name and a price_range column: 'Expensive' if it costs 1000 or more, 'Mid-range' if it costs 200 or more, and 'Budget' otherwise.",
        "solution": "SELECT name, CASE WHEN price >= 1000 THEN 'Expensive' WHEN price >= 200 THEN 'Mid-range' ELSE 'Budget' END AS price_range FROM products",
        "hints": [
          "Put the highest condition first: WHEN price >= 1000.",
          "CASE WHEN … THEN 'Expensive' WHEN … THEN 'Mid-range' ELSE 'Budget' END AS price_range"
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
        "solution": "SELECT name, COALESCE(email, 'No email') FROM customers",
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
    "title": "Converting types with CAST and ::",
    "concept": "In standard SQL, CAST(value AS INTEGER) converts types by truncating decimals (unlike ROUND which rounds). DuckDB and PostgreSQL also support the concise shorthand :: operator: (x)::INTEGER or '2026-01-01'::DATE.",
    "example": "SELECT CAST(2.9 AS INTEGER) AS cast_val, 2.9::INTEGER AS colon_val;",
    "compatibility": {
      "postgres": "native (the :: shorthand originated in PostgreSQL)",
      "mysql": "unsupported (:: throws syntax error; must use CAST)",
      "sqlite": "unsupported (:: throws syntax error; must use CAST)",
      "notes": "CAST(x AS type) is standard ANSI SQL supported across all engines. The :: shorthand is native to DuckDB and PostgreSQL (plus Snowflake and Redshift)."
    },
    "steps": [
      {
        "task": "Show each product name, its price with 16% tax as an integer using CAST (as cast_price), and the same integer using DuckDB's :: shorthand (as colon_price).",
        "solution": "SELECT name, CAST(price * 1.16 AS INTEGER) AS cast_price, (price * 1.16)::INTEGER AS colon_price FROM products",
        "hints": [
          "CAST(price * 1.16 AS INTEGER) AS cast_price, (price * 1.16)::INTEGER AS colon_price",
          "SELECT name, CAST(price * 1.16 AS INTEGER) AS cast_price, (price * 1.16)::INTEGER AS colon_price FROM products"
        ],
        "requires": [
          "CAST",
          "::"
        ]
      }
    ]
  },
  {
    "id": "nullif",
    "module": "functions",
    "db": "store",
    "title": "Avoiding division by zero: NULLIF",
    "concept": "NULLIF(a, b) returns NULL if a equals b, otherwise a. Dividing by NULLIF(total, 0) avoids division-by-zero errors in SQL.",
    "example": "SELECT name, price / NULLIF(stock, 0) FROM products;",
    "steps": [
      {
        "task": "For each customer, show what percentage of their orders was cancelled (as cancel_pct), rounded to 1 decimal. Customers with no orders must show NULL: divide by NULLIF(order count, 0).",
        "solution": "SELECT c.name, ROUND(SUM(CASE WHEN p.status = 'cancelled' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(p.id), 0), 1) AS cancel_pct FROM customers c LEFT JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name",
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
        "solution": "SELECT name, printf('$%.2f', price) AS price_text FROM products",
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
