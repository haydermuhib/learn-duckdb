import { ExerciseDef } from "../../types/curriculum";

export const modify2_exercises: ExerciseDef[] = [
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
  }
];
