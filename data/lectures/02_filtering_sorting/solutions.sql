-- TASK 1
SELECT * FROM employees WHERE department_id = 2;

-- TASK 2
SELECT * FROM employees WHERE salary > 70000;

-- TASK 3
SELECT name, salary FROM employees WHERE department_id = 1 AND salary > 60000;

-- TASK 4
SELECT name, department_id FROM employees WHERE department_id IN (1, 3);

-- TASK 5
SELECT name, email FROM employees WHERE name LIKE 'A%';

-- TASK 6
SELECT name, salary FROM employees ORDER BY salary ASC;

-- TASK 7
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;

-- TASK 8
SELECT name FROM employees WHERE email IS NULL;
