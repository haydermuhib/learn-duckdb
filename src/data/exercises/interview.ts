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
        "task": "Show each month, its revenue (quantity times price, no cancelled orders) and the growth % over the previous month (as growth_pct), rounded to 1 decimal.",
        "solution": "WITH m AS (SELECT strftime('%Y-%m', p.order_date) AS month, SUM(d.quantity * pr.price) AS revenue FROM orders p JOIN order_items d ON d.order_id = p.id JOIN products pr ON pr.id = d.product_id WHERE p.status <> 'cancelled' GROUP BY month) SELECT month, revenue, ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct FROM m",
        "hints": [
          "Work out revenue per month in a WITH, as in the revenue per month challenge.",
          "(revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 / LAG(revenue) OVER (ORDER BY month) AS growth_pct"
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
        "solution": "SELECT e.name, e.salary, j.name AS manager_name, j.salary FROM employees e JOIN employees j ON e.manager_id = j.id WHERE e.salary > j.salary",
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
    "concept": "DuckDB provides a built-in MEDIAN(salary) aggregate function. In standard SQL without MEDIAN, you can number rows with ROW_NUMBER() and average the middle rows.",
    "steps": [
      {
        "task": "Work out the median salary (named median).",
        "solution": "SELECT MEDIAN(salary) AS median FROM employees",
        "hints": [
          "Use DuckDB's native aggregate: SELECT MEDIAN(salary) AS median FROM employees",
          "Or using window functions: WITH ranked AS (SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) AS n, COUNT(*) OVER () AS total FROM employees) SELECT AVG(salary) AS median FROM ranked WHERE n IN ((total + 1) / 2, (total + 2) / 2)"
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
        "solution": "SELECT c.name, MAX(p.order_date) AS last_order_date FROM customers c JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name HAVING MAX(p.order_date) < '2025-08-01'",
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
    "concept": "Combine an aggregate (MIN for the first order) with date arithmetic on the result. In DuckDB, use date_diff('day', start_date, end_date) to find the day difference.",
    "steps": [
      {
        "task": "For each customer who has bought, show their name, the date of their first order (as first_order_date) and how many days passed from signup to that order (as days).",
        "solution": "SELECT c.name, MIN(p.order_date) AS first_order_date, date_diff('day', CAST(c.signup_date AS DATE), CAST(MIN(p.order_date) AS DATE)) AS days FROM customers c JOIN orders p ON p.customer_id = c.id GROUP BY c.id, c.name",
        "hints": [
          "MIN(p.order_date) gives the first order; subtract with date_diff('day', CAST(c.signup_date AS DATE), CAST(MIN(p.order_date) AS DATE)) AS days."
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
        "solution": "WITH r AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank_pos FROM employees) SELECT DISTINCT salary FROM r WHERE rank_pos = 3",
        "hints": [
          "Compute DENSE_RANK() OVER (ORDER BY salary DESC) in a WITH.",
          "Outside: SELECT DISTINCT salary FROM r WHERE rank_pos = 3"
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
        "task": "For each department, show its name (as department) and the name and salary of whoever earns the most there.",
        "solution": "WITH r AS (SELECT name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_num FROM employees WHERE department_id IS NOT NULL) SELECT d.name AS department, r.name, r.salary FROM r JOIN departments d ON d.id = r.department_id WHERE r.rank_num = 1",
        "hints": [
          "RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_num in a WITH.",
          "Join departments and filter rank_num = 1."
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
    "concept": "LAG brings the same customer’s previous order date; subtracting two dates calculates the difference in days. Then you group to get each customer’s average.",
    "steps": [
      {
        "task": "For customers with more than one order, show their customer_id and the average number of days between one order and the next (as avg_days).",
        "solution": "WITH g AS (SELECT customer_id, (CAST(order_date AS DATE) - CAST(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS DATE)) AS days FROM orders) SELECT customer_id, AVG(days) AS avg_days FROM g WHERE days IS NOT NULL GROUP BY customer_id",
        "hints": [
          "In a WITH: (CAST(order_date AS DATE) - CAST(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS DATE)) AS days.",
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
        "task": "Show one row per month (formatted like 2025-03), in order, with three columns: how many orders were delivered (as delivered_orders), how many are shipped (as shipped_orders) and how many were cancelled (as cancelled_orders).",
        "solution": "SELECT strftime('%Y-%m', order_date) AS month, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders, SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) AS shipped_orders, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders FROM orders GROUP BY month ORDER BY month",
        "hints": [
          "Group by strftime('%Y-%m', order_date) AS month.",
          "One column per status: SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders"
        ],
        "requires": [
          "CASE"
        ]
      }
    ]
  }
];
