-- Seed data for Lecture 3: JOINs
-- Multi-table e-commerce dataset for practicing various JOIN types.

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR,
    city VARCHAR NOT NULL,
    joined_date DATE NOT NULL
);

INSERT INTO customers VALUES
    (1, 'Alice Chen', 'alice@email.com', 'San Francisco', '2023-01-15'),
    (2, 'Bob Martinez', 'bob@email.com', 'New York', '2023-03-22'),
    (3, 'Carol White', 'carol@email.com', 'San Francisco', '2023-06-10'),
    (4, 'David Kim', 'david@email.com', 'Chicago', '2023-09-05'),
    (5, 'Emma Johnson', 'emma@email.com', 'New York', '2024-01-18'),
    (6, 'Frank Brown', NULL, 'Chicago', '2024-04-02');

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR NOT NULL
);

INSERT INTO products VALUES
    (1, 'Laptop', 999.99, 'Electronics'),
    (2, 'Headphones', 149.99, 'Electronics'),
    (3, 'Notebook', 12.99, 'Stationery'),
    (4, 'Desk Lamp', 45.00, 'Home'),
    (5, 'Backpack', 79.99, 'Accessories');

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);

INSERT INTO orders VALUES
    (101, 1, '2024-01-10', 1149.98),
    (102, 2, '2024-02-15', 149.99),
    (103, 1, '2024-03-20', 57.99),
    (104, 3, '2024-04-05', 999.99),
    (105, 4, '2024-05-12', 92.98),
    (106, 2, '2024-06-18', 45.00),
    (107, 5, '2024-07-01', 229.98);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

INSERT INTO order_items VALUES
    (1, 101, 1, 1, 999.99),
    (2, 101, 2, 1, 149.99),
    (3, 102, 2, 1, 149.99),
    (4, 103, 3, 2, 12.99),
    (5, 103, 4, 1, 45.00),
    (6, 104, 1, 1, 999.99),
    (7, 105, 3, 1, 12.99),
    (8, 105, 5, 1, 79.99),
    (9, 106, 4, 1, 45.00),
    (10, 107, 2, 1, 149.99),
    (11, 107, 5, 1, 79.99);
