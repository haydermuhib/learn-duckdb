import { ExerciseDef } from "../../types/curriculum";

export const sets_exercises: ExerciseDef[] = [
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
  }
];
