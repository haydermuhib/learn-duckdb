-- Seed data for Lecture 2: Filtering & Sorting
-- Company employee dataset with varied salaries, departments, and some NULLs.

CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL
);

INSERT INTO departments VALUES
    (1, 'Engineering'),
    (2, 'Marketing'),
    (3, 'Sales'),
    (4, 'HR');

CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    hire_date DATE NOT NULL
);

INSERT INTO employees VALUES
    (1, 'Alice Chen', 'alice@company.com', 95000.00, 1, '2020-03-15'),
    (2, 'Bob Martinez', 'bob@company.com', 72000.00, 2, '2019-07-01'),
    (3, 'Carol White', 'carol@company.com', 68000.00, 1, '2021-01-10'),
    (4, 'David Kim', NULL, 55000.00, 3, '2022-06-20'),
    (5, 'Emma Johnson', 'emma@company.com', 82000.00, 1, '2018-11-05'),
    (6, 'Frank Brown', 'frank@company.com', 61000.00, 2, '2023-02-14'),
    (7, 'Grace Lee', NULL, 77000.00, 3, '2020-09-30'),
    (8, 'Henry Wilson', 'henry@company.com', 90000.00, 4, '2017-04-22'),
    (9, 'Aria Patel', 'aria@company.com', 58000.00, 1, '2023-08-01'),
    (10, 'Jack Taylor', 'jack@company.com', 64000.00, 3, '2021-12-15');
