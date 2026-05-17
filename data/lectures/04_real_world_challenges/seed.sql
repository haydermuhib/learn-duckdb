-- Seed data for Lecture 4: Real-World Challenges

CREATE TABLE cellphones (
    id INTEGER PRIMARY KEY,
    model VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    supports_5g BOOLEAN NOT NULL
);

INSERT INTO cellphones VALUES
    (1, 'motorola-edge', 1200.00, true),
    (2, 'mbox-ultra',    800.00,  true),
    (3, 'moto-x50',      1450.00, true),
    (4, 'nokia-classic',  350.00, false),
    (5, 'moona-pro',     1100.00, true),
    (6, 'mzone-lite',     999.00, true),
    (7, 'morpheus-z',    1500.00, false),
    (8, 'mobi-air',      1300.00, true),
    (9, 'samsung-s24',   1400.00, true),
    (10,'motorola-razr',  1050.00, true);

CREATE TABLE criminals (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    severe_score INTEGER NOT NULL,
    report VARCHAR,
    map VARCHAR NOT NULL
);

INSERT INTO criminals VALUES
    (1,  'Viktor Drago',    92, NULL,           'Caerleon'),
    (2,  'Mara Sindel',     88, 'clean record', 'Dewsbury'),
    (3,  'Jax Bronson',     95, 'grade-b risk', 'Kirkwall'),
    (4,  'Luna Petrov',     76, NULL,           'Findochty'),
    (5,  'Rex Hammer',      91, 'flagged-G',    'Caerleon'),
    (6,  'Nyx Shadow',      85, 'no issues',    'Kirkwall'),
    (7,  'Boris Krank',     79, NULL,           'London'),
    (8,  'Selma Vogt',      93, 'Bias noted',   'Dewsbury'),
    (9,  'Axel Storm',      87, 'cleared',      'Findochty'),
    (10, 'Petra Kova',      90, NULL,           'Kirkwall'),
    (11, 'Grim Tooth',      94, 'background',   'Caerleon'),
    (12, 'Vera Blitz',      82, 'good citizen', 'Dewsbury');

CREATE TABLE ministers (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    sit INTEGER NOT NULL,
    status VARCHAR NOT NULL,
    bad_word BOOLEAN NOT NULL
);

INSERT INTO ministers VALUES
    (1,  'Adams',    1, 'continue',    false),
    (2,  'Baker',    2, '  continue ', false),
    (3,  'Clark',    3, 'retire',      false),
    (4,  'Davis',    4, 'continue',    true),
    (5,  'Evans',    5, 'continue',    false),
    (6,  'Fisher',   6, 'continue ',   false),
    (7,  'Green',    7, ' retire',     false),
    (8,  'Harris',   8, 'continue',    false),
    (9,  'Irving',   9, 'continue',    true),
    (10, 'Jones',   10, '  continue',  false),
    (11, 'King',    11, 'continue',    false),
    (12, 'Lewis',   12, ' retire ',    false);

CREATE TABLE juices (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    exp_year INTEGER NOT NULL,
    flavor VARCHAR NOT NULL
);

INSERT INTO juices VALUES
    (1,  'Orange Burst',   2027, 'orange'),
    (2,  'Apple Fresh',    2019, 'apple'),
    (3,  'Grape Wave',     2026, 'grape'),
    (4,  'Mango Sun',      2015, 'mango'),
    (5,  'Berry Blast',    2029, 'berry'),
    (6,  'Lemon Zing',     2018, 'lemon'),
    (7,  'Peach Dream',    2030, 'peach'),
    (8,  'Kiwi Fresh',     2017, 'kiwi'),
    (9,  'Pineapple Fizz', 2027, 'pineapple'),
    (10, 'Cherry Pop',     2014, 'cherry');

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

CREATE TABLE kitchen (
    id INTEGER PRIMARY KEY,
    item VARCHAR NOT NULL,
    cutlery INTEGER NOT NULL,
    category VARCHAR NOT NULL
);

INSERT INTO kitchen VALUES
    (1, 'Fork Set',       4,  'silverware'),
    (2, 'Spoon Pair',     2,  'silverware'),
    (3, 'Knife Block',    6,  'silverware'),
    (4, 'Chopsticks',     1,  'utensil'),
    (5, 'Tongs',          2,  'utensil'),
    (6, 'Ladle',          1,  'utensil'),
    (7, 'Butter Knife',   2,  'silverware'),
    (8, 'Serving Spoon',  1,  'silverware');
