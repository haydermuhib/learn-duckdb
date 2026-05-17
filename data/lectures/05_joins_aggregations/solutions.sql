-- TASK 1: Your First JOIN
SELECT c.name, o.id AS order_id, o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- TASK 2: LEFT JOIN — Keep Everyone
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- TASK 3: GROUP BY & SUM
SELECT c.name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY total_spent DESC;

-- TASK 4: Three-Table JOIN
SELECT o.id AS order_id, p.name AS product_name, oi.quantity
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;

-- TASK 5: AVG and ROUND
SELECT f.brand, FLOOR(f.sugar / 243) AS choc_num, ROUND(AVG(b.chocolates), 2) AS choc_avg
FROM factory f
JOIN book b ON f.brand = b.brand
GROUP BY f.brand, f.sugar
ORDER BY choc_avg DESC;

-- TASK 6: Customers Without Orders
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- TASK 7: Self JOIN
SELECT c1.name AS customer_1, c2.name AS customer_2, c1.city
FROM customers c1
JOIN customers c2 ON c1.city = c2.city AND c1.id < c2.id;

-- TASK 8: HAVING — Filter Groups
SELECT c.name, COUNT(*) AS order_count
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
HAVING COUNT(*) > 1
ORDER BY order_count DESC;
