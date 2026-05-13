-- TASK 1
SELECT c.name, o.id AS order_id, o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- TASK 2
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- TASK 3
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- TASK 4
SELECT o.id AS order_id, p.name AS product_name, oi.quantity
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;

-- TASK 5
SELECT c.name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY total_spent DESC;

-- TASK 6
SELECT c1.name AS customer_1, c2.name AS customer_2, c1.city
FROM customers c1
JOIN customers c2 ON c1.city = c2.city AND c1.id < c2.id;

-- TASK 7
SELECT c.name, p.name AS product_name
FROM customers c
CROSS JOIN products p
WHERE c.id <= 3 AND p.id <= 3;

-- TASK 8
SELECT c.name, o.id AS order_id, o.order_date
FROM customers c
LEFT JOIN (
    SELECT DISTINCT ON (customer_id) *
    FROM orders
    WHERE order_date <= '2024-06-01'
    ORDER BY customer_id, order_date DESC
) o ON c.id = o.customer_id
WHERE o.id IS NOT NULL;
