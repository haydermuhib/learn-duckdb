import { ExerciseDef } from "../../types/curriculum";

export const select_exercises: ExerciseDef[] = [
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
  }
];
