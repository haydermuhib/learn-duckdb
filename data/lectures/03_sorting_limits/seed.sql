-- Seed data for Lecture 3: Sorting, Limits & NULLs

CREATE TABLE competition (
    runner_id INTEGER PRIMARY KEY,
    age INTEGER NOT NULL,
    avg_speed DECIMAL(4,2) NOT NULL
);

INSERT INTO competition VALUES
    (1, 47, 3.65),
    (2, 62, 3.07),
    (3, 57, 6.82),
    (4, 56, 4.34),
    (5, 25, 4.93),
    (6, 40, 3.94),
    (7, 23, 6.58),
    (8, 40, 3.43);

CREATE TABLE temperature (
    id INTEGER PRIMARY KEY,
    city VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    temp DECIMAL(5,1) NOT NULL
);

INSERT INTO temperature VALUES
    (1,  'Oymyakon',    'Russia',    -50.0),
    (2,  'Yakutsk',     'Russia',    -40.0),
    (3,  'Barrow',      'USA',       -25.5),
    (4,  'Yellowknife', 'Canada',    -22.3),
    (5,  'Ulaanbaatar', 'Mongolia',  -18.7),
    (6,  'Helsinki',    'Finland',   -5.2),
    (7,  'Oslo',        'Norway',    -3.1),
    (8,  'London',      'UK',         8.4),
    (9,  'Dubai',       'UAE',        35.2),
    (10, 'Bangkok',     'Thailand',   32.8);

CREATE TABLE inventory (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    color VARCHAR,
    quantity INTEGER
);

INSERT INTO inventory VALUES
    (1, 'Wrench',     'silver',  12),
    (2, 'Bolt',       NULL,      200),
    (3, NULL,         'red',     5),
    (4, 'Hammer',     'red',     8),
    (5, 'Tape',       'gray',    30),
    (6, 'Drill',      NULL,      3),
    (7, NULL,         'blue',    0),
    (8, 'Wrench',     'chrome',  7),
    (9, 'Screwdriver','green',   15),
    (10,'Nail',       NULL,      500);

CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    weight DECIMAL(6,2) NOT NULL
);

INSERT INTO items VALUES
    (1, 'Brick',    2.50),
    (2, 'Feather',  0.01),
    (3, 'Book',     0.85),
    (4, 'Laptop',   2.10),
    (5, 'Phone',    0.19),
    (6, 'Anvil',    15.00),
    (7, 'Pen',      0.02),
    (8, 'Backpack', 4.30),
    (9, 'Helmet',   1.20),
    (10,'Toolbox',  8.70);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    married BOOLEAN NOT NULL,
    department VARCHAR NOT NULL
);

INSERT INTO employees VALUES
    (1,  'Alice',   45000, true,  'Engineering'),
    (2,  'Bob',     38000, true,  'Sales'),
    (3,  'Carol',   52000, false, 'Engineering'),
    (4,  'David',   35000, true,  'Support'),
    (5,  'Emma',    41000, false, 'Marketing'),
    (6,  'Frank',   33000, true,  'Support'),
    (7,  'Grace',   47000, true,  'Engineering'),
    (8,  'Hank',    36000, false, 'Sales'),
    (9,  'Iris',    29000, true,  'Support'),
    (10, 'Jake',    50000, true,  'Engineering');
