import { ExerciseDef } from "../../types/curriculum";

export const modify_exercises: ExerciseDef[] = [
  {
    "id": "insert",
    "module": "modify",
    "db": "store",
    "title": "Adding rows with INSERT",
    "concept": "INSERT INTO table (columns) VALUES (values) adds a row. Columns you leave out are NULL, except id: as an INTEGER PRIMARY KEY, the database assigns the next number.",
    "example": "INSERT INTO customers (name, city) VALUES ('Karla Rios', 'Leeds');",
    "steps": [
      {
        "task": "Add the product Speaker, in the Electronics category, with price 1199 and stock 12.",
        "solution": "INSERT INTO products (name, category, price, stock) VALUES ('Speaker', 'Electronics', 1199, 12)",
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
    "example": "UPDATE products SET stock = stock + 10 WHERE name = 'Coffee Maker';",
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
    "example": "CREATE TABLE categories (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
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
        "check": "SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'suppliers' ORDER BY ordinal_position"
      }
    ]
  },
  {
    "id": "insert-many",
    "module": "modify",
    "db": "store",
    "title": "Several rows in one INSERT",
    "concept": "One INSERT can add several rows at once: separate each group of values with a comma. It is faster and shorter than one INSERT per row.",
    "example": "INSERT INTO products (name, price) VALUES ('Pencil', 10), ('Eraser', 8);",
    "steps": [
      {
        "task": "In a single INSERT, add two customers: Karla Rey, from Leeds, and Luis Mora, from London (just name and city).",
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
  }
];
