-- TASK 1: Run Your First Query
SELECT * FROM users;

-- TASK 2: Understanding Tables
SELECT firstname, age FROM workers;

-- TASK 3: Select All Columns
SELECT * FROM objects;

-- TASK 4: DISTINCT — Unique Values
SELECT DISTINCT seniority FROM users;

-- TASK 5: Column Aliases with AS
SELECT firstname AS name, exp_years AS experience FROM workers;

-- TASK 6: Calculated Columns
SELECT firstname, age, age * 12 AS age_in_months FROM workers;

-- TASK 7: COUNT — How Many Rows?
SELECT COUNT(*) AS total_workers FROM workers;

-- TASK 8: String Concatenation
SELECT firstname || ' - ' || gender AS profile FROM workers;
