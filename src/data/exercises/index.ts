import { ExerciseDef } from "../../types/curriculum";

import { select_exercises } from "./select";
import { where_exercises } from "./where";
import { order_exercises } from "./order";
import { aggregate_exercises } from "./aggregate";
import { group_exercises } from "./group";
import { joins_exercises } from "./joins";
import { subqueries_exercises } from "./subqueries";
import { functions_exercises } from "./functions";
import { modify_exercises } from "./modify";
import { aggregate2_exercises } from "./aggregate2";
import { sets_exercises } from "./sets";
import { text2_exercises } from "./text2";
import { window_exercises } from "./window";
import { recursive_exercises } from "./recursive";
import { modify2_exercises } from "./modify2";
import { school_exercises } from "./school";
import { challenges_exercises } from "./challenges";
import { interview_exercises } from "./interview";

export const EXERCISES: ExerciseDef[] = [
  ...select_exercises,
  ...where_exercises,
  ...order_exercises,
  ...aggregate_exercises,
  ...group_exercises,
  ...joins_exercises,
  ...subqueries_exercises,
  ...functions_exercises,
  ...modify_exercises,
  ...aggregate2_exercises,
  ...sets_exercises,
  ...text2_exercises,
  ...window_exercises,
  ...recursive_exercises,
  ...modify2_exercises,
  ...school_exercises,
  ...challenges_exercises,
  ...interview_exercises
];
