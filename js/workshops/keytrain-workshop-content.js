/**
 * KeyTrain workshop registry — Easy, Medium, and Hard per category.
 */
import { EASY_WORKSHOPS } from "./keytrain-workshops-easy.js";
import { MEDIUM_WORKSHOPS } from "./keytrain-workshops-medium.js";
import { HARD_WORKSHOPS } from "./keytrain-workshops-hard.js";
import {
  KEYTRAIN_CATEGORY_IDS,
  TRAINING_LEVELS,
  LEVEL_LABELS,
} from "./keytrain-catalog.js";

/** @typedef {import('../workshop-runner.js').KeytrainWorkshop} KeytrainWorkshop */
/** @typedef {'easy'|'medium'|'hard'} TrainingLevel */

/** @deprecated Use KEYTRAIN_CATEGORY_IDS from keytrain-catalog.js */
export const KEYTRAIN_WORKSHOP_IDS = KEYTRAIN_CATEGORY_IDS;

/**
 * @param {string} categoryId
 * @param {TrainingLevel} [level]
 * @returns {KeytrainWorkshop|null}
 */
export function getKeytrainWorkshop(categoryId, level = "medium") {
  const lv = TRAINING_LEVELS.includes(/** @type {TrainingLevel} */ (level))
    ? /** @type {TrainingLevel} */ (level)
    : "medium";
  if (lv === "easy") return EASY_WORKSHOPS[categoryId] ?? null;
  if (lv === "hard") return HARD_WORKSHOPS[categoryId] ?? null;
  return MEDIUM_WORKSHOPS[categoryId] ?? null;
}

/** @returns {KeytrainWorkshop[]} */
export function listKeytrainWorkshops() {
  return KEYTRAIN_CATEGORY_IDS.flatMap((categoryId) =>
    TRAINING_LEVELS.map((level) => getKeytrainWorkshop(categoryId, level)).filter(Boolean)
  ).sort((a, b) => {
    const t = a.title.localeCompare(b.title);
    if (t !== 0) return t;
    const order = { easy: 0, medium: 1, hard: 2 };
    return (order[a.level] ?? 9) - (order[b.level] ?? 9);
  });
}

/**
 * @param {string} level
 * @returns {string}
 */
export function getLevelLabel(level) {
  return LEVEL_LABELS[level] ?? level;
}

/**
 * @param {string} [level]
 * @returns {boolean}
 */
export function isValidTrainingLevel(level) {
  return TRAINING_LEVELS.includes(/** @type {TrainingLevel} */ (level));
}
