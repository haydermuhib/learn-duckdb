-- TASK 1: ORDER BY — Sort Your Results
SELECT * FROM items ORDER BY weight DESC;

-- TASK 2: Multi-Column Sorting
SELECT * FROM competition WHERE age < 50 ORDER BY age DESC, avg_speed DESC;

-- TASK 3: LIMIT — Take Only What You Need
SELECT * FROM temperature ORDER BY temp ASC LIMIT 5;

-- TASK 4: NULL — The Unknown Value
SELECT DISTINCT name FROM inventory WHERE name IS NOT NULL;

-- TASK 5: Sorting with NULLs
SELECT name, color FROM inventory ORDER BY color ASC NULLS FIRST;

-- TASK 6: Modulo — The % Operator
SELECT * FROM items WHERE id % 2 = 0 ORDER BY id ASC;

-- TASK 7: Integer Division with FLOOR
SELECT name, FLOOR(weight / 3.0) AS bags_needed FROM items ORDER BY bags_needed DESC;

-- TASK 8: Recap Challenge — Salary Raise
SELECT id FROM employees WHERE married IS TRUE ORDER BY salary ASC LIMIT 4;
