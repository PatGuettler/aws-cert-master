import { DEFAULT_SETTINGS, SETTINGS_KEY } from "./config.js";

/**
 * @param {string} certId
 * @returns {string}
 */
export function certSettingsKey(certId) {
  return `${SETTINGS_KEY}:${certId}`;
}

/**
 * @param {string} certId
 * @returns {import('./config.js').ExamSettings}
 */
export function loadSettings(certId) {
  try {
    const raw = localStorage.getItem(certSettingsKey(certId));
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * @param {string} certId
 * @param {import('./config.js').ExamSettings} settings
 */
export function saveSettings(certId, settings) {
  localStorage.setItem(certSettingsKey(certId), JSON.stringify(settings));
}
