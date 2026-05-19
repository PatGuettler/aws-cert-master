/**
 * @typedef {Object} ExamSettings
 * @property {boolean} timeLimitEnabled
 * @property {boolean} immediateFeedback
 * @property {boolean} showDocLinks
 */

/** @type {ExamSettings} */
export const DEFAULT_SETTINGS = {
  timeLimitEnabled: true,
  immediateFeedback: false,
  showDocLinks: true,
};

export const SETTINGS_KEY = "aws-cert-master-settings";
