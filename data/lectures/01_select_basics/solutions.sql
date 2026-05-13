-- TASK 1
SELECT * FROM products;

-- TASK 2
SELECT name, price FROM products;

-- TASK 3
SELECT name AS product_name, price AS cost FROM products;

-- TASK 4
SELECT name, price, price * 1.15 AS price_with_tax FROM products;

-- TASK 5
SELECT DISTINCT category_id FROM products;

-- TASK 6
SELECT COUNT(*) AS total_products FROM products;

-- TASK 7
SELECT * FROM categories;

-- TASK 8
SELECT name || ' — ' || printf('$%.2f', price) AS label FROM products;
