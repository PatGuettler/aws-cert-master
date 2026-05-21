/**
 * @typedef {Object} ExamSettings
 * @property {boolean} timeLimitEnabled
 * @property {boolean} immediateFeedback
 * @property {boolean} showDocLinks
 */

/** Display name shown in the header and SEO templates. */
export const APP_NAME = "Cert Master";

/** Slug for storage keys, backups, and GitHub project-pages path (/cert-master/). */
export const APP_SLUG = "cert-master";

/** @deprecated Pre-rename prefix; migrated once on load. */
export const LEGACY_APP_SLUG = "aws-cert-master";

/** @type {ExamSettings} */
export const DEFAULT_SETTINGS = {
  timeLimitEnabled: true,
  immediateFeedback: false,
  showDocLinks: true,
};

export const SETTINGS_KEY = `${APP_SLUG}-settings`;
