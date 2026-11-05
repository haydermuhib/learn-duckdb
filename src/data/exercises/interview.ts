import { ExerciseDef } from "../../types/curriculum";

export const interview_exercises: ExerciseDef[] = [
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
  }
];
