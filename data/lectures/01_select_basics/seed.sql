-- Seed data for Lecture 1: SELECT Basics
-- Three tables to teach fundamental SELECT operations.

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    seniority VARCHAR NOT NULL
);

INSERT INTO users VALUES
    (652,  'senior'),
    (9731, 'junior'),
    (1462, 'junior'),
    (7823, 'senior'),
    (15243, 'senior');

CREATE TABLE workers (
    id INTEGER PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    age INTEGER NOT NULL,
    exp_years DECIMAL(4,1) NOT NULL,
    gender VARCHAR NOT NULL
);

INSERT INTO workers VALUES
    (1, 'Ghully',  'Thuas',    29, 2.3, 'Female'),
    (2, 'Bostal',  'Shkolky',  32, 0.2, 'Male'),
    (3, 'Qaostu',  'Malop',    21, 4.0, 'Female'),
    (4, 'Denton',  'Korash',   45, 12.5, 'Male'),
    (5, 'Plivna',  'Jeqort',   27, 3.1, 'Female');

CREATE TABLE objects (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    color VARCHAR,
    weight DECIMAL(6,2),
    category VARCHAR NOT NULL
);

INSERT INTO objects VALUES
    (1, 'Hammer',     'red',    1.20, 'tool'),
    (2, 'Notebook',   'blue',   0.35, 'stationery'),
    (3, 'Lamp',       'white',  2.10, 'furniture'),
    (4, 'Pencil',     'yellow', 0.05, 'stationery'),
    (5, 'Wrench',     'silver', 0.80, 'tool'),
    (6, 'Chair',      NULL,     8.50, 'furniture'),
    (7, 'Tape',       'gray',   0.15, 'tool'),
    (8, 'Eraser',     'pink',   0.03, 'stationery');
