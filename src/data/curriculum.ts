import { DATABASES } from "./databases";
import { MODULES } from "./modules";
import { EXERCISES } from "./exercises";

export { DATABASES, MODULES, EXERCISES };

export function getExercisesForModule(moduleId: string) {
  return EXERCISES.filter(e => e.module === moduleId);
}

export function getExerciseById(exerciseId: string) {
  return EXERCISES.find(e => e.id === exerciseId);
}

export function getDatabaseById(dbId: string) {
  return DATABASES[dbId] || DATABASES.store;
}
