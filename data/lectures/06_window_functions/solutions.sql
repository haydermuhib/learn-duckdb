-- TASK 1: Window Functions — The Big Idea
SELECT name, difficulty, SUM(difficulty) OVER (ORDER BY difficulty ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS tot_until_now FROM tools ORDER BY difficulty ASC;

-- TASK 2: ROW_NUMBER
SELECT brand, ROW_NUMBER() OVER (ORDER BY brand DESC) AS row_num FROM factory ORDER BY brand DESC;

-- TASK 3: Filter by Row Number
SELECT brand, row_num FROM (SELECT brand, ROW_NUMBER() OVER (ORDER BY brand DESC) AS row_num FROM factory) WHERE row_num % 2 = 0;

-- TASK 4: PARTITION BY
SELECT brand, production_date, chocolates, ROW_NUMBER() OVER (PARTITION BY brand ORDER BY production_date) AS production_num FROM book;

-- TASK 5: Running Average
SELECT name, difficulty, ROUND(AVG(difficulty) OVER (ORDER BY difficulty ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 1) AS avg_until_now FROM tools ORDER BY difficulty ASC;

-- TASK 6: Combining JOINs and Windows
SELECT f.brand, FLOOR(f.sugar / 243) AS choc_num, ROUND(AVG(b.chocolates), 2) AS choc_avg, ROW_NUMBER() OVER (ORDER BY f.brand DESC) AS row_num FROM factory f JOIN book b ON f.brand = b.brand GROUP BY f.brand, f.sugar ORDER BY choc_avg DESC;

-- TASK 7: Window + Subquery Filter
SELECT * FROM (SELECT f.brand, FLOOR(f.sugar / 243) AS choc_num, ROUND(AVG(b.chocolates), 2) AS choc_avg, ROW_NUMBER() OVER (ORDER BY f.brand DESC) AS row_num FROM factory f JOIN book b ON f.brand = b.brand GROUP BY f.brand, f.sugar) WHERE row_num % 2 = 0 ORDER BY choc_avg DESC;

-- TASK 8: Castle Tools — Cumulative Strength
SELECT s.hour, s.points, MAX(t.tot_until_now) AS used FROM strength s JOIN (SELECT name, difficulty, SUM(difficulty) OVER (ORDER BY difficulty ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS tot_until_now FROM tools) t ON t.tot_until_now <= s.points GROUP BY s.hour, s.points ORDER BY s.hour;
