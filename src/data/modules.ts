import { ModuleDef } from "../types/curriculum";

export const MODULES: ModuleDef[] = [
  { id: "select", title: "Basic SELECT", order: 1, description: "Your first queries, picking columns, aliases, calculations, and DISTINCT." },
  { id: "where", title: "Filtering with WHERE", order: 2, description: "Filter data with comparison operators, text patterns, and logical gates." },
  { id: "order", title: "Sorting and Limiting", order: 3, description: "Order results ascending/descending, paginate with LIMIT and OFFSET." },
  { id: "aggregate", title: "Aggregate Functions", order: 4, description: "Summarize data with COUNT, SUM, AVG, MIN, and MAX." },
  { id: "group", title: "Grouping with GROUP BY", order: 5, description: "Group rows, compute metrics per group, and filter groups with HAVING." },
  { id: "joins", title: "Joining Tables (JOIN)", order: 6, description: "Connect tables using INNER JOIN, LEFT JOIN, and multi-table queries." },
  { id: "subqueries", title: "Subqueries and CTEs", order: 7, description: "Nested queries, scalar subqueries, and WITH Common Table Expressions." },
  { id: "functions", title: "Text, Dates and CASE", order: 8, description: "String transformations, date math, COALESCE, and conditional CASE WHEN." },
  { id: "modify", title: "Changing Data (DML)", order: 9, description: "Insert new records, update existing rows, and remove records safely." },
  { id: "aggregate2", title: "Advanced Aggregation", order: 10, description: "Conditional counts, percentiles, ratios, and distinct aggregations." },
  { id: "sets", title: "JOIN Pitfalls, EXISTS & UNION", order: 11, description: "Set operations with UNION, UNION ALL, and semi-joins with EXISTS." },
  { id: "text2", title: "More Text and Dates", order: 12, description: "Complex string parsing, date differences, and interval calculations." },
  { id: "window", title: "Window Functions", order: 13, description: "OVER, PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, and LEAD." },
  { id: "recursive", title: "Recursive Queries", order: 14, description: "WITH RECURSIVE hierarchies, tree traversals, and number series." },
  { id: "modify2", title: "Changing Data: Level 2", order: 15, description: "CREATE TABLE, ON CONFLICT upsert, CREATE VIEW, and indexing." },
  { id: "school", title: "Case Study: School", order: 16, description: "Solve realistic academic analytics on students, subjects, and grades." },
  { id: "challenges", title: "Practical Challenges", order: 17, description: "End-to-end analytical problems combining multiple SQL concepts." },
  { id: "interview", title: "Interview Challenges", order: 18, description: "Classic data engineering and analytics interview problems." }
];
