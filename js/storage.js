import {
  APP_SLUG,
  DEFAULT_SETTINGS,
  LEGACY_APP_SLUG,
  SETTINGS_KEY,
} from "./config.js";

export const HISTORY_KEY = `${APP_SLUG}:history`;
export const WEAK_KEY = `${APP_SLUG}:weakQuestions`;
export const BOOKMARKS_KEY = `${APP_SLUG}:bookmarks`;
export const RESUME_KEY = `${APP_SLUG}:resumeState`;
export const NOTICE_DISMISSED_KEY = `${APP_SLUG}:noticeDismissed`;

/** One-time copy from pre-rename localStorage / sessionStorage keys. */
function migrateLegacyStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const legacyKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith(`${LEGACY_APP_SLUG}:`) ||
          key === `${LEGACY_APP_SLUG}-settings`)
      ) {
        legacyKeys.push(key);
      }
    }
    for (const oldKey of legacyKeys) {
      const newKey = oldKey.startsWith(`${LEGACY_APP_SLUG}:`)
        ? `${APP_SLUG}:${oldKey.slice(LEGACY_APP_SLUG.length + 1)}`
        : SETTINGS_KEY;
      if (localStorage.getItem(newKey) == null) {
        localStorage.setItem(newKey, localStorage.getItem(oldKey));
      }
    }
    if (typeof sessionStorage !== "undefined") {
      const auto = sessionStorage.getItem(`${LEGACY_APP_SLUG}:autoStart`);
      if (auto && !sessionStorage.getItem(`${APP_SLUG}:autoStart`)) {
        sessionStorage.setItem(`${APP_SLUG}:autoStart`, auto);
      }
      const lastCert = localStorage.getItem(`${LEGACY_APP_SLUG}:lastCert`);
      if (lastCert && !localStorage.getItem(`${APP_SLUG}:lastCert`)) {
        localStorage.setItem(`${APP_SLUG}:lastCert`, lastCert);
      }
    }
  } catch {
    /* private mode / blocked storage */
  }
}

migrateLegacyStorage();

const EXPORT_VERSION = 1;
const RESUME_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * @param {string} key
 * @returns {unknown}
 */
function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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

/** @returns {Record<string, unknown[]>} */
function allHistoryStore() {
  const data = readJson(HISTORY_KEY, {});
  return typeof data === "object" && data !== null ? data : {};
}

/**
 * @param {string} certId
 * @returns {object[]}
 */
export function getHistory(certId) {
  const list = allHistoryStore()[certId];
  if (!Array.isArray(list)) return [];
  return [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * @param {string} certId
 * @param {object} result
 */
export function appendHistory(certId, result) {
  const store = allHistoryStore();
  const list = Array.isArray(store[certId]) ? store[certId] : [];
  list.push({ ...result, type: result.type ?? "exam" });
  store[certId] = list;
  writeJson(HISTORY_KEY, store);
}

/**
 * @param {string} certId
 * @param {string} dateIso
 */
export function removeHistoryEntry(certId, dateIso) {
  const store = allHistoryStore();
  if (!Array.isArray(store[certId])) return;
  store[certId] = store[certId].filter((e) => e.date !== dateIso);
  writeJson(HISTORY_KEY, store);
}

/**
 * @param {string} certId
 */
export function clearHistory(certId) {
  const store = allHistoryStore();
  delete store[certId];
  writeJson(HISTORY_KEY, store);
}

export function clearAllHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

/** @returns {Record<string, Record<string, { attempts: number, correct: number }>>} */
function allWeakStore() {
  const data = readJson(WEAK_KEY, {});
  return typeof data === "object" && data !== null ? data : {};
}

/**
 * @param {string} certId
 * @returns {Record<string, { attempts: number, correct: number }>}
 */
export function getWeakQuestions(certId) {
  const map = allWeakStore()[certId];
  return typeof map === "object" && map !== null ? { ...map } : {};
}

/**
 * @param {string} certId
 * @param {string[]} missedIds
 * @param {string[]} attemptedIds
 */
export function updateWeakQuestions(certId, missedIds, attemptedIds) {
  const store = allWeakStore();
  const map = { ...(store[certId] ?? {}) };
  const missedSet = new Set(missedIds);

  for (const id of attemptedIds) {
    const prev = map[id] ?? { attempts: 0, correct: 0 };
    map[id] = {
      attempts: prev.attempts + 1,
      correct: prev.correct + (missedSet.has(id) ? 0 : 1),
    };
  }

  store[certId] = map;
  writeJson(WEAK_KEY, store);
}

/**
 * @param {string} certId
 */
export function clearWeakQuestions(certId) {
  const store = allWeakStore();
  delete store[certId];
  writeJson(WEAK_KEY, store);
}

export function clearAllWeakQuestions() {
  localStorage.removeItem(WEAK_KEY);
}

/** @returns {Record<string, string[]>} */
function allBookmarksStore() {
  const data = readJson(BOOKMARKS_KEY, {});
  return typeof data === "object" && data !== null ? data : {};
}

/**
 * @param {string} certId
 * @returns {Set<string>}
 */
export function getBookmarks(certId) {
  const list = allBookmarksStore()[certId];
  return new Set(Array.isArray(list) ? list : []);
}

/**
 * @param {string} certId
 * @param {string} questionId
 * @returns {boolean} new bookmarked state
 */
export function toggleBookmark(certId, questionId) {
  const store = allBookmarksStore();
  const list = new Set(Array.isArray(store[certId]) ? store[certId] : []);
  if (list.has(questionId)) list.delete(questionId);
  else list.add(questionId);
  store[certId] = [...list];
  writeJson(BOOKMARKS_KEY, store);
  return list.has(questionId);
}

/**
 * @param {string} certId
 */
export function clearBookmarks(certId) {
  const store = allBookmarksStore();
  delete store[certId];
  writeJson(BOOKMARKS_KEY, store);
}

export function clearAllBookmarks() {
  localStorage.removeItem(BOOKMARKS_KEY);
}

/** @returns {Record<string, object>} */
function allResumeStore() {
  const data = readJson(RESUME_KEY, {});
  return typeof data === "object" && data !== null ? data : {};
}

export function purgeStaleResumeStates() {
  const store = allResumeStore();
  const now = Date.now();
  let changed = false;
  for (const [certId, state] of Object.entries(store)) {
    const saved = state?.savedAt ? new Date(state.savedAt).getTime() : 0;
    if (!saved || now - saved > RESUME_MAX_AGE_MS) {
      delete store[certId];
      changed = true;
    }
  }
  if (changed) writeJson(RESUME_KEY, store);
}

/**
 * @param {string} certId
 * @param {object} state
 */
export function saveResumeState(certId, state) {
  const store = allResumeStore();
  store[certId] = { ...state, savedAt: state.savedAt ?? new Date().toISOString() };
  writeJson(RESUME_KEY, store);
}

/**
 * @param {string} certId
 * @returns {object|null}
 */
export function getResumeState(certId) {
  purgeStaleResumeStates();
  const state = allResumeStore()[certId];
  if (!state?.savedAt) return null;
  const age = Date.now() - new Date(state.savedAt).getTime();
  if (age > RESUME_MAX_AGE_MS) {
    clearResumeState(certId);
    return null;
  }
  return state;
}

/**
 * @param {string} certId
 */
export function clearResumeState(certId) {
  const store = allResumeStore();
  delete store[certId];
  writeJson(RESUME_KEY, store);
}

export function clearAllResumeStates() {
  localStorage.removeItem(RESUME_KEY);
}

export function isNoticeDismissed() {
  return localStorage.getItem(NOTICE_DISMISSED_KEY) === "1";
}

export function dismissNotice() {
  localStorage.setItem(NOTICE_DISMISSED_KEY, "1");
}

/**
 * Collect per-cert settings from localStorage.
 * @param {string[]} certIds
 */
function collectSettings(certIds) {
  /** @type {Record<string, import('./config.js').ExamSettings>} */
  const out = {};
  for (const id of certIds) {
    out[id] = loadSettings(id);
  }
  return out;
}

/**
 * @param {string[]} certIds
 */
export function exportAllData(certIds = []) {
  const history = allHistoryStore();
  const weakQuestions = allWeakStore();
  const bookmarks = allBookmarksStore();
  const ids =
    certIds.length > 0
      ? certIds
      : [...new Set([...Object.keys(history), ...Object.keys(weakQuestions)])];

  return {
    exportVersion: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: APP_SLUG,
    data: {
      history,
      weakQuestions,
      bookmarks,
      settings: collectSettings(ids),
    },
  };
}

/**
 * @param {unknown} json
 * @param {string[]} knownCertIds
 * @returns {{ ok: boolean, message: string }}
 */
export function importData(json, knownCertIds = []) {
  if (!json || typeof json !== "object") {
    return { ok: false, message: "Invalid backup file." };
  }
  const root = /** @type {{ exportVersion?: number, data?: object }} */ (json);
  if (root.exportVersion !== EXPORT_VERSION || !root.data) {
    return { ok: false, message: "Unsupported or missing export version." };
  }
  const data = /** @type {Record<string, unknown>} */ (root.data);

  if (data.history) {
    const existing = allHistoryStore();
    const incoming = /** @type {Record<string, object[]>} */ (data.history);
    for (const [certId, entries] of Object.entries(incoming)) {
      if (!Array.isArray(entries)) continue;
      const merged = [...(existing[certId] ?? []), ...entries];
      const byDate = new Map();
      for (const e of merged) {
        if (e?.date) byDate.set(e.date, e);
      }
      existing[certId] = [...byDate.values()].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    writeJson(HISTORY_KEY, existing);
  }

  if (data.weakQuestions) {
    const existing = allWeakStore();
    const incoming = /** @type {Record<string, Record<string, { attempts: number, correct: number }>>} */ (
      data.weakQuestions
    );
    for (const [certId, map] of Object.entries(incoming)) {
      if (typeof map !== "object") continue;
      const prev = existing[certId] ?? {};
      for (const [qid, stats] of Object.entries(map)) {
        const p = prev[qid] ?? { attempts: 0, correct: 0 };
        prev[qid] = {
          attempts: p.attempts + (stats.attempts ?? 0),
          correct: p.correct + (stats.correct ?? 0),
        };
      }
      existing[certId] = prev;
    }
    writeJson(WEAK_KEY, existing);
  }

  if (data.bookmarks) {
    const existing = allBookmarksStore();
    const incoming = /** @type {Record<string, string[]>} */ (data.bookmarks);
    for (const [certId, list] of Object.entries(incoming)) {
      if (!Array.isArray(list)) continue;
      existing[certId] = [...new Set([...(existing[certId] ?? []), ...list])];
    }
    writeJson(BOOKMARKS_KEY, existing);
  }

  if (data.settings) {
    const incoming = /** @type {Record<string, import('./config.js').ExamSettings>} */ (
      data.settings
    );
    for (const [certId, s] of Object.entries(incoming)) {
      if (knownCertIds.length && !knownCertIds.includes(certId)) continue;
      saveSettings(certId, { ...DEFAULT_SETTINGS, ...s });
    }
  }

  return { ok: true, message: "Backup imported successfully." };
}

export function clearEverything() {
  clearAllHistory();
  clearAllWeakQuestions();
  clearAllBookmarks();
  clearAllResumeStates();
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(`${SETTINGS_KEY}:`)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
