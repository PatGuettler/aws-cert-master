/**
 * Apply plausible distractor overrides and length balancing to workshop quizzes.
 */

import { balanceWorkshopOptions } from "./workshop-quiz-options.js";
import { getWorkshopQuizOverride } from "./workshop-quiz-overrides.js";

/**
 * @param {object} q
 * @param {string} workshopId
 * @param {string} key
 */
export function prepareWorkshopQuiz(q, workshopId, key) {
  const override = getWorkshopQuizOverride(workshopId, key);
  const merged = {
    ...q,
    options: override?.options ?? q.options,
    correct: override?.correct ?? q.correct,
  };
  return {
    ...merged,
    options: balanceWorkshopOptions(merged.options, merged.correct),
  };
}
