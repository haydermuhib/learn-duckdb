-- TASK 1: WHERE — Your First Filter
SELECT * FROM sales WHERE coin = 'AGK';

-- TASK 2: AND — Multiple Conditions
SELECT * FROM people WHERE age >= 20 AND age <= 28;

-- TASK 3: OR and NOT — Flexible Filters
SELECT * FROM people WHERE (employed IS NOT TRUE OR (age >= 20 AND age <= 28)) AND age != 22;

-- TASK 4: Booleans — TRUE and FALSE
SELECT * FROM objects WHERE colorful IS TRUE;

-- TASK 5: IN — Match a List
SELECT * FROM countries WHERE country IN ('Oman', 'Nicaragua', 'Bhutan', 'Senegal', 'Belarus');

-- TASK 6: BETWEEN — Range Queries
SELECT * FROM numbers WHERE value BETWEEN 5 AND 10;

-- TASK 7: LIKE — Pattern Matching
SELECT * FROM names WHERE name LIKE 'k%a' ORDER BY name DESC;

-- TASK 8: Combining Everything
SELECT id, name FROM objects WHERE category IN ('tool', 'stationery') AND weight > 0.1 AND name LIKE '%e%' ORDER BY weight ASC;
