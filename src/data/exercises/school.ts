import { ExerciseDef } from "../../types/curriculum";

export const school_exercises: ExerciseDef[] = [
  {
    "id": "school-filter",
    "module": "school",
    "db": "school",
    "title": "Meet the school",
    "concept": "A new database to review everything so far: students, subjects and grades (0 to 10; 6 passes). The scholarship column holds the scholarship percentage and is NULL when a student has none.",
    "steps": [
      {
        "task": "Show the name and scholarship of the students in section 1A who have a scholarship.",
        "solution": "SELECT name, scholarship FROM students WHERE class_group = '1A' AND scholarship IS NOT NULL",
        "hints": [
          "WHERE section = '1A' AND scholarship IS NOT NULL"
        ],
        "requires": [
          "AND"
        ]
      }
    ]
  },
  {
    "id": "school-age",
    "module": "school",
    "db": "school",
    "title": "Each student’s age",
    "concept": "Subtracting two julianday values gives days. Divided by 365.25 that gives years with decimals, and CAST(… AS INTEGER) drops the decimals: the age in full years.",
    "steps": [
      {
        "task": "Show each student’s name and their age in full years on January 1, 2026. Name the column age.",
        "solution": "SELECT name, CAST((julianday('2026-01-01') - julianday(birth_date)) / 365.25 AS INTEGER) AS edad FROM students",
        "hints": [
          "julianday('2026-01-01') - julianday(birth_date) gives the days lived.",
          "Divide by 365.25 and convert with CAST(… AS INTEGER)."
        ],
        "requires": [
          "CAST"
        ]
      }
    ]
  },
  {
    "id": "school-average",
    "module": "school",
    "db": "school",
    "title": "Each student’s average",
    "concept": "To average per student, join students to grades and group by student. Group by id as well as name: two students could share a name.",
    "steps": [
      {
        "task": "Show each student’s name and their average rounded to 2 decimals (named avg_score), from best to worst.",
        "solution": "SELECT a.name, ROUND(AVG(c.score), 2) AS avg_score FROM students a JOIN grades c ON c.student_id = a.id GROUP BY a.id, a.name ORDER BY avg_score DESC",
        "hints": [
          "students JOIN grades ON g.student_id = s.id, grouping by student.",
          "ROUND(AVG(g.grade), 2) AS avg_score … ORDER BY avg_score DESC"
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "school-failed",
    "module": "school",
    "db": "school",
    "title": "Failed subjects",
    "concept": "When two tables share a column name (students.name and subjects.name), alias one of them in the SELECT so the result does not have two identical columns.",
    "steps": [
      {
        "task": "Show the student’s name, the subject (as subject) and the grade of every failed subject (below 6).",
        "solution": "SELECT a.name, m.name AS subject, c.score FROM grades c JOIN students a ON a.id = c.student_id JOIN subjects m ON m.id = c.subject_id WHERE c.score < 6",
        "hints": [
          "Join grades to students and to subjects.",
          "m.name AS subject … WHERE c.score < 6"
        ],
        "requires": [
          "JOIN"
        ]
      }
    ]
  },
  {
    "id": "school-no-grades",
    "module": "school",
    "db": "school",
    "title": "Students without grades",
    "concept": "LEFT JOIN review: it keeps every student even without grades, and those without a match get NULL in the right-hand columns.",
    "steps": [
      {
        "task": "Show the name and section of the students who have no grades yet. Use LEFT JOIN.",
        "solution": "SELECT a.name, a.class_group FROM students a LEFT JOIN grades c ON c.student_id = a.id WHERE c.student_id IS NULL",
        "hints": [
          "LEFT JOIN grades … WHERE g.student_id IS NULL"
        ],
        "requires": [
          "LEFT JOIN"
        ]
      }
    ]
  },
  {
    "id": "school-subjects",
    "module": "school",
    "db": "school",
    "title": "Summary by subject",
    "concept": "A typical report: for each subject, how many students take it and their average. It is a JOIN with GROUP BY and two aggregates.",
    "steps": [
      {
        "task": "For each subject show its name, how many students have a grade in it and the average rounded to 2 decimals (as avg_score), from the best average to the worst.",
        "solution": "SELECT m.name, COUNT(*) AS students, ROUND(AVG(c.score), 2) AS avg_score FROM subjects m JOIN grades c ON c.subject_id = m.id GROUP BY m.id, m.name ORDER BY avg_score DESC",
        "hints": [
          "subjects JOIN grades, GROUP BY sub.id, sub.name, with COUNT(*) and AVG."
        ],
        "requires": []
      }
    ]
  },
  {
    "id": "school-pass-rate",
    "module": "school",
    "db": "school",
    "title": "Pass rate",
    "concept": "SUM(CASE WHEN … THEN 1 ELSE 0 END) counts those that qualify; divided by COUNT(*) it gives the share. Multiply by 100.0 (with a decimal) to avoid integer division.",
    "steps": [
      {
        "task": "For each subject, show its name and the percentage of passing grades (6 or more), rounded to 1 decimal.",
        "solution": "SELECT m.name, ROUND(100.0 * SUM(CASE WHEN c.score >= 6 THEN 1 ELSE 0 END) / COUNT(*), 1) AS porcentaje FROM subjects m JOIN grades c ON c.subject_id = m.id GROUP BY m.id, m.name",
        "hints": [
          "100.0 * SUM(CASE WHEN g.grade >= 6 THEN 1 ELSE 0 END) / COUNT(*)"
        ],
        "requires": [
          "CASE"
        ]
      }
    ]
  },
  {
    "id": "school-weighted",
    "module": "school",
    "db": "school",
    "title": "Credit-weighted average",
    "concept": "In a weighted average each grade counts by its weight: add up grade times credits and divide by the sum of credits. An 8-credit subject weighs twice as much as a 4-credit one.",
    "steps": [
      {
        "task": "Show the name of each student with grades and their credit-weighted average, rounded to 2 decimals.",
        "solution": "SELECT a.name, ROUND(SUM(c.score * m.credits) / SUM(m.credits), 2) AS promedio_ponderado FROM students a JOIN grades c ON c.student_id = a.id JOIN subjects m ON m.id = c.subject_id GROUP BY a.id, a.name",
        "hints": [
          "You need all three tables: students, grades and subjects.",
          "SUM(g.grade * sub.credits) / SUM(sub.credits)"
        ],
        "requires": [
          "SUM"
        ]
      }
    ]
  },
  {
    "id": "school-teachers",
    "module": "school",
    "db": "school",
    "title": "Each teacher’s load",
    "concept": "COUNT(DISTINCT …) avoids double counting: a student who takes two subjects with the same teacher counts as one student for that teacher.",
    "steps": [
      {
        "task": "For each teacher, show how many subjects they teach and how many different students they grade.",
        "solution": "SELECT m.teacher, COUNT(DISTINCT m.id) AS subjects, COUNT(DISTINCT c.student_id) AS students FROM subjects m LEFT JOIN grades c ON c.subject_id = m.id GROUP BY m.teacher",
        "hints": [
          "Group by sub.teacher and use COUNT(DISTINCT sub.id) and COUNT(DISTINCT g.student_id)."
        ],
        "requires": [
          "COUNT(DISTINCT"
        ]
      }
    ]
  },
  {
    "id": "school-best-in-group",
    "module": "school",
    "db": "school",
    "title": "The best average in each section",
    "concept": "Final challenge: combine a WITH for the averages, RANK with PARTITION BY to order them within each section, and a filter to keep first place.",
    "steps": [
      {
        "task": "For each section, show the section, the name of the student with the best average and that average rounded to 2 decimals (as avg_score).",
        "solution": "WITH p AS (SELECT a.class_group, a.name, AVG(c.score) AS avg_score FROM students a JOIN grades c ON c.student_id = a.id GROUP BY a.id, a.class_group, a.name), r AS (SELECT class_group, name, avg_score, RANK() OVER (PARTITION BY class_group ORDER BY avg_score DESC) AS rank_num FROM p) SELECT class_group, name, ROUND(avg_score, 2) AS avg_score FROM r WHERE rank_num = 1",
        "hints": [
          "First WITH: average per student, keeping their section.",
          "Second WITH: RANK() OVER (PARTITION BY section ORDER BY average DESC); outside, WHERE place = 1."
        ],
        "requires": [
          "OVER",
          "PARTITION BY"
        ]
      }
    ]
  }
];
