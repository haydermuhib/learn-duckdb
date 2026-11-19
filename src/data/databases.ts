import { DatabaseDef } from "../types/curriculum";

export const DATABASES: Record<string, DatabaseDef> = {
  store: {
    id: "store",
    title: "Online Store",
    description: "E-commerce platform with customers, orders, inventory, and reviews.",
    tables: [
      {
        name: "customers",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["name", "TEXT NOT NULL"],
          ["email", "TEXT"],
          ["city", "TEXT"],
          ["signup_date", "DATE"]
        ],
        rows: [
          [1, "Bilal", "bilal@gmail.com", "London", "2024-01-10"],
          [2, "Emma", "emma@yahoo.com", "Birmingham", "2024-02-14"],
          [3, "Tariq", "tariq@gmail.com", "Manchester", "2024-03-01"],
          [4, "Simran", "simran@outlook.com", "Leeds", "2024-03-15"],
          [5, "Jack", "jack@gmail.com", "Bristol", "2024-04-02"],
          [6, "Aman", "aman@gmail.com", "London", "2024-04-20"],
          [7, "Fatima", null, "Birmingham", "2024-05-11"],
          [8, "Zainab", "zainab@gmail.com", "Manchester", "2024-06-01"],
          [9, "Haris", "haris@hotmail.com", "Leeds", "2024-06-18"],
          [10, "Liam", "liam@gmail.com", "London", "2024-07-04"]
        ]
      },
      {
        name: "products",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["name", "TEXT NOT NULL"],
          ["category", "TEXT"],
          ["price", "DECIMAL(10,2)"],
          ["stock", "INTEGER"]
        ],
        rows: [
          [1, "Laptop Pro", "Electronics", 1299.99, 15],
          [2, "Wireless Mouse", "Electronics", 29.99, 50],
          [3, "Headphones", "Electronics", 199.99, 0],
          [4, "Mechanical Keyboard", "Electronics", 89.99, 40],
          [5, "Desk Lamp", "Home", 45.00, 30],
          [6, "Ergonomic Chair", "Home", 249.99, 10],
          [7, "Standing Desk", "Home", 499.00, 5],
          [8, "Yoga Mat", "Sports", 25.50, 60],
          [9, "Water Bottle", "Sports", 15.00, 80],
          [10, "Running Shoes", "Sports", 110.00, 20],
          [11, "Notebook", "Stationery", 12.00, 100],
          [12, "Pen Set", "Stationery", 35.00, 45]
        ]
      },
      {
        name: "orders",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["customer_id", "INTEGER"],
          ["order_date", "DATE"],
          ["status", "TEXT"]
        ],
        rows: [
          [1, 1, "2024-05-01", "delivered"],
          [2, 2, "2024-05-03", "delivered"],
          [3, 3, "2024-05-05", "shipped"],
          [4, 1, "2024-05-10", "delivered"],
          [5, 4, "2024-05-12", "pending"],
          [6, 5, "2024-05-15", "delivered"],
          [7, 6, "2024-05-18", "cancelled"],
          [8, 2, "2024-05-20", "shipped"],
          [9, 8, "2024-05-22", "delivered"],
          [10, 3, "2024-05-25", "delivered"],
          [11, 9, "2024-06-01", "shipped"],
          [12, 10, "2024-06-03", "delivered"],
          [13, 1, "2024-06-05", "pending"],
          [14, 4, "2024-06-08", "delivered"]
        ]
      },
      {
        name: "order_items",
        columns: [
          ["order_id", "INTEGER"],
          ["product_id", "INTEGER"],
          ["quantity", "INTEGER"]
        ],
        rows: [
          [1, 1, 1], [1, 2, 2], [2, 3, 1], [2, 8, 2],
          [3, 4, 1], [4, 5, 2], [4, 6, 1], [5, 2, 1],
          [6, 7, 1], [6, 1, 1], [7, 3, 1], [8, 8, 3],
          [8, 9, 2], [9, 10, 1], [9, 11, 4], [10, 11, 2],
          [10, 4, 1], [11, 2, 2], [12, 6, 1], [13, 1, 1],
          [14, 5, 1], [14, 9, 1]
        ]
      },
      {
        name: "subscribers",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["email", "TEXT"],
          ["subscribed_at", "DATE"]
        ],
        rows: [
          [1, "bilal@gmail.com", "2024-01-15"],
          [2, "maya.design@gmail.com", "2024-02-10"],
          [3, "tariq@gmail.com", "2024-03-05"],
          [4, "sarah.k@yahoo.com", "2024-04-12"],
          [5, "jack@gmail.com", "2024-04-25"],
          [6, "simran@outlook.com", "2024-05-02"],
          [7, "sunny.dev@gmail.com", "2024-06-11"],
          [8, "bilal@gmail.com", "2024-07-14"]
        ]
      }
    ]
  },
  company: {
    id: "company",
    title: "Corporate Organization",
    description: "Enterprise hierarchy with departments, employees, managers, and salaries.",
    tables: [
      {
        name: "departments",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["name", "TEXT NOT NULL"],
          ["city", "TEXT"]
        ],
        rows: [
          [1, "Engineering", "London"],
          [2, "Data Science", "Manchester"],
          [3, "Sales", "Birmingham"],
          [4, "Marketing", "Leeds"],
          [5, "HR", "Bristol"]
        ]
      },
      {
        name: "employees",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["name", "TEXT NOT NULL"],
          ["role", "TEXT"],
          ["salary", "INTEGER"],
          ["department_id", "INTEGER"],
          ["manager_id", "INTEGER"],
          ["hire_date", "DATE"]
        ],
        rows: [
          [1, "Ali", "Engineering Lead", 95000, 1, null, "2021-02-15"],
          [2, "Maya", "Senior Frontend Dev", 72000, 1, 1, "2021-08-01"],
          [3, "Navjot", "Data Engineer", 68000, 2, null, "2022-01-10"],
          [4, "Sam", "Sales Director", 85000, 3, null, "2020-05-18"],
          [5, "Hamza", "Senior Account Exec", 58000, 3, 4, "2022-04-01"],
          [6, "Chloe", "Marketing Manager", 62000, 4, null, "2022-09-15"],
          [7, "Noah", "Backend Dev", 64000, 1, 1, "2023-01-20"],
          [8, "Simran", "Data Analyst", 52000, 2, 3, "2023-03-01"],
          [9, "Usman", "Sales Representative", 44000, 3, 4, "2023-06-15"],
          [10, "Layla", "Content Creator", 65000, 4, 6, "2023-07-01"],
          [11, "Bobby", "DevOps Engineer", 70000, 1, 1, "2023-10-10"],
          [12, "Harun", "HR Specialist", 48000, null, null, "2022-11-01"],
          [13, "Sunny", "Junior Analyst", 40000, 2, 3, "2024-01-15"],
          [14, "Amina", "QA Engineer", 50000, 1, 1, "2024-02-01"]
        ]
      }
    ]
  },
  school: {
    id: "school",
    title: "Academic Institution",
    description: "Students, academic subjects, teachers, and graded scores.",
    tables: [
      {
        name: "students",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["name", "TEXT NOT NULL"],
          ["class_group", "TEXT"],
          ["birth_date", "DATE"],
          ["scholarship", "INTEGER"]
        ],
        rows: [
          [1, "Anas", "1A", "2006-03-12", 50],
          [2, "Hiba", "1A", "2005-11-20", null],
          [3, "Sunny", "1B", "2006-01-15", 75],
          [4, "Rania", "1B", "2005-09-08", null],
          [5, "Dawud", "1A", "2006-05-22", null],
          [6, "Bobby", "1B", "2005-12-30", 50],
          [7, "Yahya", "1A", "2006-07-14", null],
          [8, "Noor", "1B", "2006-02-18", 25]
        ]
      },
      {
        name: "subjects",
        columns: [
          ["id", "INTEGER PRIMARY KEY"],
          ["name", "TEXT NOT NULL"],
          ["credits", "INTEGER"],
          ["teacher", "TEXT"]
        ],
        rows: [
          [1, "Mathematics", 6, "Dr. Khan"],
          [2, "Computer Science", 6, "Prof. Smith"],
          [3, "Physics", 5, "Dr. Patel"],
          [4, "History", 4, "Prof. Evans"],
          [5, "English", 4, "Ms. Taylor"]
        ]
      },
      {
        name: "grades",
        columns: [
          ["student_id", "INTEGER"],
          ["subject_id", "INTEGER"],
          ["score", "INTEGER"]
        ],
        rows: [
          [1, 1, 8], [1, 2, 9], [1, 3, 8], [1, 4, 7],
          [2, 1, 9], [2, 2, 8], [2, 3, 9], [2, 5, 10],
          [3, 1, 7], [3, 2, 8], [3, 4, 8], [3, 5, 8],
          [4, 1, 5], [4, 3, 7], [4, 4, 8], [4, 5, 7],
          [5, 1, 9], [5, 2, 10], [5, 3, 9], [5, 4, 8],
          [6, 2, 7], [6, 3, 7], [6, 4, 5], [6, 5, 8],
          [7, 1, 8], [7, 2, 9], [7, 3, 8], [7, 5, 8]
        ]
      }
    ]
  }
};
