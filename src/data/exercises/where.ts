import { ExerciseDef } from "../../types/curriculum";

export const where_exercises: ExerciseDef[] = [
  {
    "id": "where-number",
    "module": "where",
    "db": "store",
    "title": "Filtering with WHERE",
    "concept": "WHERE goes after FROM and keeps only the rows that meet the condition. The operators are = <> (not equal) < > <= and >=.",
    "example": "SELECT name FROM products WHERE stock < 10;",
    "steps": [
      {
        "task": "Show the name and price of the products that cost more than 1000.",
        "solution": "SELECT name, price FROM products WHERE price > 1000",
        "hints": [
          "The condition is price > 1000."
        ],
        "requires": [
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "where-text",
    "module": "where",
    "db": "store",
    "title": "Comparing text",
    "concept": "Text goes in single quotes: 'Monterrey'. Without them, SQL would think Monterrey is a column name. Double quotes are for column names, not text.",
    "example": "SELECT * FROM customers WHERE city = 'London';",
    "steps": [
      {
        "task": "Show the names of the customers who live in Monterrey.",
        "solution": "SELECT name FROM customers WHERE city = 'Birmingham'",
        "hints": [
          "The condition is city = 'Birmingham', in single quotes."
        ],
        "requires": [
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "and",
    "module": "where",
    "db": "store",
    "title": "Several conditions with AND",
    "concept": "AND requires both conditions to be true; OR requires at least one. You can chain as many as you need.",
    "example": "SELECT * FROM orders WHERE status = 'delivered' AND customer_id = 1;",
    "steps": [
      {
        "task": "Show the name and stock of the products in the Electronics category that are in stock (stock greater than 0).",
        "solution": "SELECT name, stock FROM products WHERE category = 'Electronics' AND stock > 0",
        "hints": [
          "Join category = 'Electronics' and stock > 0 with AND."
        ],
        "requires": [
          "AND"
        ]
      }
    ]
  },
  {
    "id": "or-parens",
    "module": "where",
    "db": "store",
    "title": "OR and parentheses",
    "concept": "AND is evaluated before OR, the way multiplication comes before addition. a OR b AND c means a OR (b AND c). Use parentheses to say exactly what you mean.",
    "example": "SELECT * FROM customers WHERE (city = 'London' OR city = 'Leeds') AND email IS NOT NULL;",
    "steps": [
      {
        "task": "Show name, category and price of the Home or Sports products that cost less than 1000.",
        "solution": "SELECT name, category, price FROM products WHERE (category = 'Home' OR category = 'Sports') AND price < 1000",
        "hints": [
          "Without parentheses, \"less than 1000\" would only apply to Sports.",
          "(category = 'Home' OR category = 'Sports') AND price < 1000"
        ],
        "requires": [
          "OR"
        ]
      }
    ]
  },
  {
    "id": "in",
    "module": "where",
    "db": "store",
    "title": "Lists with IN",
    "concept": "IN compares against a list of values: status IN ('a', 'b') equals status = 'a' OR status = 'b', but reads better. NOT IN does the opposite.",
    "example": "SELECT name FROM customers WHERE city IN ('London', 'Leeds');",
    "steps": [
      {
        "task": "Show id, order_date and status of the orders whose status is shipped or cancelled. Use IN.",
        "solution": "SELECT id, order_date, status FROM orders WHERE status IN ('shipped', 'cancelled')",
        "hints": [
          "status IN ('shipped', 'cancelled')"
        ],
        "requires": [
          "IN"
        ]
      }
    ]
  },
  {
    "id": "between",
    "module": "where",
    "db": "store",
    "title": "Ranges with BETWEEN",
    "concept": "BETWEEN a AND b includes both ends. In this database dates are text in YYYY-MM-DD format, which sorts like dates, so BETWEEN works on them too.",
    "example": "SELECT name, price FROM products WHERE price BETWEEN 400 AND 700;",
    "steps": [
      {
        "task": "Show id and order_date of the orders placed between May 1 and July 31, 2025.",
        "solution": "SELECT id, order_date FROM orders WHERE order_date BETWEEN '2025-05-01' AND '2025-07-31'",
        "hints": [
          "Dates go in quotes: '2025-05-01'."
        ],
        "requires": [
          "BETWEEN"
        ]
      }
    ]
  },
  {
    "id": "like",
    "module": "where",
    "db": "store",
    "title": "Searching text with LIKE",
    "concept": "LIKE matches patterns: % stands for any number of characters and _ for exactly one. 'A%' starts with A, '%ez' ends in ez and '%sol%' contains \"sol\".",
    "example": "SELECT name FROM customers WHERE name LIKE '%z';",
    "steps": [
      {
        "task": "Show name and email of the customers with a gmail.com address.",
        "solution": "SELECT name, email FROM customers WHERE email LIKE '%@gmail.com'",
        "hints": [
          "The email must end in @gmail.com: '%@gmail.com'."
        ],
        "requires": [
          "LIKE"
        ]
      }
    ]
  },
  {
    "id": "null",
    "module": "where",
    "db": "store",
    "title": "Missing values: IS NULL",
    "concept": "NULL means \"no value\". It is not 0 or empty text, and nothing equals NULL: email = NULL is never true. Use IS NULL to find it and IS NOT NULL for the opposite.",
    "example": "SELECT name FROM customers WHERE email IS NOT NULL;",
    "steps": [
      {
        "task": "Show the names of the customers with no email on file.",
        "solution": "SELECT name FROM customers WHERE email IS NULL",
        "hints": [
          "email = NULL does not work; write email IS NULL."
        ],
        "requires": [
          "IS NULL"
        ]
      }
    ]
  },
  {
    "id": "not-equal",
    "module": "where",
    "db": "company",
    "title": "Not equal: <> and NOT",
    "concept": "<> means \"not equal\" (many databases also accept !=). NOT negates any condition: NOT (a AND b), NOT IN, NOT LIKE, NOT BETWEEN… Careful: rows with NULL in that column meet neither the condition nor its opposite.",
    "example": "SELECT name FROM departments WHERE city <> 'London';",
    "steps": [
      {
        "task": "Show name and job title of the employees who are not managers.",
        "solution": "SELECT name, role FROM employees WHERE role <> 'Gerente'",
        "hints": [
          "job_title <> 'Manager'"
        ],
        "requires": [
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "date-compare",
    "module": "where",
    "db": "company",
    "title": "Comparing dates",
    "concept": "Because dates are stored as YYYY-MM-DD, they compare with > < >= <= just like numbers: '2022-01-01' is less than '2023-05-10'. Always write dates in that format, in quotes.",
    "example": "SELECT name FROM employees WHERE hire_date < '2019-01-01';",
    "steps": [
      {
        "task": "Show name and hire date of the employees hired on or after January 1, 2022.",
        "solution": "SELECT name, hire_date FROM employees WHERE hire_date >= '2022-01-01'",
        "hints": [
          "hire_date >= '2022-01-01'"
        ],
        "requires": [
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "not-like",
    "module": "where",
    "db": "store",
    "title": "Excluding a pattern: NOT LIKE",
    "concept": "NOT LIKE keeps the rows that do not follow the pattern. Careful: a comparison with NULL is neither true nor false, so rows with an empty email do not show up either. If you want them, add OR email IS NULL.",
    "example": "SELECT name FROM products WHERE name NOT LIKE 'S%';",
    "steps": [
      {
        "task": "Show the name and email of the customers whose email is not a Gmail one (it does not end in @gmail.com).",
        "solution": "SELECT name, email FROM customers WHERE email NOT LIKE '%@gmail.com'",
        "hints": [
          "WHERE email NOT LIKE '%@gmail.com'"
        ],
        "requires": [
          "NOT LIKE"
        ]
      }
    ]
  },
  {
    "id": "like-underscore",
    "module": "where",
    "db": "store",
    "title": "A single character: the _ wildcard",
    "concept": "In LIKE, % stands for any number of characters and _ for exactly one. '_a%' means: any one character, then an a, then anything. In SQLite, LIKE ignores upper and lower case.",
    "example": "SELECT name FROM customers WHERE city LIKE 'M_rida';",
    "steps": [
      {
        "task": "Show the products whose name has an a as its second letter.",
        "solution": "SELECT name FROM products WHERE name LIKE '_a%'",
        "hints": [
          "Use _ for the first letter, then the a, then %.",
          "WHERE name LIKE '_a%'"
        ],
        "requires": [
          "LIKE"
        ]
      }
    ]
  }
];
