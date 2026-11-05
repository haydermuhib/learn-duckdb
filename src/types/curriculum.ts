export interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
}

export interface TableDef {
  name: string;
  columns: [string, string][]; // [columnName, columnType]
  rows: any[][];
}

export interface DatabaseDef {
  id: string;
  title: string;
  description: string;
  tables: TableDef[];
}

export interface ExerciseStep {
  task: string;
  solution: string;
  hints: string[];
  requires?: string[];
  check?: string;
}

export interface ExerciseDef {
  id: string;
  module: string;
  db: 'store' | 'company' | 'school';
  title: string;
  concept: string;
  example?: string;
  steps: ExerciseStep[];
  isDuckDbFeature?: boolean;
}

export interface ModuleDef {
  id: string;
  title: string;
  description?: string;
  order: number;
}
