-- TASK 1: Cellphone Search
SELECT model AS id FROM cellphones WHERE model LIKE 'm_o%' AND price BETWEEN 1000 AND 1500 AND supports_5g IS TRUE;

-- TASK 2: Criminal Arrest Report
SELECT name AS worst_criminals FROM criminals WHERE (report IS NULL OR report SIMILAR TO '%[gGbB]%') AND map IN ('Caerleon', 'Dewsbury', 'Kirkwall', 'Findochty') ORDER BY severe_score DESC LIMIT 5;

-- TASK 3: Parliamentary Elections
SELECT sit FROM ministers WHERE sit % 2 = 0 AND TRIM(status) = 'continue' AND bad_word IS NOT TRUE;

-- TASK 4: Expired Juices
SELECT id AS to_renew FROM juices WHERE (2026 - exp_year > 6) OR (exp_year BETWEEN 2026 AND 2027) ORDER BY ABS(2026 - exp_year) DESC;

-- TASK 5: Chocolate Factory
SELECT brand, sugar / 243 AS choc_num FROM factory;

-- TASK 6: Kitchen Silverware
SELECT item, cutlery AS silverware FROM kitchen WHERE cutlery < 3;

-- TASK 7: Date Arithmetic
SELECT name, exp_year, exp_year - 2026 AS years_left FROM juices ORDER BY years_left ASC;

-- TASK 8: Factory Floor Division
SELECT brand, sugar / 243 AS choc_num FROM factory WHERE sugar / 243 >= 5 ORDER BY choc_num DESC;
