import { ExerciseDef } from "../types/curriculum";

export const EXERCISES: ExerciseDef[] = [
  {
    "id": "select-all",
    "module": "select",
    "db": "store",
    "title": "Your first query",
    "concept": "SELECT asks for data and FROM says which table. The asterisk * means \"every column\". SQL keywords are not case sensitive: select and SELECT are the same, but uppercase is the convention. The trailing semicolon is optional here.",
    "example": "SELECT * FROM customers;",
    "steps": [
      {
        "task": "Show every column of the products table.",
        "solution": "SELECT * FROM products",
        "hints": [
          "The table is called products.",
          "SELECT * FROM and the table name."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "select-columns",
    "module": "select",
    "db": "store",
    "title": "Choosing columns",
    "concept": "Instead of *, list the columns you want, separated by commas. The result shows them in that order. Asking only for what you need makes queries clearer and faster.",
    "example": "SELECT name, city FROM customers;",
    "steps": [
      {
        "task": "Show only the name and price of each product.",
        "solution": "SELECT name, price FROM products",
        "hints": [
          "The columns are name and price, separated by a comma."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "alias",
    "module": "select",
    "db": "store",
    "title": "Calculations and AS aliases",
    "concept": "A SELECT column can be a calculation: price * 2, stock - 1… AS names the result column. Without an alias, the column is named after the expression.",
    "example": "SELECT name, stock * 2 AS doble FROM products;",
    "steps": [
      {
        "task": "Show each product’s name and its price with tax (price times 1.16). Name the second column price_with_tax.",
        "solution": "SELECT name, price * 1.16 AS price_with_tax FROM products",
        "hints": [
          "The calculation is price * 1.16.",
          "Write AS price_with_tax after the calculation."
        ],
        "requires": [
          "AS"
        ]
      }
    ]
  },
  {
    "id": "distinct",
    "module": "select",
    "db": "store",
    "title": "Unique values with DISTINCT",
    "concept": "SELECT DISTINCT removes repeated rows from the result. It is handy to see which different values a column contains.",
    "example": "SELECT DISTINCT category FROM products;",
    "steps": [
      {
        "task": "List the cities where there are customers, without repeating any.",
        "solution": "SELECT DISTINCT city FROM customers",
        "hints": [
          "Write DISTINCT right after SELECT."
        ],
        "requires": [
          "DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "select-expression",
    "module": "select",
    "db": "store",
    "title": "Columns calculated from each other",
    "concept": "A calculation can combine several columns of the same row: price * stock gives how much money each product has sitting in inventory. SQL does the math row by row.",
    "example": "SELECT name, price - 100 AS con_descuento FROM products;",
    "steps": [
      {
        "task": "Show each product’s name and the value of its inventory (price times stock). Name the column inventory_value.",
        "solution": "SELECT name, price * stock AS inventory_value FROM products",
        "hints": [
          "Multiply the two columns: price * stock AS inventory_value."
        ],
        "requires": [
          "AS"
        ]
      }
    ]
  },
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
  },
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
    "concept": "In SQLite and MySQL NULLs come first when sorting low to high; in PostgreSQL, last. To decide yourself, write NULLS FIRST or NULLS LAST after the column (or, where unsupported, sort by column IS NULL first).",
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
    "example": "SELECT name, price * 1.16 AS con_iva FROM products ORDER BY con_iva;",
    "steps": [
      {
        "task": "Show the name and inventory value (price times stock) of each product, from highest to lowest. If two tie, sort them by name.",
        "solution": "SELECT name, price * stock AS valor FROM products ORDER BY valor DESC, name",
        "hints": [
          "Name the calculation with AS and use it in ORDER BY.",
          "ORDER BY value DESC, name"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "count",
    "module": "aggregate",
    "db": "store",
    "title": "Counting rows with COUNT",
    "concept": "Aggregate functions summarize many rows into one value. COUNT(*) counts rows; COUNT(column) counts only the rows where that column is not NULL.",
    "example": "SELECT COUNT(*) FROM products;",
    "steps": [
      {
        "task": "Count how many customers there are.",
        "solution": "SELECT COUNT(*) FROM customers",
        "hints": [
          "SELECT COUNT(*) FROM and the table."
        ],
        "requires": [
          "COUNT"
        ]
      },
      {
        "task": "Now count how many customers have an email.",
        "solution": "SELECT COUNT(email) FROM customers",
        "hints": [
          "COUNT(email) skips NULLs."
        ],
        "requires": [
          "COUNT"
        ]
      }
    ]
  },
  {
    "id": "count-where",
    "module": "aggregate",
    "db": "store",
    "title": "Counting with a condition",
    "concept": "WHERE runs before aggregating: rows are filtered first, then only the remaining ones are counted or added up.",
    "example": "SELECT COUNT(*) FROM customers WHERE city = 'London';",
    "steps": [
      {
        "task": "Count how many orders have been delivered.",
        "solution": "SELECT COUNT(*) FROM orders WHERE status = 'delivered'",
        "hints": [
          "Filter with status = 'delivered' and count with COUNT(*)."
        ],
        "requires": [
          "COUNT",
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "sum",
    "module": "aggregate",
    "db": "store",
    "title": "Adding up with SUM",
    "concept": "SUM(column) adds up a column. It can also add a per-row calculation, like SUM(price * stock).",
    "example": "SELECT SUM(quantity) FROM order_items;",
    "steps": [
      {
        "task": "Calculate how many units are in inventory by adding up the stock of every product.",
        "solution": "SELECT SUM(stock) FROM products",
        "hints": [
          "SUM(stock)"
        ],
        "requires": [
          "SUM"
        ]
      },
      {
        "task": "Now calculate the inventory value: price times stock for each product, all added up.",
        "solution": "SELECT SUM(price * stock) FROM products",
        "hints": [
          "Multiply inside SUM: SUM(price * stock)."
        ],
        "requires": [
          "SUM"
        ]
      }
    ]
  },
  {
    "id": "avg-min-max",
    "module": "aggregate",
    "db": "company",
    "title": "AVG, MIN and MAX",
    "concept": "AVG gives the average, MIN the lowest value and MAX the highest. You can put several functions in one SELECT, separated by commas. ROUND(value, 2) rounds to two decimals.",
    "example": "SELECT MIN(hire_date), MAX(hire_date) FROM employees;",
    "steps": [
      {
        "task": "In one query, show the average employee salary rounded to 2 decimals, the lowest salary and the highest.",
        "solution": "SELECT ROUND(AVG(salary), 2), MIN(salary), MAX(salary) FROM employees",
        "hints": [
          "ROUND(AVG(salary), 2), MIN(salary), MAX(salary)"
        ],
        "requires": [
          "AVG",
          "MIN",
          "MAX"
        ]
      }
    ]
  },
  {
    "id": "aggregate-filter",
    "module": "aggregate",
    "db": "company",
    "title": "Several aggregates with a filter",
    "concept": "One SELECT can return several summaries of the same set of rows. WHERE decides which rows go in before counting and adding.",
    "example": "SELECT COUNT(*), MAX(salary) FROM employees WHERE department_id = 1;",
    "steps": [
      {
        "task": "In one query, show how many analysts there are and their total salary.",
        "solution": "SELECT COUNT(*), SUM(salary) FROM employees WHERE role = 'Analista'",
        "hints": [
          "SELECT COUNT(*), SUM(salary) … WHERE job_title = 'Analyst'"
        ],
        "requires": [
          "COUNT",
          "SUM"
        ]
      }
    ]
  },
  {
    "id": "min-max-dates",
    "module": "aggregate",
    "db": "store",
    "title": "MIN and MAX with dates",
    "concept": "MIN and MAX also work with text and dates. Dates stored as YYYY-MM-DD sort the same way as on the calendar, so MIN gives the oldest and MAX the newest.",
    "example": "SELECT MIN(name), MAX(name) FROM customers;",
    "steps": [
      {
        "task": "Show the date of the first order and of the last one, in a single row.",
        "solution": "SELECT MIN(order_date), MAX(order_date) FROM orders",
        "hints": [
          "SELECT MIN(order_date), MAX(order_date) FROM orders"
        ],
        "requires": [
          "MIN",
          "MAX"
        ]
      }
    ]
  },
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
    "example": "SELECT role, AVG(salary) AS promedio FROM employees GROUP BY role;",
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
        "task": "Show each category with the average price of its products rounded to 2 decimals, from most to least expensive.",
        "solution": "SELECT category, ROUND(AVG(price), 2) AS promedio FROM products GROUP BY category ORDER BY promedio DESC",
        "hints": [
          "ROUND(AVG(price), 2) AS average",
          "End with ORDER BY average DESC."
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
    "title": "Joining a group’s values: GROUP_CONCAT",
    "concept": "GROUP_CONCAT(column, ', ') joins each group's values into one text. Add ORDER BY inside the parentheses to fix the order. PostgreSQL and SQL Server call it STRING_AGG; MySQL uses GROUP_CONCAT with SEPARATOR.",
    "example": "SELECT city, GROUP_CONCAT(name, ', ') FROM customers GROUP BY city;",
    "steps": [
      {
        "task": "Show each category with the list of its products in alphabetical order, separated by comma and space (', ').",
        "solution": "SELECT category, GROUP_CONCAT(name, ', ' ORDER BY name) AS lista FROM products GROUP BY category",
        "hints": [
          "GROUP_CONCAT(name, ', ' ORDER BY name)"
        ],
        "requires": []
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
        "task": "Show the categories whose inventory is worth more than 20000 in total (sum of price times stock), with that value.",
        "solution": "SELECT category, SUM(price * stock) AS valor FROM products GROUP BY category HAVING SUM(price * stock) > 20000",
        "hints": [
          "Group by category and sum price * stock.",
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
    "id": "inner-join",
    "module": "joins",
    "db": "store",
    "title": "Joining two tables with JOIN",
    "concept": "Orders store customer_id, not the name. JOIN matches each order with its customer, with ON saying which columns line up. When both tables have a column with the same name, write table.column.",
    "example": "SELECT orders.id, customers.city FROM orders JOIN customers ON orders.customer_id = customers.id;",
    "steps": [
      {
        "task": "Show each order’s id, the name of the customer who placed it and the date.",
        "solution": "SELECT orders.id, customers.name, orders.order_date FROM orders JOIN customers ON orders.customer_id = customers.id",
        "hints": [
          "Join orders with customers ON orders.customer_id = customers.id.",
          "Both tables have an id, so write orders.id."
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "join-alias",
    "module": "joins",
    "db": "store",
    "title": "Table aliases and filters",
    "concept": "A table alias saves typing: FROM orders o JOIN customers c lets you write o.id and c.name. After the JOIN, WHERE can filter on columns from either table.",
    "example": "SELECT p.id, c.name FROM orders p JOIN customers c ON p.customer_id = c.id WHERE p.status = 'cancelled';",
    "steps": [
      {
        "task": "Show id and order_date of the orders placed by customers from Monterrey.",
        "solution": "SELECT p.id, p.order_date FROM orders p JOIN customers c ON p.customer_id = c.id WHERE c.city = 'Birmingham'",
        "hints": [
          "Join orders and customers and filter with c.city = 'Birmingham'."
        ],
        "requires": [
          "JOIN",
          "WHERE"
        ]
      }
    ]
  },
  {
    "id": "join-group",
    "module": "joins",
    "db": "store",
    "title": "JOIN with GROUP BY",
    "concept": "Tables are joined first, then the result is grouped as if it were one table. That way you can summarize one table’s data by another table’s columns.",
    "example": "SELECT c.city, COUNT(*) FROM orders p JOIN customers c ON p.customer_id = c.id GROUP BY c.city;",
    "steps": [
      {
        "task": "Show each category and the total units ordered of its products (the quantity column in order_items).",
        "solution": "SELECT pr.category, SUM(d.quantity) FROM order_items d JOIN products pr ON d.product_id = pr.id GROUP BY pr.category",
        "hints": [
          "Join order_items with products ON i.product_id = p.id.",
          "Group by category and add up quantity."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "left-join",
    "module": "joins",
    "db": "store",
    "title": "LEFT JOIN: keep every row",
    "concept": "JOIN keeps only rows with a match in both tables: a customer with no orders disappears. LEFT JOIN keeps every row of the left table and fills the other table’s columns with NULL when there is no match.",
    "example": "SELECT c.name, p.id FROM customers c LEFT JOIN orders p ON p.customer_id = c.id;",
    "steps": [
      {
        "task": "Show every customer with how many orders each has placed, including those with 0.",
        "solution": "SELECT c.name, COUNT(p.id) FROM customers c LEFT JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name",
        "hints": [
          "With a plain JOIN, customers without orders would not appear.",
          "COUNT(o.id) gives 0 when there is no order; COUNT(*) would give 1."
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "left-join-null",
    "module": "joins",
    "db": "store",
    "title": "Finding what is missing",
    "concept": "A LEFT JOIN followed by WHERE right_table_column IS NULL keeps only the unmatched rows: customers with no orders, products never sold…",
    "example": "SELECT pr.name FROM products pr LEFT JOIN order_items d ON d.product_id = pr.id WHERE d.order_id IS NULL;",
    "steps": [
      {
        "task": "Show the names of the customers who have never placed an order.",
        "solution": "SELECT c.name FROM customers c LEFT JOIN orders p ON p.customer_id = c.id WHERE p.id IS NULL",
        "hints": [
          "LEFT JOIN customers to orders and WHERE o.id IS NULL."
        ],
        "requires": [
          "LEFT JOIN",
          "IS NULL"
        ]
      }
    ]
  },
  {
    "id": "self-join",
    "module": "joins",
    "db": "company",
    "title": "Joining a table to itself",
    "concept": "manager_id points to another employee in the same table. To see the manager’s name, join employees to employees with two different aliases: one for the employee and one for the manager.",
    "example": "SELECT e.name, j.role FROM employees e JOIN employees j ON e.manager_id = j.id;",
    "steps": [
      {
        "task": "Show the name of each employee who has a manager next to the manager’s name.",
        "solution": "SELECT e.name, j.name AS jefe FROM employees e JOIN employees j ON e.manager_id = j.id",
        "hints": [
          "FROM employees e JOIN employees m",
          "The condition is e.manager_id = m.id."
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "multi-join",
    "module": "joins",
    "db": "store",
    "title": "Three or more tables",
    "concept": "You can chain several JOINs: each one adds a table to the result. Working out what each customer spent takes four: customers, orders, order_items (quantities) and products (prices).",
    "example": "SELECT p.id, pr.name, d.quantity FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id;",
    "steps": [
      {
        "task": "Show each customer with the total they have spent (quantity times price), not counting cancelled orders, from highest to lowest.",
        "solution": "SELECT c.name, SUM(d.quantity * pr.price) AS total FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY c.id, c.name ORDER BY total DESC",
        "hints": [
          "Join customers → orders → order_items → products.",
          "Filter with o.status <> 'cancelled', group by customer and add up i.quantity * p.price."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "join-detail",
    "module": "joins",
    "db": "store",
    "title": "Order details across tables",
    "concept": "Many real questions chain tables without grouping: each JOIN adds columns and WHERE picks the rows. Think of the path: customer → order → item → product.",
    "example": "SELECT p.id, pr.name FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id;",
    "steps": [
      {
        "task": "Show everything Ana López has ordered: order date, product name and quantity.",
        "solution": "SELECT p.order_date, pr.name, d.quantity FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE c.name = 'Ana López'",
        "hints": [
          "Join customers, orders, order_items and products, and filter with c.name = 'Ana López'."
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "full-join",
    "module": "joins",
    "db": "company",
    "title": "RIGHT JOIN and FULL OUTER JOIN",
    "concept": "RIGHT JOIN is a LEFT JOIN reversed: it keeps every row of the right table. FULL OUTER JOIN keeps both sides and fills unmatched columns with NULL. MySQL has no FULL JOIN; it is simulated there with a UNION of two LEFT JOINs.",
    "example": "SELECT e.name, d.name FROM employees e RIGHT JOIN departments d ON e.department_id = d.id;",
    "steps": [
      {
        "task": "Show each employee’s name next to their department name, including the employee with no department and the department with no employees.",
        "solution": "SELECT e.name, d.name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.id",
        "hints": [
          "FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.id"
        ],
        "requires": [
          "FULL"
        ]
      }
    ]
  },
  {
    "id": "cross-join",
    "module": "joins",
    "db": "company",
    "title": "Every combination: CROSS JOIN",
    "concept": "CROSS JOIN pairs every row of one table with every row of the other, with no condition: 5 rows by 4 rows give 20. It builds templates, like every department and job title combination. A subquery in FROM works like another table.",
    "example": "SELECT d.name, c.city FROM departments d CROSS JOIN (SELECT DISTINCT city FROM departments) c;",
    "steps": [
      {
        "task": "Show every possible combination of department name and job title (each distinct job title once).",
        "solution": "SELECT d.name, p.role FROM departments d CROSS JOIN (SELECT DISTINCT role FROM employees) p",
        "hints": [
          "The distinct titles come from (SELECT DISTINCT job_title FROM employees).",
          "FROM departments d CROSS JOIN (…) t"
        ],
        "requires": [
          "CROSS JOIN"
        ]
      }
    ]
  },
  {
    "id": "join-distinct",
    "module": "joins",
    "db": "store",
    "title": "A four-table JOIN without repeats",
    "concept": "When joining several tables, the same row can show up several times (a product bought in two orders). DISTINCT keeps each value once.",
    "steps": [
      {
        "task": "List, without repeats, the products ordered by customers from CDMX.",
        "solution": "SELECT DISTINCT pr.name FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE c.city = 'London'",
        "hints": [
          "Path: customers → orders → order_items → products.",
          "SELECT DISTINCT pr.name … WHERE c.city = 'London'"
        ],
        "requires": [
          "JOIN",
          "DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "left-join-coalesce",
    "module": "joins",
    "db": "store",
    "title": "LEFT JOIN with zeros instead of NULL",
    "concept": "With LEFT JOIN, a sum over a group with no rows gives NULL. COALESCE(SUM(...), 0) turns it into 0, which is usually what a report needs.",
    "steps": [
      {
        "task": "Show every product with the units sold of each. Those never sold must show 0.",
        "solution": "SELECT pr.name, COALESCE(SUM(d.quantity), 0) AS unidades FROM products pr LEFT JOIN order_items d ON d.product_id = pr.id GROUP BY pr.id, pr.name",
        "hints": [
          "products LEFT JOIN order_items, grouping by product.",
          "COALESCE(SUM(oi.quantity), 0)"
        ],
        "requires": [
          "LEFT JOIN",
          "COALESCE"
        ]
      }
    ]
  },
  {
    "id": "anti-join",
    "module": "joins",
    "db": "company",
    "title": "Empty departments with LEFT JOIN",
    "concept": "The LEFT JOIN … WHERE right.id IS NULL pattern finds the left rows without a match. It is called an anti-join and works just like NOT EXISTS.",
    "steps": [
      {
        "task": "Show the departments that have no employees. Use LEFT JOIN.",
        "solution": "SELECT d.name FROM departments d LEFT JOIN employees e ON e.department_id = d.id WHERE e.id IS NULL",
        "hints": [
          "Join departments to employees and keep the rows where e.id IS NULL."
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "subquery-scalar",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery that returns a value",
    "concept": "A subquery is a SELECT in parentheses inside another query. If it returns a single value, you can use it like a number: price > (SELECT AVG(price) FROM products).",
    "example": "SELECT name FROM products WHERE price = (SELECT MAX(price) FROM products);",
    "steps": [
      {
        "task": "Show name and price of the products that cost more than the average price. Work out the average with a subquery.",
        "solution": "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)",
        "hints": [
          "WHERE price > (SELECT AVG(price) FROM products)"
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "subquery-in",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery with IN",
    "concept": "If the subquery returns a list, use it with IN: WHERE id IN (SELECT …). It is another way to relate tables without a JOIN.",
    "example": "SELECT name FROM products WHERE id IN (SELECT product_id FROM order_items WHERE quantity >= 3);",
    "steps": [
      {
        "task": "Show the names of the customers with at least one order in shipped status. Use IN with a subquery.",
        "solution": "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'shipped')",
        "hints": [
          "The subquery is SELECT customer_id FROM orders WHERE status = 'shipped'."
        ],
        "requires": [
          "IN",
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "not-exists",
    "module": "subqueries",
    "db": "store",
    "title": "NOT IN and unsold products",
    "concept": "NOT IN keeps the rows whose value is not in the subquery’s list. Careful: if that list contains a NULL, NOT IN returns nothing; use NOT EXISTS or a LEFT JOIN then.",
    "example": "SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);",
    "steps": [
      {
        "task": "Show the names of the products that have never been ordered.",
        "solution": "SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM order_items)",
        "hints": [
          "id NOT IN (SELECT product_id FROM order_items)"
        ],
        "requires": [
          "NOT IN",
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "cte",
    "module": "subqueries",
    "db": "store",
    "title": "Step-by-step queries with WITH",
    "concept": "WITH name AS (SELECT …) creates a temporary table (a CTE) the next query can use as if it existed. It splits a hard query into steps you read top to bottom.",
    "example": "WITH caros AS (SELECT * FROM products WHERE price > 1000) SELECT category, COUNT(*) FROM caros GROUP BY category;",
    "steps": [
      {
        "task": "With WITH, first work out the units ordered per product, then show the name and total of the products with 4 units or more.",
        "solution": "WITH unidades AS (SELECT product_id, SUM(quantity) AS total FROM order_items GROUP BY product_id) SELECT pr.name, u.total FROM unidades u JOIN products pr ON pr.id = u.product_id WHERE u.total >= 4",
        "hints": [
          "WITH units AS (SELECT product_id, SUM(quantity) AS total FROM order_items GROUP BY product_id)",
          "Then join units with products and filter total >= 4."
        ],
        "requires": [
          "WITH"
        ]
      }
    ]
  },
  {
    "id": "derived-table",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery in FROM",
    "concept": "A subquery in FROM is used as if it were a table (some databases require an alias). It lets you aggregate twice: count per customer first, then average those counts.",
    "example": "SELECT MAX(total) FROM (SELECT city, COUNT(*) AS total FROM customers GROUP BY city);",
    "steps": [
      {
        "task": "Work out the average number of orders per customer who has bought, rounded to 2 decimals. Count per customer in a subquery first.",
        "solution": "SELECT ROUND(AVG(total), 2) FROM (SELECT customer_id, COUNT(*) AS total FROM orders GROUP BY customer_id)",
        "hints": [
          "SELECT ROUND(AVG(total), 2) FROM (SELECT customer_id, COUNT(*) AS total FROM orders GROUP BY customer_id)"
        ],
        "requires": [
          "FROM (SELECT"
        ]
      }
    ]
  },
  {
    "id": "scalar-select",
    "module": "subqueries",
    "db": "store",
    "title": "Subquery in SELECT",
    "concept": "A subquery returning one value can be a SELECT column. If correlated, it runs for each row. When it finds nothing it gives NULL, which COALESCE can turn into 0.",
    "example": "SELECT name, (SELECT COUNT(*) FROM orders WHERE customer_id = customers.id) FROM customers;",
    "steps": [
      {
        "task": "Show each product’s name and how many units of it have been ordered (0 if never), using a subquery in the SELECT.",
        "solution": "SELECT name, (SELECT COALESCE(SUM(quantity), 0) FROM order_items d WHERE d.product_id = products.id) AS unidades FROM products",
        "hints": [
          "(SELECT SUM(quantity) FROM order_items i WHERE i.product_id = products.id)",
          "Wrap the sum in COALESCE(…, 0)."
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "cte-chain",
    "module": "subqueries",
    "db": "store",
    "title": "Chaining several WITHs",
    "concept": "One WITH can define several temporary tables separated by commas, and each can use the earlier ones. A hard question becomes named steps.",
    "example": "WITH a AS (SELECT * FROM products WHERE stock > 0), b AS (SELECT category, COUNT(*) AS total FROM a GROUP BY category) SELECT * FROM b;",
    "steps": [
      {
        "task": "Show the name and total spending of the customers who spent more than average (quantity times price, no cancelled orders). Use two WITH steps: spending per customer, then its average.",
        "solution": "WITH gasto AS (SELECT p.customer_id, SUM(d.quantity * pr.price) AS total FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY p.customer_id), promedio AS (SELECT AVG(total) AS valor FROM gasto) SELECT c.name, g.total FROM gasto g JOIN customers c ON c.id = g.customer_id JOIN promedio ON g.total > promedio.valor",
        "hints": [
          "WITH spending AS (…per customer…), average AS (SELECT AVG(total) AS value FROM spending)",
          "Join spending with customers and keep total > average.value."
        ],
        "requires": [
          "WITH"
        ]
      }
    ]
  },
  {
    "id": "subquery-max",
    "module": "subqueries",
    "db": "company",
    "title": "Who has the maximum",
    "concept": "MAX(salary) tells you the highest salary, but not whose it is. To see the whole row, compare against a subquery: WHERE salary = (SELECT MAX(salary) FROM employees). If there is a tie, all of them show up.",
    "steps": [
      {
        "task": "Show the name, job title and salary of whoever earns the most in the company.",
        "solution": "SELECT name, role, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees)",
        "hints": [
          "WHERE salary = (SELECT MAX(salary) FROM employees)"
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "correlated-latest",
    "module": "subqueries",
    "db": "store",
    "title": "Correlated subquery: the latest of each",
    "concept": "A correlated subquery uses a column from the outer query, so it is computed again for each row. It lets you compare each row with its own group, like each customer’s latest order.",
    "steps": [
      {
        "task": "For each customer with orders, show their customer_id and the id and date of their most recent order.",
        "solution": "SELECT p.customer_id, p.id, p.order_date FROM orders p WHERE p.order_date = (SELECT MAX(p2.order_date) FROM orders p2 WHERE p2.customer_id = p.customer_id)",
        "hints": [
          "Use two aliases of orders: o outside and o2 inside.",
          "WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id)"
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "cte-filter",
    "module": "subqueries",
    "db": "company",
    "title": "Filtering the result of a WITH",
    "concept": "A WITH can compute totals and the main query can filter them with a plain WHERE, no HAVING needed. It often reads more easily than one long query.",
    "steps": [
      {
        "task": "With a WITH named payroll, compute the total salary of each department. Then show the names of the departments whose payroll is over 100000, with that total.",
        "solution": "WITH nomina AS (SELECT department_id, SUM(salary) AS total FROM employees GROUP BY department_id) SELECT d.name, n.total FROM nomina n JOIN departments d ON d.id = n.department_id WHERE n.total > 100000",
        "hints": [
          "WITH payroll AS (SELECT department_id, SUM(salary) AS total FROM employees GROUP BY department_id)",
          "Join payroll to departments and filter WHERE p.total > 100000."
        ],
        "requires": [
          "WITH"
        ]
      }
    ]
  },
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
  },
  {
    "id": "insert",
    "module": "modify",
    "db": "store",
    "title": "Adding rows with INSERT",
    "concept": "INSERT INTO table (columns) VALUES (values) adds a row. Columns you leave out are NULL, except id: as an INTEGER PRIMARY KEY, the database assigns the next number.",
    "example": "INSERT INTO customers (name, city) VALUES ('Karla Ríos', 'León');",
    "steps": [
      {
        "task": "Add the product Speaker, in the Electronics category, with price 1199 and stock 12.",
        "solution": "INSERT INTO products (name, category, price, stock) VALUES ('Bocina', 'Electronics', 1199, 12)",
        "hints": [
          "INSERT INTO products (name, category, price, stock) VALUES (…)"
        ],
        "requires": [
          "INSERT"
        ],
        "check": "SELECT name, category, price, stock FROM products"
      }
    ]
  },
  {
    "id": "update",
    "module": "modify",
    "db": "store",
    "title": "Changing data with UPDATE",
    "concept": "UPDATE table SET column = value WHERE condition changes the rows that meet the condition. Without WHERE it changes every row in the table, so always check the condition first.",
    "example": "UPDATE products SET stock = stock + 10 WHERE name = 'Cafetera';",
    "steps": [
      {
        "task": "Raise the price of every Stationery product by 10%.",
        "solution": "UPDATE products SET price = price * 1.1 WHERE category = 'Stationery'",
        "hints": [
          "Raising by 10% means multiplying by 1.1: SET price = price * 1.1.",
          "Do not forget WHERE category = 'Stationery'."
        ],
        "requires": [
          "UPDATE",
          "WHERE"
        ],
        "check": "SELECT name, price FROM products"
      }
    ]
  },
  {
    "id": "delete",
    "module": "modify",
    "db": "store",
    "title": "Removing rows with DELETE",
    "concept": "DELETE FROM table WHERE condition removes the rows that meet the condition. Like UPDATE, without WHERE it empties the whole table. A good habit: run a SELECT with the same WHERE first to see what will go.",
    "example": "DELETE FROM orders WHERE status = 'cancelled';",
    "steps": [
      {
        "task": "Delete the products that are out of stock (stock equal to 0).",
        "solution": "DELETE FROM products WHERE stock = 0",
        "hints": [
          "DELETE FROM products WHERE stock = 0"
        ],
        "requires": [
          "DELETE",
          "WHERE"
        ],
        "check": "SELECT name FROM products"
      }
    ]
  },
  {
    "id": "create-table",
    "module": "modify",
    "db": "store",
    "title": "Creating a table",
    "concept": "CREATE TABLE name (column TYPE, …) creates an empty table. Common types: INTEGER, REAL (decimals) and TEXT. PRIMARY KEY marks the column that identifies each row and NOT NULL forbids leaving it empty.",
    "example": "CREATE TABLE categorias (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
    "steps": [
      {
        "task": "Create the suppliers table with three columns: id (integer, primary key), name (text, required) and phone (text).",
        "solution": "CREATE TABLE suppliers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT)",
        "hints": [
          "id INTEGER PRIMARY KEY",
          "name TEXT NOT NULL, phone TEXT"
        ],
        "requires": [
          "CREATE TABLE"
        ],
        "check": "SELECT name, pk, \"notnull\" FROM pragma_table_info('suppliers') ORDER BY cid"
      }
    ]
  },
  {
    "id": "insert-many",
    "module": "modify",
    "db": "store",
    "title": "Several rows in one INSERT",
    "concept": "One INSERT can add several rows at once: separate each group of values with a comma. It is faster and shorter than one INSERT per row.",
    "example": "INSERT INTO products (name, price) VALUES ('Lápiz', 10), ('Goma', 8);",
    "steps": [
      {
        "task": "In a single INSERT, add two customers: Karla Rey, from Puebla, and Luis Mora, from CDMX (just name and city).",
        "solution": "INSERT INTO customers (name, city) VALUES ('Karla Rey', 'Leeds'), ('Luis Mora', 'London')",
        "hints": [
          "INSERT INTO customers (name, city) VALUES ('Karla Rey', 'Leeds'), (…)"
        ],
        "requires": [
          "INSERT"
        ],
        "check": "SELECT name, city FROM customers"
      }
    ]
  },
  {
    "id": "update-status",
    "module": "modify",
    "db": "store",
    "title": "UPDATE with two conditions",
    "concept": "An UPDATE’s WHERE works just like a SELECT’s. A good habit: before changing anything, run a SELECT with the same WHERE to see which rows you will touch.",
    "steps": [
      {
        "task": "The orders shipped before October 1, 2025 have arrived: change their status to delivered.",
        "solution": "UPDATE orders SET status = 'delivered' WHERE status = 'shipped' AND order_date < '2025-10-01'",
        "hints": [
          "SET status = 'delivered' WHERE status = 'shipped' AND order_date < '2025-10-01'"
        ],
        "requires": [
          "UPDATE",
          "WHERE"
        ],
        "check": "SELECT id, status FROM orders"
      }
    ]
  },
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
    "example": "SELECT role, strftime('%Y', hire_date) AS anio, COUNT(*) FROM employees GROUP BY role, anio;",
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
        "task": "For each customer_id, show in two columns how many orders were delivered and how many were cancelled.",
        "solution": "SELECT customer_id, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS entregados, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelados FROM orders GROUP BY customer_id",
        "hints": [
          "SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)",
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
    "title": "Percentages and integer division",
    "concept": "Dividing two integers in SQLite (and SQL Server and PostgreSQL) drops the decimals: 8 / 14 gives 0. Multiply by 100.0 first, or use CAST(x AS REAL), to get a decimal result.",
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
  },
  {
    "id": "left-join-on",
    "module": "sets",
    "db": "store",
    "title": "LEFT JOIN: condition in ON or WHERE?",
    "concept": "In a LEFT JOIN, a WHERE condition on the right table removes the unmatched rows (their columns are NULL and fail it), turning it into a plain JOIN. To keep every row on the left, put that condition in the ON.",
    "example": "SELECT c.name, p.id FROM customers c LEFT JOIN orders p ON p.customer_id = c.id AND p.order_date >= '2025-09-01';",
    "steps": [
      {
        "task": "Show every customer with the id of their shipped orders. Customers with no shipped orders must still appear, with NULL.",
        "solution": "SELECT c.name, p.id FROM customers c LEFT JOIN orders p ON p.customer_id = c.id AND p.status = 'shipped'",
        "hints": [
          "If you write WHERE o.status = 'shipped', customers without shipped orders disappear.",
          "ON o.customer_id = c.id AND o.status = 'shipped'"
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "exists",
    "module": "sets",
    "db": "store",
    "title": "Checking existence: EXISTS",
    "concept": "EXISTS (subquery) is true if the subquery returns at least one row. What it returns does not matter, which is why SELECT 1 is common. It is usually correlated with the outer query.",
    "example": "SELECT name FROM products pr WHERE EXISTS (SELECT 1 FROM order_items d WHERE d.product_id = pr.id AND d.quantity >= 3);",
    "steps": [
      {
        "task": "Show the names of the customers with at least one cancelled order. Use EXISTS.",
        "solution": "SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders p WHERE p.customer_id = c.id AND p.status = 'cancelled')",
        "hints": [
          "WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND …)"
        ],
        "requires": [
          "EXISTS"
        ]
      }
    ]
  },
  {
    "id": "not-in-null",
    "module": "sets",
    "db": "company",
    "title": "The NOT IN and NULL trap",
    "concept": "x NOT IN (1, 2, NULL) is never true: comparing with NULL gives \"unknown\". If the subquery can return NULL, NOT IN silently returns zero rows. NOT EXISTS does not have that problem.",
    "example": "SELECT 3 NOT IN (1, 2), 3 NOT IN (1, 2, NULL);",
    "steps": [
      {
        "task": "Show the names of the departments with no employees. Careful: one employee has no department (NULL).",
        "solution": "SELECT name FROM departments d WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id)",
        "hints": [
          "With NOT IN (SELECT department_id FROM employees) nothing comes back because of that NULL.",
          "WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id)"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "union",
    "module": "sets",
    "db": "store",
    "title": "Combining results: UNION, INTERSECT and EXCEPT",
    "concept": "UNION stacks the results of two SELECTs and removes duplicates; UNION ALL keeps them. INTERSECT returns what is in both and EXCEPT what is in the first but not the second. Both SELECTs need the same number of columns.",
    "example": "SELECT name FROM products WHERE stock = 0 UNION SELECT name FROM products WHERE price > 10000;",
    "steps": [
      {
        "task": "Make one list of emails from customers and subscribers, without duplicates or empty values.",
        "solution": "SELECT email FROM customers WHERE email IS NOT NULL UNION SELECT email FROM subscribers",
        "hints": [
          "Drop the NULLs from customers with WHERE email IS NOT NULL before the UNION."
        ],
        "requires": [
          "UNION"
        ]
      },
      {
        "task": "Now show only the emails that appear in both tables.",
        "solution": "SELECT email FROM customers INTERSECT SELECT email FROM subscribers",
        "hints": [
          "Swap UNION for INTERSECT."
        ],
        "requires": [
          "INTERSECT"
        ]
      },
      {
        "task": "Finally, show the subscriber emails that are not customers yet.",
        "solution": "SELECT email FROM subscribers EXCEPT SELECT email FROM customers",
        "hints": [
          "Subscribers first, then EXCEPT and customers."
        ],
        "requires": [
          "EXCEPT"
        ]
      }
    ]
  },
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
  },
  {
    "id": "row-number",
    "module": "window",
    "db": "store",
    "title": "Numbering rows: ROW_NUMBER",
    "concept": "A window function computes something by looking at other rows, but without collapsing them like GROUP BY: every row stays in the result. ROW_NUMBER() OVER (ORDER BY …) numbers rows 1, 2, 3… in that order.",
    "example": "SELECT name, ROW_NUMBER() OVER (ORDER BY signup_date) FROM customers;",
    "steps": [
      {
        "task": "Show name, price and each product’s position from most expensive (1) to cheapest.",
        "solution": "SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS posicion FROM products",
        "hints": [
          "ROW_NUMBER() OVER (ORDER BY price DESC)"
        ],
        "requires": [
          "ROW_NUMBER",
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "rank",
    "module": "window",
    "db": "store",
    "title": "Ties: RANK and DENSE_RANK",
    "concept": "With ties, RANK gives tied rows the same place and skips the next ones (1, 2, 2, 4); DENSE_RANK skips none (1, 2, 2, 3). A window function can order by an aggregate, like COUNT(*), when there is a GROUP BY.",
    "example": "SELECT city, COUNT(*), RANK() OVER (ORDER BY COUNT(*) DESC) FROM customers GROUP BY city;",
    "steps": [
      {
        "task": "For each customer_id show how many orders they have and their place in a ranking by order count (most orders = place 1), using RANK.",
        "solution": "SELECT customer_id, COUNT(*) AS total_pedidos, RANK() OVER (ORDER BY COUNT(*) DESC) AS lugar FROM orders GROUP BY customer_id",
        "hints": [
          "Group by customer_id and add RANK() OVER (ORDER BY COUNT(*) DESC)."
        ],
        "requires": [
          "RANK",
          "OVER"
        ]
      },
      {
        "task": "Make the same ranking with DENSE_RANK and compare: what place do customers with 1 order get now?",
        "solution": "SELECT customer_id, COUNT(*) AS total_pedidos, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS lugar FROM orders GROUP BY customer_id",
        "hints": [
          "Swap RANK for DENSE_RANK."
        ],
        "requires": [
          "DENSE_RANK"
        ]
      }
    ]
  },
  {
    "id": "partition-by",
    "module": "window",
    "db": "company",
    "title": "Per group: PARTITION BY",
    "concept": "PARTITION BY inside OVER restarts the calculation for each group, without collapsing rows. RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) makes a separate ranking in each department.",
    "example": "SELECT name, role, AVG(salary) OVER (PARTITION BY role) FROM employees;",
    "steps": [
      {
        "task": "Show name, department_id, salary and each employee’s place in a salary ranking within their department (highest paid = 1).",
        "solution": "SELECT name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS lugar FROM employees",
        "hints": [
          "RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)"
        ],
        "requires": [
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "running-total",
    "module": "window",
    "db": "company",
    "title": "Running totals",
    "concept": "SUM(x) OVER (ORDER BY date) adds the current row and every earlier one in that order: a running total. With PARTITION BY it accumulates separately per group.",
    "example": "SELECT name, hire_date, COUNT(*) OVER (ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show name, hire date, salary and the running payroll: the total salary of everyone hired up to that date.",
        "solution": "SELECT name, hire_date, salary, SUM(salary) OVER (ORDER BY hire_date) AS nomina_acumulada FROM employees",
        "hints": [
          "SUM(salary) OVER (ORDER BY hire_date)"
        ],
        "requires": [
          "SUM",
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "lag",
    "module": "window",
    "db": "store",
    "title": "Comparing with the previous row: LAG",
    "concept": "LAG(x) OVER (ORDER BY …) brings x from the previous row; LEAD from the next one. They are how you compute month-to-month changes. On the first row LAG gives NULL because there is no previous one.",
    "example": "SELECT order_date, LAG(order_date) OVER (ORDER BY order_date) FROM orders;",
    "steps": [
      {
        "task": "Show each month (2025-03), how many orders it had and the difference from the previous month.",
        "solution": "WITH m AS (SELECT strftime('%Y-%m', order_date) AS mes, COUNT(*) AS total FROM orders GROUP BY mes) SELECT mes, total, total - LAG(total) OVER (ORDER BY mes) AS cambio FROM m",
        "hints": [
          "First count orders per month in a WITH.",
          "total - LAG(total) OVER (ORDER BY month)"
        ],
        "requires": [
          "LAG"
        ]
      }
    ]
  },
  {
    "id": "percent-total",
    "module": "window",
    "db": "store",
    "title": "Percent of total",
    "concept": "OVER () with empty parentheses makes the window the whole table: SUM(stock) OVER () is the total on every row. That lets you divide each value by the total without a subquery.",
    "example": "SELECT name, stock, SUM(stock) OVER () FROM products;",
    "steps": [
      {
        "task": "Show each product name and what percentage of total inventory its stock is, rounded to 2 decimals.",
        "solution": "SELECT name, ROUND(100.0 * stock / SUM(stock) OVER (), 2) AS porcentaje FROM products",
        "hints": [
          "ROUND(100.0 * stock / SUM(stock) OVER (), 2)"
        ],
        "requires": [
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "top-n-group",
    "module": "window",
    "db": "store",
    "title": "Top N per group",
    "concept": "A window function cannot go in WHERE, because it is computed afterwards. Number the rows in a WITH and filter in the outer query: the standard way to get \"the top 2 of each group\".",
    "example": "WITH r AS (SELECT name, ROW_NUMBER() OVER (ORDER BY price) AS n FROM products) SELECT name FROM r WHERE n <= 3;",
    "steps": [
      {
        "task": "Show the 2 most expensive products in each category: category, name and price.",
        "solution": "WITH r AS (SELECT category, name, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS n FROM products) SELECT category, name, price FROM r WHERE n <= 2",
        "hints": [
          "ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS n inside a WITH.",
          "Outside: WHERE n <= 2."
        ],
        "requires": [
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "lead",
    "module": "window",
    "db": "store",
    "title": "The next row: LEAD",
    "concept": "LEAD(x) OVER (PARTITION BY … ORDER BY …) brings the next row’s value within the same group. On the last row of each group it gives NULL.",
    "example": "SELECT name, LEAD(name) OVER (ORDER BY signup_date) FROM customers;",
    "steps": [
      {
        "task": "For each order show customer_id, order_date and the date of that customer’s next order.",
        "solution": "SELECT customer_id, order_date, LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS siguiente FROM orders",
        "hints": [
          "LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)"
        ],
        "requires": [
          "LEAD"
        ]
      }
    ]
  },
  {
    "id": "running-partition",
    "module": "window",
    "db": "company",
    "title": "Running total per group",
    "concept": "PARTITION BY and ORDER BY combine in one OVER: the total accumulates in order and restarts for each group.",
    "example": "SELECT name, role, COUNT(*) OVER (PARTITION BY role ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show name, department_id, hire date and their department’s running payroll up to their hire.",
        "solution": "SELECT name, department_id, hire_date, SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date) AS nomina_depto FROM employees",
        "hints": [
          "SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date)"
        ],
        "requires": [
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "moving-average",
    "module": "window",
    "db": "store",
    "title": "Moving average with ROWS",
    "concept": "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW limits the window to the current row and the 2 before it. With AVG it gives a 3-period moving average that smooths ups and downs.",
    "example": "SELECT order_date, COUNT(*) OVER (ORDER BY order_date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) FROM orders;",
    "steps": [
      {
        "task": "Show each month, its orders and the 3-month moving average (that month and the 2 before), rounded to 2 decimals.",
        "solution": "WITH m AS (SELECT strftime('%Y-%m', order_date) AS mes, COUNT(*) AS total FROM orders GROUP BY mes) SELECT mes, total, ROUND(AVG(total) OVER (ORDER BY mes ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS promedio_movil FROM m",
        "hints": [
          "Count orders per month in a WITH.",
          "AVG(total) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)"
        ],
        "requires": [
          "ROWS"
        ]
      }
    ]
  },
  {
    "id": "ntile",
    "module": "window",
    "db": "company",
    "title": "Splitting into buckets: NTILE",
    "concept": "NTILE(4) OVER (ORDER BY …) splits the rows into 4 groups as even as possible and says which one each row is in: quartiles. If they cannot be equal, the first groups get one extra row.",
    "example": "SELECT name, NTILE(2) OVER (ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show name, salary and each employee’s salary quartile (1 = the top-paid 25%).",
        "solution": "SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) AS cuartil FROM employees",
        "hints": [
          "NTILE(4) OVER (ORDER BY salary DESC)"
        ],
        "requires": [
          "NTILE"
        ]
      }
    ]
  },
  {
    "id": "first-value",
    "module": "window",
    "db": "company",
    "title": "The first in the group: FIRST_VALUE",
    "concept": "FIRST_VALUE(x) OVER (PARTITION BY … ORDER BY …) returns the first row’s value in each group by that order, repeated on every row of the group.",
    "example": "SELECT name, FIRST_VALUE(name) OVER (ORDER BY hire_date) FROM employees;",
    "steps": [
      {
        "task": "Show each employee’s name and department_id next to the name of the top earner in their department.",
        "solution": "SELECT name, department_id, FIRST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary DESC) AS mejor_pagado FROM employees",
        "hints": [
          "FIRST_VALUE(name) OVER (PARTITION BY department_id ORDER BY salary DESC)"
        ],
        "requires": [
          "FIRST_VALUE"
        ]
      }
    ]
  },
  {
    "id": "window-avg",
    "module": "window",
    "db": "company",
    "title": "Comparing with the group average",
    "concept": "AVG(...) OVER (PARTITION BY ...) puts each row’s group average on that row without collapsing the rows, unlike GROUP BY. You see each person next to their area’s average.",
    "steps": [
      {
        "task": "Show each employee’s name, department_id and salary, along with their department’s average salary rounded to 2 decimals.",
        "solution": "SELECT name, department_id, salary, ROUND(AVG(salary) OVER (PARTITION BY department_id), 2) AS promedio_depto FROM employees",
        "hints": [
          "ROUND(AVG(salary) OVER (PARTITION BY department_id), 2)"
        ],
        "requires": [
          "OVER",
          "PARTITION BY"
        ]
      }
    ]
  },
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
  },
  {
    "id": "insert-select",
    "module": "modify2",
    "db": "store",
    "title": "Inserting from a query",
    "concept": "INSERT INTO table (columns) SELECT … inserts every row the query returns, instead of one typed row. The SELECT columns must be in the same order as the list.",
    "example": "INSERT INTO subscribers (email, subscribed_at) SELECT email, date('now') FROM customers WHERE city = 'Leeds';",
    "steps": [
      {
        "task": "Add to subscribers the customers with an email who are not subscribed yet, using their signup date as subscribed_on.",
        "solution": "INSERT INTO subscribers (email, subscribed_at) SELECT email, signup_date FROM customers WHERE email IS NOT NULL AND email NOT IN (SELECT email FROM subscribers)",
        "hints": [
          "INSERT INTO subscribers (email, subscribed_on) SELECT email, signup_date FROM customers …",
          "Filter with email IS NOT NULL AND email NOT IN (SELECT email FROM subscribers)."
        ],
        "requires": [
          "INSERT",
          "SELECT"
        ],
        "check": "SELECT email, subscribed_at FROM subscribers"
      }
    ]
  },
  {
    "id": "update-subquery",
    "module": "modify2",
    "db": "company",
    "title": "UPDATE with a subquery",
    "concept": "An UPDATE’s WHERE can use a subquery, even one correlated with the row being changed. Inside it, refer to the outer table by its full name: employees.department_id.",
    "example": "UPDATE employees SET salary = salary + 1000 WHERE salary < (SELECT AVG(salary) FROM employees);",
    "steps": [
      {
        "task": "Raise by 5% the salary of the employees who earn less than their department’s average.",
        "solution": "UPDATE employees SET salary = salary * 1.05 WHERE salary < (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = employees.department_id)",
        "hints": [
          "SET salary = salary * 1.05",
          "WHERE salary < (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = employees.department_id)"
        ],
        "requires": [
          "UPDATE",
          "(SELECT"
        ],
        "check": "SELECT name, salary FROM employees"
      }
    ]
  },
  {
    "id": "alter-table",
    "module": "modify2",
    "db": "store",
    "title": "Adding columns: ALTER TABLE",
    "concept": "ALTER TABLE table ADD COLUMN column TYPE adds a column to a table that already has data; existing rows get NULL. ALTER TABLE also renames tables and columns.",
    "example": "ALTER TABLE products ADD COLUMN descuento REAL;",
    "steps": [
      {
        "task": "Add a text column called phone to the customers table.",
        "solution": "ALTER TABLE customers ADD COLUMN phone TEXT",
        "hints": [
          "ALTER TABLE customers ADD COLUMN phone TEXT"
        ],
        "requires": [
          "ALTER TABLE"
        ],
        "check": "SELECT name FROM pragma_table_info('customers') ORDER BY cid"
      }
    ]
  },
  {
    "id": "constraints",
    "module": "modify2",
    "db": "store",
    "title": "Table rules: FOREIGN KEY and UNIQUE",
    "concept": "REFERENCES table(id) declares a foreign key: the column must point to an existing row (SQLite enforces it after PRAGMA foreign_keys = ON). UNIQUE (a, b) forbids repeating the same combination and CHECK (condition) rejects values that fail it.",
    "example": "CREATE TABLE favorites (customer_id INTEGER REFERENCES customers(id), product_id INTEGER REFERENCES products(id));",
    "steps": [
      {
        "task": "Create the reviews table with: id (primary key), product_id pointing to products, customer_id pointing to customers, stars (an integer from 1 to 5) and a rule so a customer cannot review the same product twice.",
        "solution": "CREATE TABLE reviews (id INTEGER PRIMARY KEY, product_id INTEGER REFERENCES products(id), customer_id INTEGER REFERENCES customers(id), stars INTEGER CHECK (stars BETWEEN 1 AND 5), UNIQUE (product_id, customer_id))",
        "hints": [
          "product_id INTEGER REFERENCES products(id)",
          "stars INTEGER CHECK (stars BETWEEN 1 AND 5), UNIQUE (product_id, customer_id)"
        ],
        "requires": [
          "REFERENCES",
          "UNIQUE"
        ],
        "check": "SELECT name, NULL FROM pragma_table_info('reviews') UNION ALL SELECT \"from\", \"table\" FROM pragma_foreign_key_list('reviews') UNION ALL SELECT 'unique', COUNT(*) FROM pragma_index_list('reviews') WHERE \"unique\" = 1"
      }
    ]
  },
  {
    "id": "delete-subquery",
    "module": "modify2",
    "db": "store",
    "title": "DELETE with a subquery",
    "concept": "To delete rows based on another table, use a subquery in the WHERE. Here the items of cancelled orders are deleted without touching the orders themselves.",
    "steps": [
      {
        "task": "Delete from order_items the lines that belong to cancelled orders.",
        "solution": "DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE status = 'cancelled')",
        "hints": [
          "WHERE order_id IN (SELECT id FROM orders WHERE status = 'cancelled')"
        ],
        "requires": [
          "DELETE",
          "(SELECT"
        ],
        "check": "SELECT order_id, product_id, quantity FROM order_items"
      }
    ]
  },
  {
    "id": "upsert",
    "module": "modify2",
    "db": "store",
    "title": "Insert or update: ON CONFLICT",
    "concept": "Inserting a row whose key already exists is an error. ON CONFLICT (column) DO UPDATE SET … updates the existing row instead; excluded.column is the value you tried to insert. This is called an upsert. MySQL writes it ON DUPLICATE KEY UPDATE.",
    "example": "INSERT INTO products (id, name, stock) VALUES (8, 'Cuaderno', 5) ON CONFLICT (id) DO NOTHING;",
    "steps": [
      {
        "task": "Ten Headphones arrived (id 4, Electronics, price 899). Insert them with an INSERT that, since the id already exists, adds those 10 units to the current stock.",
        "solution": "INSERT INTO products (id, name, category, price, stock) VALUES (4, 'Audífonos', 'Electronics', 899, 10) ON CONFLICT (id) DO UPDATE SET stock = stock + excluded.stock",
        "hints": [
          "… VALUES (4, …, 10) ON CONFLICT (id) DO UPDATE SET …",
          "SET stock = stock + excluded.stock"
        ],
        "requires": [
          "ON CONFLICT"
        ],
        "check": "SELECT id, name, stock FROM products"
      }
    ]
  },
  {
    "id": "create-table-as",
    "module": "modify2",
    "db": "store",
    "title": "Saving a result: CREATE TABLE AS",
    "concept": "CREATE TABLE new AS SELECT … creates a table with the query’s columns and rows. It saves a summary so you can query it later without recomputing it.",
    "steps": [
      {
        "task": "Create the table summary with each category and how many products it has (columns category and total).",
        "solution": "CREATE TABLE summary AS SELECT category, COUNT(*) AS total FROM products GROUP BY category",
        "hints": [
          "CREATE TABLE summary AS SELECT category, COUNT(*) AS total FROM products GROUP BY category"
        ],
        "requires": [
          "CREATE TABLE"
        ],
        "check": "SELECT * FROM summary"
      }
    ]
  },
  {
    "id": "create-view",
    "module": "modify2",
    "db": "store",
    "title": "Saved queries: CREATE VIEW",
    "concept": "A view is a named query. You use it like a table, but it stores no data: it runs again every time you query it, so it is always up to date.",
    "example": "CREATE VIEW caros AS SELECT * FROM products WHERE price > 1000;",
    "steps": [
      {
        "task": "Create the view category_sales with each category and the units sold in it (columns category and units).",
        "solution": "CREATE VIEW category_sales AS SELECT pr.category, SUM(d.quantity) AS unidades FROM order_items d JOIN products pr ON pr.id = d.product_id GROUP BY pr.category",
        "hints": [
          "CREATE VIEW category_sales AS and then the query.",
          "Join order_items to products, group by category and sum quantity."
        ],
        "requires": [
          "CREATE VIEW"
        ],
        "check": "SELECT * FROM category_sales"
      }
    ]
  },
  {
    "id": "create-index",
    "module": "modify2",
    "db": "store",
    "title": "Faster queries: CREATE INDEX",
    "concept": "An index works like a book’s index: it finds rows by a column without reading the whole table. It pays off on columns you use a lot in WHERE or JOIN, like foreign keys. It does not change results, only speed.",
    "example": "CREATE INDEX idx_clientes_ciudad ON customers (city);",
    "steps": [
      {
        "task": "Create an index on the customer_id column of orders. Give it any name you like.",
        "solution": "CREATE INDEX idx_pedidos_cliente ON orders (customer_id)",
        "hints": [
          "CREATE INDEX idx_orders_customer ON orders (customer_id)"
        ],
        "requires": [
          "CREATE INDEX"
        ],
        "check": "SELECT m.tbl_name, i.name FROM sqlite_master m JOIN pragma_index_info(m.name) i WHERE m.type = 'index'"
      }
    ]
  },
  {
    "id": "school-filter",
    "module": "school",
    "db": "school",
    "title": "Meet the school",
    "concept": "A new database to review everything so far: students, subjects and grades (0 to 10; 6 passes). The scholarship column holds the scholarship percentage and is NULL when a student has none.",
    "steps": [
      {
        "task": "Show the name and scholarship of the students in section 1A who have a scholarship.",
        "solution": "SELECT name, scholarship FROM students WHERE class_group = '1A' AND scholarship IS NOT NULL",
        "hints": [
          "WHERE section = '1A' AND scholarship IS NOT NULL"
        ],
        "requires": [
          "AND"
        ]
      }
    ]
  },
  {
    "id": "school-age",
    "module": "school",
    "db": "school",
    "title": "Each student’s age",
    "concept": "Subtracting two julianday values gives days. Divided by 365.25 that gives years with decimals, and CAST(… AS INTEGER) drops the decimals: the age in full years.",
    "steps": [
      {
        "task": "Show each student’s name and their age in full years on January 1, 2026. Name the column age.",
        "solution": "SELECT name, CAST((julianday('2026-01-01') - julianday(birth_date)) / 365.25 AS INTEGER) AS edad FROM students",
        "hints": [
          "julianday('2026-01-01') - julianday(birth_date) gives the days lived.",
          "Divide by 365.25 and convert with CAST(… AS INTEGER)."
        ],
        "requires": [
          "CAST"
        ]
      }
    ]
  },
  {
    "id": "school-average",
    "module": "school",
    "db": "school",
    "title": "Each student’s average",
    "concept": "To average per student, join students to grades and group by student. Group by id as well as name: two students could share a name.",
    "steps": [
      {
        "task": "Show each student’s name and their average rounded to 2 decimals, from best to worst.",
        "solution": "SELECT a.name, ROUND(AVG(c.score), 2) AS promedio FROM students a JOIN grades c ON c.student_id = a.id GROUP BY a.id, a.name ORDER BY promedio DESC",
        "hints": [
          "students JOIN grades ON g.student_id = s.id, grouping by student.",
          "ROUND(AVG(g.grade), 2) AS average … ORDER BY average DESC"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "school-failed",
    "module": "school",
    "db": "school",
    "title": "Failed subjects",
    "concept": "When two tables share a column name (students.name and subjects.name), alias one of them in the SELECT so the result does not have two identical columns.",
    "steps": [
      {
        "task": "Show the student’s name, the subject and the grade of every failed subject (below 6).",
        "solution": "SELECT a.name, m.name AS materia, c.score FROM grades c JOIN students a ON a.id = c.student_id JOIN subjects m ON m.id = c.subject_id WHERE c.score < 6",
        "hints": [
          "Join grades to students and to subjects.",
          "sub.name AS subject … WHERE g.grade < 6"
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "school-no-grades",
    "module": "school",
    "db": "school",
    "title": "Students without grades",
    "concept": "LEFT JOIN review: it keeps every student even without grades, and those without a match get NULL in the right-hand columns.",
    "steps": [
      {
        "task": "Show the name and section of the students who have no grades yet. Use LEFT JOIN.",
        "solution": "SELECT a.name, a.class_group FROM students a LEFT JOIN grades c ON c.student_id = a.id WHERE c.student_id IS NULL",
        "hints": [
          "LEFT JOIN grades … WHERE g.student_id IS NULL"
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "school-subjects",
    "module": "school",
    "db": "school",
    "title": "Summary by subject",
    "concept": "A typical report: for each subject, how many students take it and their average. It is a JOIN with GROUP BY and two aggregates.",
    "steps": [
      {
        "task": "For each subject show its name, how many students have a grade in it and the average rounded to 2 decimals, from the best average to the worst.",
        "solution": "SELECT m.name, COUNT(*) AS students, ROUND(AVG(c.score), 2) AS promedio FROM subjects m JOIN grades c ON c.subject_id = m.id GROUP BY m.id, m.name ORDER BY promedio DESC",
        "hints": [
          "subjects JOIN grades, GROUP BY sub.id, sub.name, with COUNT(*) and AVG."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "school-pass-rate",
    "module": "school",
    "db": "school",
    "title": "Pass rate",
    "concept": "SUM(CASE WHEN … THEN 1 ELSE 0 END) counts those that qualify; divided by COUNT(*) it gives the share. Multiply by 100.0 (with a decimal) to avoid integer division.",
    "steps": [
      {
        "task": "For each subject, show its name and the percentage of passing grades (6 or more), rounded to 1 decimal.",
        "solution": "SELECT m.name, ROUND(100.0 * SUM(CASE WHEN c.score >= 6 THEN 1 ELSE 0 END) / COUNT(*), 1) AS porcentaje FROM subjects m JOIN grades c ON c.subject_id = m.id GROUP BY m.id, m.name",
        "hints": [
          "100.0 * SUM(CASE WHEN g.grade >= 6 THEN 1 ELSE 0 END) / COUNT(*)"
        ],
        "requires": [
          "CASE"
        ]
      }
    ]
  },
  {
    "id": "school-weighted",
    "module": "school",
    "db": "school",
    "title": "Credit-weighted average",
    "concept": "In a weighted average each grade counts by its weight: add up grade times credits and divide by the sum of credits. An 8-credit subject weighs twice as much as a 4-credit one.",
    "steps": [
      {
        "task": "Show the name of each student with grades and their credit-weighted average, rounded to 2 decimals.",
        "solution": "SELECT a.name, ROUND(SUM(c.score * m.credits) / SUM(m.credits), 2) AS promedio_ponderado FROM students a JOIN grades c ON c.student_id = a.id JOIN subjects m ON m.id = c.subject_id GROUP BY a.id, a.name",
        "hints": [
          "You need all three tables: students, grades and subjects.",
          "SUM(g.grade * sub.credits) / SUM(sub.credits)"
        ],
        "requires": [
          "SUM"
        ]
      }
    ]
  },
  {
    "id": "school-teachers",
    "module": "school",
    "db": "school",
    "title": "Each teacher’s load",
    "concept": "COUNT(DISTINCT …) avoids double counting: a student who takes two subjects with the same teacher counts as one student for that teacher.",
    "steps": [
      {
        "task": "For each teacher, show how many subjects they teach and how many different students they grade.",
        "solution": "SELECT m.teacher, COUNT(DISTINCT m.id) AS subjects, COUNT(DISTINCT c.student_id) AS students FROM subjects m LEFT JOIN grades c ON c.subject_id = m.id GROUP BY m.teacher",
        "hints": [
          "Group by sub.teacher and use COUNT(DISTINCT sub.id) and COUNT(DISTINCT g.student_id)."
        ],
        "requires": [
          "COUNT(DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "school-best-in-group",
    "module": "school",
    "db": "school",
    "title": "The best average in each section",
    "concept": "Final challenge: combine a WITH for the averages, RANK with PARTITION BY to order them within each section, and a filter to keep first place.",
    "steps": [
      {
        "task": "For each section, show the section, the name of the student with the best average and that average rounded to 2 decimals.",
        "solution": "WITH p AS (SELECT a.class_group, a.name, AVG(c.score) AS promedio FROM students a JOIN grades c ON c.student_id = a.id GROUP BY a.id, a.class_group, a.name), r AS (SELECT class_group, name, promedio, RANK() OVER (PARTITION BY class_group ORDER BY promedio DESC) AS lugar FROM p) SELECT class_group, name, ROUND(promedio, 2) AS promedio FROM r WHERE lugar = 1",
        "hints": [
          "First WITH: average per student, keeping their section.",
          "Second WITH: RANK() OVER (PARTITION BY section ORDER BY average DESC); outside, WHERE place = 1."
        ],
        "requires": [
          "OVER",
          "PARTITION BY"
        ]
      }
    ]
  },
  {
    "id": "top-product",
    "module": "challenges",
    "db": "store",
    "title": "The most ordered product",
    "concept": "Combine JOIN, GROUP BY, ORDER BY and LIMIT. The task does not tell you where to start: think about which tables you need and the order each clause runs in.",
    "steps": [
      {
        "task": "Show the name of the product with the most units ordered and how many units that was.",
        "solution": "SELECT pr.name, SUM(d.quantity) AS unidades FROM order_items d JOIN products pr ON pr.id = d.product_id GROUP BY pr.id, pr.name ORDER BY unidades DESC LIMIT 1",
        "hints": [
          "Add up quantity per product.",
          "Sort from highest to lowest and keep 1 row."
        ],
        "requires": [
          "GROUP BY",
          "LIMIT"
        ]
      }
    ]
  },
  {
    "id": "dept-average",
    "module": "challenges",
    "db": "company",
    "title": "The best-paid department",
    "concept": "You need the department name (another table), an average per group and only the highest one.",
    "steps": [
      {
        "task": "Show the name of the department with the highest average salary and that average rounded to 2 decimals.",
        "solution": "SELECT d.name, ROUND(AVG(e.salary), 2) AS promedio FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.id, d.name ORDER BY promedio DESC LIMIT 1",
        "hints": [
          "Join employees with departments and group by department.",
          "ORDER BY the average DESC LIMIT 1."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "above-dept-average",
    "module": "challenges",
    "db": "company",
    "title": "Above their department’s average",
    "concept": "A correlated subquery uses columns from the outer query, so it is recalculated for each row. Here the average is computed only over the department of the employee being checked.",
    "example": "SELECT name FROM employees e WHERE salary = (SELECT MAX(salary) FROM employees WHERE department_id = e.department_id);",
    "steps": [
      {
        "task": "Show name and salary of the employees who earn more than their own department’s average.",
        "solution": "SELECT e.name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)",
        "hints": [
          "Alias the outer table: FROM employees e.",
          "Inside: WHERE department_id = e.department_id."
        ],
        "requires": [
          "(SELECT"
        ]
      }
    ]
  },
  {
    "id": "monthly-revenue",
    "module": "challenges",
    "db": "store",
    "title": "Revenue per month",
    "concept": "The final challenge brings together dates, several JOINs, a filter and a calculated aggregate.",
    "steps": [
      {
        "task": "Show the revenue for each month (quantity times price, no cancelled orders), with the month as 2025-03, sorted from oldest to newest.",
        "solution": "SELECT strftime('%Y-%m', p.order_date) AS mes, SUM(d.quantity * pr.price) AS ingreso FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY mes ORDER BY mes",
        "hints": [
          "strftime('%Y-%m', o.order_date) for the month.",
          "Join orders, order_items and products."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  },
  {
    "id": "second-highest",
    "module": "interview",
    "db": "company",
    "title": "The second-highest salary",
    "concept": "An interview classic. There are several ways: the maximum of salaries below the maximum, ORDER BY with LIMIT and OFFSET, or DENSE_RANK. Any approach that gives the right result counts.",
    "steps": [
      {
        "task": "Show the second-highest salary in the company.",
        "solution": "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)",
        "hints": [
          "The maximum of the salaries below the maximum."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "duplicates",
    "module": "interview",
    "db": "store",
    "title": "Finding duplicates",
    "concept": "To find repeated records, group by the column that should be unique and keep the groups with more than one row.",
    "steps": [
      {
        "task": "Show the emails that appear more than once in subscribers and how many times.",
        "solution": "SELECT email, COUNT(*) FROM subscribers GROUP BY email HAVING COUNT(*) > 1",
        "hints": [
          "GROUP BY email with HAVING COUNT(*) > 1."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "two-months",
    "module": "interview",
    "db": "store",
    "title": "Returning customers",
    "concept": "COUNT(DISTINCT …) also works on a calculation, like the month of a date, and can go in HAVING.",
    "steps": [
      {
        "task": "Show the names of the customers who placed orders in at least two different months.",
        "solution": "SELECT c.name FROM customers c JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name HAVING COUNT(DISTINCT strftime('%Y-%m', p.order_date)) >= 2",
        "hints": [
          "HAVING COUNT(DISTINCT strftime('%Y-%m', o.order_date)) >= 2"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "growth",
    "module": "interview",
    "db": "store",
    "title": "Month-over-month growth",
    "concept": "Growth % = (this month - last month) * 100 / last month. Put together what you have seen: revenue per month in a WITH and LAG for the previous month.",
    "steps": [
      {
        "task": "Show each month, its revenue (quantity times price, no cancelled orders) and the growth % over the previous month, rounded to 1 decimal.",
        "solution": "WITH m AS (SELECT strftime('%Y-%m', p.order_date) AS mes, SUM(d.quantity * pr.price) AS ingreso FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY mes) SELECT mes, ingreso, ROUND((ingreso - LAG(ingreso) OVER (ORDER BY mes)) * 100.0 / LAG(ingreso) OVER (ORDER BY mes), 1) AS crecimiento FROM m",
        "hints": [
          "Work out revenue per month in a WITH, as in the revenue per month challenge.",
          "(revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 / LAG(revenue) OVER (ORDER BY month)"
        ],
        "requires": [
          "LAG"
        ]
      }
    ]
  },
  {
    "id": "more-than-boss",
    "module": "interview",
    "db": "company",
    "title": "Earns more than their manager",
    "concept": "Another classic: join the table to itself so the employee and their manager share a row, then compare.",
    "steps": [
      {
        "task": "Show the name and salary of the employees who earn more than their manager, along with the manager’s name and salary.",
        "solution": "SELECT e.name, e.salary, j.name AS jefe, j.salary FROM employees e JOIN employees j ON e.manager_id = j.id WHERE e.salary > j.salary",
        "hints": [
          "FROM employees e JOIN employees m ON e.manager_id = m.id WHERE e.salary > m.salary"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "all-above",
    "module": "interview",
    "db": "company",
    "title": "Where everyone qualifies",
    "concept": "\"Everyone earns more than X\" is the same as \"the lowest earner earns more than X\". MIN in HAVING turns a \"for all\" into a single condition.",
    "steps": [
      {
        "task": "Show the names of the departments where every employee earns more than 35000.",
        "solution": "SELECT d.name FROM departments d JOIN employees e ON e.department_id = d.id GROUP BY d.id, d.name HAVING MIN(e.salary) > 35000",
        "hints": [
          "Group by department and use HAVING MIN(e.salary) > 35000."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "median",
    "module": "interview",
    "db": "company",
    "title": "The median",
    "concept": "The median is the middle value once sorted; with an even number of rows, the average of the two middle ones. SQLite has no MEDIAN: number the rows with ROW_NUMBER, count them with COUNT(*) OVER () and average the middle rows.",
    "steps": [
      {
        "task": "Work out the median salary.",
        "solution": "WITH ordenados AS (SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) AS n, COUNT(*) OVER () AS total FROM employees) SELECT AVG(salary) AS mediana FROM ordenados WHERE n IN ((total + 1) / 2, (total + 2) / 2)",
        "hints": [
          "ROW_NUMBER() OVER (ORDER BY salary) AS n and COUNT(*) OVER () AS total in a WITH.",
          "The middle rows are n = (total + 1) / 2 and n = (total + 2) / 2 (integer division)."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "inactive",
    "module": "interview",
    "db": "store",
    "title": "Inactive customers",
    "concept": "To find who stopped buying, get each customer’s last order date with MAX and filter with HAVING. It is the basis of retention analysis.",
    "steps": [
      {
        "task": "Show the name and last order date of the customers who have not ordered since August 1, 2025.",
        "solution": "SELECT c.name, MAX(p.order_date) AS ultimo FROM customers c JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name HAVING MAX(p.order_date) < '2025-08-01'",
        "hints": [
          "Group by customer and use HAVING MAX(o.order_date) < '2025-08-01'."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "first-order",
    "module": "interview",
    "db": "store",
    "title": "From signup to first purchase",
    "concept": "Combine an aggregate (MIN for the first order) with date arithmetic on the result. Functions like julianday accept an aggregate as their argument.",
    "steps": [
      {
        "task": "For each customer who has bought, show their name, the date of their first order and how many days passed from signup to that order.",
        "solution": "SELECT c.name, MIN(p.order_date) AS primer_pedido, julianday(MIN(p.order_date)) - julianday(c.signup_date) AS dias FROM customers c JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name",
        "hints": [
          "MIN(o.order_date) gives the first order; subtract the signup date with julianday."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "nth-highest",
    "module": "interview",
    "db": "company",
    "title": "The third highest salary",
    "concept": "For the Nth highest value, DENSE_RANK numbers the distinct values without gaps: two equal salaries share a place and the next one follows. Then you filter the place you want.",
    "steps": [
      {
        "task": "Find the third highest salary (not counting repeats).",
        "solution": "WITH r AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS lugar FROM employees) SELECT DISTINCT salary FROM r WHERE lugar = 3",
        "hints": [
          "Compute DENSE_RANK() OVER (ORDER BY salary DESC) in a WITH.",
          "Outside: SELECT DISTINCT salary FROM r WHERE place = 3"
        ],
        "requires": [
          "DENSE_RANK"
        ]
      }
    ]
  },
  {
    "id": "top-earner-dept",
    "module": "interview",
    "db": "company",
    "title": "The top earner in each department",
    "concept": "A classic: the row with the maximum in each group. Number within each group with RANK and keep place 1; with RANK, a tie shows both.",
    "steps": [
      {
        "task": "For each department, show its name and the name and salary of whoever earns the most there.",
        "solution": "WITH r AS (SELECT name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS lugar FROM employees WHERE department_id IS NOT NULL) SELECT d.name AS departamento, r.name, r.salary FROM r JOIN departments d ON d.id = r.department_id WHERE r.lugar = 1",
        "hints": [
          "RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) in a WITH.",
          "Join departments and filter place = 1."
        ],
        "requires": [
          "OVER"
        ]
      }
    ]
  },
  {
    "id": "multi-category",
    "module": "interview",
    "db": "store",
    "title": "Customers who buy across the board",
    "concept": "COUNT(DISTINCT column) in a HAVING answers \"across how many different things?\": categories bought, active months, stores visited.",
    "steps": [
      {
        "task": "Show the customers who have bought products from at least two different categories.",
        "solution": "SELECT c.name FROM customers c JOIN orders p ON p.customer_id = c.id JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id GROUP BY c.id, c.name HAVING COUNT(DISTINCT pr.category) >= 2",
        "hints": [
          "Join customers, orders, order_items and products, and group by customer.",
          "HAVING COUNT(DISTINCT pr.category) >= 2"
        ],
        "requires": [
          "COUNT(DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "days-between",
    "module": "interview",
    "db": "store",
    "title": "Days between one purchase and the next",
    "concept": "LAG brings the same customer’s previous order date; julianday turns dates into numbers so you can subtract them. Then you group to get each customer’s average.",
    "steps": [
      {
        "task": "For customers with more than one order, show their customer_id and the average number of days between one order and the next.",
        "solution": "WITH g AS (SELECT customer_id, julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS dias FROM orders) SELECT customer_id, AVG(dias) AS promedio FROM g WHERE dias IS NOT NULL GROUP BY customer_id",
        "hints": [
          "In a WITH: julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)).",
          "Each customer’s first order gives NULL: drop it with WHERE days IS NOT NULL and average per customer."
        ],
        "requires": [
          "LAG"
        ]
      }
    ]
  },
  {
    "id": "pivot",
    "module": "interview",
    "db": "store",
    "title": "A pivot table in SQL",
    "concept": "To turn values into columns (one per status, for example), group by the row you want and sum one CASE per column. It is what an Excel pivot table does.",
    "steps": [
      {
        "task": "Show one row per month (formatted like 2025-03), in order, with three columns: how many orders were delivered, how many are shipped and how many were cancelled.",
        "solution": "SELECT strftime('%Y-%m', order_date) AS mes, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS entregados, SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) AS enviados, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelados FROM orders GROUP BY mes ORDER BY mes",
        "hints": [
          "Group by strftime('%Y-%m', order_date).",
          "One column per status: SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)"
        ],
        "requires": [
          "CASE"
        ]
      }
    ]
  },
  {
    "id": "select-exclude",
    "module": "select",
    "db": "store",
    "title": "DuckDB Superpower: SELECT * EXCLUDE",
    "concept": "In standard SQL, if you want all columns except one, you must type every column name manually. DuckDB gives you EXCLUDE (column), keeping every column except the ones you specify!",
    "example": "SELECT * EXCLUDE (email) FROM customers;",
    "steps": [
      {
        "task": "Select all columns from products except the stock column using DuckDB's EXCLUDE clause.",
        "solution": "SELECT * EXCLUDE (stock) FROM products",
        "hints": [
          "Use SELECT * EXCLUDE (stock)",
          "The table is products: SELECT * EXCLUDE (stock) FROM products"
        ]
      }
    ],
    "isDuckDbFeature": true
  },
  {
    "id": "select-replace",
    "module": "select",
    "db": "store",
    "title": "DuckDB Superpower: SELECT * REPLACE",
    "concept": "DuckDB allows you to modify specific columns on the fly without rewriting the entire column list using REPLACE (expression AS column_name).",
    "example": "SELECT * REPLACE (price * 1.1 AS price) FROM products;",
    "steps": [
      {
        "task": "Select all columns from products, but replace the price with price * 1.2 using the REPLACE clause.",
        "solution": "SELECT * REPLACE (price * 1.2 AS price) FROM products",
        "hints": [
          "Use SELECT * REPLACE (price * 1.2 AS price)",
          "Query products table: SELECT * REPLACE (price * 1.2 AS price) FROM products"
        ]
      }
    ],
    "isDuckDbFeature": true
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
  },
  {
    "id": "qualify-clause",
    "module": "window",
    "db": "store",
    "title": "DuckDB Superpower: The QUALIFY Clause",
    "concept": "In Postgres or MySQL, filtering by a window function requires nesting your query inside a CTE or subquery. DuckDB supports QUALIFY, which works like HAVING but for window functions!",
    "example": "SELECT name, category, price FROM products QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) <= 1;",
    "steps": [
      {
        "task": "Find the single most expensive product in each category using QUALIFY with ROW_NUMBER() <= 1.",
        "solution": "SELECT name, category, price FROM products QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1",
        "hints": [
          "SELECT name, category, price FROM products",
          "Add QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1"
        ]
      }
    ],
    "isDuckDbFeature": true
  }
];
