import { ExerciseDef } from "../../types/curriculum";

export const challenges_exercises: ExerciseDef[] = [
  {
    "id": "top-product",
    "module": "challenges",
    "db": "store",
    "title": "The most ordered product",
    "concept": "Combine JOIN, GROUP BY, ORDER BY and LIMIT. The task does not tell you where to start: think about which tables you need and the order each clause runs in.",
    "steps": [
      {
        "task": "Show the name of the product with the most units ordered and how many units that was (as total_units).",
        "solution": "SELECT pr.name, SUM(d.quantity) AS total_units FROM order_items d JOIN products pr ON pr.id = d.product_id GROUP BY pr.id, pr.name ORDER BY total_units DESC LIMIT 1",
        "hints": [
          "Add up quantity per product: SUM(d.quantity) AS total_units.",
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
        "task": "Show the name of the department with the highest average salary and that average rounded to 2 decimals (named avg_salary).",
        "solution": "SELECT d.name, ROUND(AVG(e.salary), 2) AS avg_salary FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.id, d.name ORDER BY avg_salary DESC LIMIT 1",
        "hints": [
          "Join employees with departments and group by department.",
          "ORDER BY avg_salary DESC LIMIT 1."
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
        "task": "Show the revenue for each month (quantity times price, no cancelled orders), with the month as 2025-03 (as month) and total revenue (as revenue), sorted from oldest to newest.",
        "solution": "SELECT strftime('%Y-%m', p.order_date) AS month, SUM(d.quantity * pr.price) AS revenue FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY month ORDER BY month",
        "hints": [
          "strftime('%Y-%m', p.order_date) AS month",
          "SUM(d.quantity * pr.price) AS revenue",
          "Join orders, order_items and products."
        ],
        "requires": [
          "JOIN",
          "GROUP BY"
        ]
      }
    ]
  }
];
