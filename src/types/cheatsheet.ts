export type CheatSheetCategory =
  | 'superpowers'
  | 'strings'
  | 'dates'
  | 'window'
  | 'nested'
  | 'aggregates'
  | 'ingestion';

export interface CategoryMetadata {
  id: CheatSheetCategory;
  title: string;
  shortTitle: string;
  iconName: string;
  description: string;
  badgeCount?: number;
}

export interface FormatSpecifier {
  code: string;
  meaning: string;
  example: string;
  category: 'date' | 'time' | 'printf' | 'regex';
}

export interface DuckDBDataType {
  name: string;
  aliases?: string[];
  category: 'integer' | 'numeric' | 'temporal' | 'string' | 'nested' | 'special';
  description: string;
  exampleValue: string;
  storageSize?: string;
}

export interface CheatSheetParameter {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

export interface CheatSheetItem {
  id: string;
  name: string;
  category: CheatSheetCategory;
  signature: string;
  summary: string;
  parityBadge?: string; // e.g. "DuckDB Exclusive", "Snowflake 1:1", "Python & Arrow"
  parameters?: CheatSheetParameter[];
  formatSpecifiers?: string[]; // codes linked, e.g. ["%Y", "%m", "%d"] or ["%s", "%d", "%.2f"]
  exampleSql: string;
  exampleOutput?: string;
  notes?: string;
  tags: string[];
}
