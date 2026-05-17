-- Seed data for Lecture 6: Window Functions

CREATE TABLE factory (
    id INTEGER PRIMARY KEY,
    brand VARCHAR NOT NULL,
    sugar INTEGER NOT NULL
);

INSERT INTO factory VALUES
    (1,  'Shandiin',   824),
    (2,  'Hordad',     2289),
    (3,  'Harinder',   1344),
    (4,  'Tamandani',  404),
    (5,  'Erdene',     2025),
    (6,  'Buhle',      875),
    (7,  'Ayanda',     1651),
    (8,  'Chima',      2040),
    (9,  'Yolotli',    2724),
    (10, 'Amarjeet',   2182);

CREATE TABLE book (
    id INTEGER PRIMARY KEY,
    brand VARCHAR NOT NULL,
    production_date DATE NOT NULL,
    chocolates INTEGER NOT NULL
);

INSERT INTO book VALUES
    (1,  'Shandiin',   '2024-01-15', 3),
    (2,  'Shandiin',   '2024-02-10', 4),
    (3,  'Hordad',     '2024-01-20', 8),
    (4,  'Hordad',     '2024-03-05', 10),
    (5,  'Hordad',     '2024-04-12', 9),
    (6,  'Harinder',   '2024-02-01', 5),
    (7,  'Harinder',   '2024-03-18', 6),
    (8,  'Tamandani',  '2024-01-10', 1),
    (9,  'Tamandani',  '2024-02-28', 2),
    (10, 'Erdene',     '2024-01-25', 7),
    (11, 'Erdene',     '2024-03-30', 9),
    (12, 'Buhle',      '2024-02-14', 3),
    (13, 'Buhle',      '2024-04-01', 4),
    (14, 'Ayanda',     '2024-01-05', 6),
    (15, 'Ayanda',     '2024-03-22', 7),
    (16, 'Chima',      '2024-02-20', 8),
    (17, 'Chima',      '2024-04-15', 9),
    (18, 'Yolotli',    '2024-01-30', 10),
    (19, 'Yolotli',    '2024-03-10', 12),
    (20, 'Amarjeet',   '2024-02-05', 9),
    (21, 'Amarjeet',   '2024-04-20', 8);

CREATE TABLE tools (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    difficulty INTEGER NOT NULL
);

INSERT INTO tools VALUES
    (1,  'hammer',      4),
    (2,  'screwdriver', 3),
    (3,  'drill',       6),
    (4,  'saw',         1),
    (5,  'axe',         4),
    (6,  'wrench',      6),
    (7,  'bolt',        4),
    (8,  'wire',        5),
    (9,  'tape',        3),
    (10, 'shovel',      1);

CREATE TABLE strength (
    id INTEGER PRIMARY KEY,
    hour INTEGER NOT NULL,
    points INTEGER NOT NULL
);

INSERT INTO strength VALUES
    (1, 1, 10),
    (2, 2, 20),
    (3, 3, 15),
    (4, 4, 37),
    (5, 5, 25),
    (6, 6, 30);
