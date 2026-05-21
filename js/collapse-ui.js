/**
 * Collapsible sections (<details>) — default collapsed; optional session persistence.
 */

const STORAGE_KEY = "cert-master:collapseState";

/**
 * @param {string} group
 * @param {string[]} ids
 */
export function bindCollapseGroup(group, ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el || el.tagName !== "DETAILS") continue;
    if (el.dataset.collapseBound === "1") continue;
    el.dataset.collapseBound = "1";

    const storageKey = `${group}:${id}`;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
      el.open = typeof saved[storageKey] === "boolean" ? saved[storageKey] : false;
    } catch {
      el.open = false;
    }

    el.addEventListener("toggle", () => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
        saved[storageKey] = el.open;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        /* ignore */
      }
    });
  }
}

/**
 * Bind every <details class="page-collapse"> with an id under root.
 * @param {ParentNode} [root]
 */
export function bindAllPageCollapse(root = document) {
  const ids = [];
  root.querySelectorAll("details.page-collapse[id]").forEach((el) => {
    if (el.id) ids.push(el.id);
  });
  bindCollapseGroup("page", ids);
}

/**
 * @param {string[]} ids
 * @param {boolean} open
 */
export function setCollapseOpen(ids, open) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") el.open = open;
  }
}
