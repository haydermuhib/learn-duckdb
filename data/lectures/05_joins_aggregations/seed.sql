-- Seed data for Lecture 5: JOINs & Aggregations

CREATE TABLE factory (
    id INTEGER PRIMARY KEY,
    brand VARCHAR NOT NULL,
    sugar INTEGER NOT NULL
);

INSERT INTO factory VALUES
    (1,  'Shandiin',   824),
    (2,  'Hordad',     2289),
    (3,  'Harinder',   1344),
    (4,  'Tamandani',  404),
    (5,  'Erdene',     2025),
    (6,  'Buhle',      875),
    (7,  'Ayanda',     1651),
    (8,  'Chima',      2040),
    (9,  'Yolotli',    2724),
    (10, 'Amarjeet',   2182);

CREATE TABLE book (
    id INTEGER PRIMARY KEY,
    brand VARCHAR NOT NULL,
    production_date DATE NOT NULL,
    chocolates INTEGER NOT NULL
);

INSERT INTO book VALUES
    (1,  'Shandiin',   '2024-01-15', 3),
    (2,  'Shandiin',   '2024-02-10', 4),
    (3,  'Hordad',     '2024-01-20', 8),
    (4,  'Hordad',     '2024-03-05', 10),
    (5,  'Hordad',     '2024-04-12', 9),
    (6,  'Harinder',   '2024-02-01', 5),
    (7,  'Harinder',   '2024-03-18', 6),
    (8,  'Tamandani',  '2024-01-10', 1),
    (9,  'Tamandani',  '2024-02-28', 2),
    (10, 'Erdene',     '2024-01-25', 7),
    (11, 'Erdene',     '2024-03-30', 9),
    (12, 'Buhle',      '2024-02-14', 3),
    (13, 'Buhle',      '2024-04-01', 4),
    (14, 'Ayanda',     '2024-01-05', 6),
    (15, 'Ayanda',     '2024-03-22', 7),
    (16, 'Chima',      '2024-02-20', 8),
    (17, 'Chima',      '2024-04-15', 9),
    (18, 'Yolotli',    '2024-01-30', 10),
    (19, 'Yolotli',    '2024-03-10', 12),
    (20, 'Amarjeet',   '2024-02-05', 9),
    (21, 'Amarjeet',   '2024-04-20', 8);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR,
    city VARCHAR NOT NULL,
    joined_date DATE NOT NULL
);

INSERT INTO customers VALUES
    (1, 'Alice Chen',    'alice@email.com', 'San Francisco', '2023-01-15'),
    (2, 'Bob Martinez',  'bob@email.com',   'New York',      '2023-03-22'),
    (3, 'Carol White',   'carol@email.com', 'San Francisco', '2023-06-10'),
    (4, 'David Kim',     'david@email.com', 'Chicago',       '2023-09-05'),
    (5, 'Emma Johnson',  'emma@email.com',  'New York',      '2024-01-18'),
    (6, 'Frank Brown',   NULL,              'Chicago',       '2024-04-02');

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR NOT NULL
);

INSERT INTO products VALUES
    (1, 'Laptop',      999.99,  'Electronics'),
    (2, 'Headphones',  149.99,  'Electronics'),
    (3, 'Notebook',    12.99,   'Stationery'),
    (4, 'Desk Lamp',   45.00,   'Home'),
    (5, 'Backpack',    79.99,   'Accessories');

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL
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
    unit_price DECIMAL(10,2) NOT NULL
);

INSERT INTO order_items VALUES
    (1,  101, 1, 1, 999.99),
    (2,  101, 2, 1, 149.99),
    (3,  102, 2, 1, 149.99),
    (4,  103, 3, 2, 12.99),
    (5,  103, 4, 1, 45.00),
    (6,  104, 1, 1, 999.99),
    (7,  105, 3, 1, 12.99),
    (8,  105, 5, 1, 79.99),
    (9,  106, 4, 1, 45.00),
    (10, 107, 2, 1, 149.99),
    (11, 107, 5, 1, 79.99);
