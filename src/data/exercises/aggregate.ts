import { ExerciseDef } from "../../types/curriculum";

export const aggregate_exercises: ExerciseDef[] = [
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
  }
];
