-- Seed data for Lecture 2: Filtering & Conditions

CREATE TABLE sales (
    id INTEGER PRIMARY KEY,
    coin VARCHAR NOT NULL,
    amount DECIMAL(10,2) NOT NULL
);

INSERT INTO sales VALUES
    (1, 'AGK', 13.00),
    (2, 'GOL', 21.00),
    (3, 'KLA', 15.00),
    (4, 'AGK', 18.00),
    (5, 'GOL', 7.50),
    (6, 'BTC', 42.00),
    (7, 'AGK', 9.25);

CREATE TABLE people (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR NOT NULL,
    employed BOOLEAN NOT NULL
);

INSERT INTO people VALUES
    (1, 'Joas',   13, 'male',   true),
    (2, 'Holwa',  17, 'male',   false),
    (3, 'Nohlas', 24, 'female', true),
    (4, 'Polar',  23, 'male',   true),
    (5, 'Loopa',  18, 'female', true),
    (6, 'Mekra',  22, 'male',   false),
    (7, 'Tinda',  26, 'female', false),
    (8, 'Jorik',  20, 'male',   true),
    (9, 'Dalla',  28, 'female', true);

CREATE TABLE objects (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    color VARCHAR,
    weight DECIMAL(6,2),
    category VARCHAR NOT NULL,
    colorful BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO objects VALUES
    (1, 'Hammer',     'red',    1.20, 'tool',       true),
    (2, 'Notebook',   'blue',   0.35, 'stationery', true),
    (3, 'Lamp',       'white',  2.10, 'furniture',  false),
    (4, 'Pencil',     'yellow', 0.05, 'stationery', true),
    (5, 'Wrench',     'silver', 0.80, 'tool',       false),
    (6, 'Chair',      NULL,     8.50, 'furniture',  false),
    (7, 'Tape',       'gray',   0.15, 'tool',       false),
    (8, 'Eraser',     'pink',   0.03, 'stationery', true);

CREATE TABLE countries (
    id INTEGER PRIMARY KEY,
    country VARCHAR NOT NULL,
    population_m DECIMAL(8,2) NOT NULL,
    continent VARCHAR NOT NULL
);

INSERT INTO countries VALUES
    (1,  'Poland',     37.97, 'Europe'),
    (2,  'Oman',       5.11,  'Asia'),
    (3,  'Nicaragua',  6.85,  'North America'),
    (4,  'Brazil',     215.3, 'South America'),
    (5,  'Bhutan',     0.78,  'Asia'),
    (6,  'Senegal',    17.2,  'Africa'),
    (7,  'Belarus',    9.40,  'Europe'),
    (8,  'Japan',      125.7, 'Asia'),
    (9,  'Mexico',     128.9, 'North America'),
    (10, 'Kenya',      54.0,  'Africa');

CREATE TABLE numbers (
    id INTEGER PRIMARY KEY,
    value INTEGER NOT NULL
);

INSERT INTO numbers VALUES
    (1, 2), (2, 4), (3, 5), (4, 7), (5, 8),
    (6, 10), (7, 12), (8, 15), (9, 3), (10, 6);

CREATE TABLE names (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL
);

INSERT INTO names VALUES
    (1, 'kara'),
    (2, 'kevin'),
    (3, 'kafka'),
    (4, 'kosta'),
    (5, 'kiara'),
    (6, 'kamila'),
    (7, 'boris'),
    (8, 'anna'),
    (9, 'katya');
