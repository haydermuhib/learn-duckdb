-- Seed data for Lecture 1: SELECT Basics
-- Creates a small e-commerce dataset to practice fundamental SELECT queries.

CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR
);

INSERT INTO categories VALUES
    (1, 'Electronics', 'Gadgets, devices, and accessories'),
    (2, 'Books', 'Physical and digital reading material'),
    (3, 'Clothing', 'Apparel and fashion accessories'),
    (4, 'Home & Garden', 'Furniture, decor, and outdoor items');

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    in_stock BOOLEAN DEFAULT true
);

INSERT INTO products VALUES
    (1, 'Wireless Mouse', 29.99, 1, true),
    (2, 'Mechanical Keyboard', 89.99, 1, true),
    (3, 'USB-C Hub', 45.50, 1, false),
    (4, 'Python Crash Course', 35.00, 2, true),
    (5, 'SQL Pocket Guide', 19.99, 2, true),
    (6, 'Data Science Handbook', 42.00, 2, false),
    (7, 'Cotton T-Shirt', 15.99, 3, true),
    (8, 'Denim Jacket', 79.99, 3, true),
    (9, 'Desk Lamp', 34.50, 4, true),
    (10, 'Plant Pot Set', 22.00, 4, true);
