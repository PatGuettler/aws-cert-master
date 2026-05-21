import {
  exportAllData,
  importData,
  clearHistory,
  clearWeakQuestions,
  clearBookmarks,
  clearResumeState,
  clearEverything,
} from "./storage.js";

/**
 * @param {Object} opts
 * @param {() => string} opts.getScopeCertId
 * @param {() => string} opts.getActiveCertId
 * @param {() => string[]} opts.getCertIds
 * @param {() => void} opts.onDataChange
 */
export function initDataPanel({
  getScopeCertId,
  getActiveCertId,
  getCertIds,
  onDataChange,
}) {
  const exportBtn = document.getElementById("btn-export-data");
  const importInput = document.getElementById("import-data-file");
  const clearHistoryBtn = document.getElementById("btn-clear-history");
  const clearWeakBtn = document.getElementById("btn-clear-weak");
  const clearBookmarksBtn = document.getElementById("btn-clear-bookmarks");
  const clearResumeBtn = document.getElementById("btn-clear-resume");
  const clearAllBtn = document.getElementById("btn-clear-all");

  function scopeLabel() {
    const id = getScopeCertId();
    return id || "this certification";
  }

  exportBtn?.addEventListener("click", () => {
    const blob = exportAllData(getCertIds());
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `cert-master-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  importInput?.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = importData(json, getCertIds());
      window.alert(result.message);
      if (result.ok) onDataChange();
    } catch {
      window.alert("Could not read backup file.");
    }
    importInput.value = "";
  });

  clearHistoryBtn?.addEventListener("click", () => {
    const id = getScopeCertId();
    if (!id) return;
    if (
      !window.confirm(
        `Clear all exam history for ${scopeLabel()}?`
      )
    ) {
      return;
    }
    clearHistory(id);
    onDataChange();
  });

  clearWeakBtn?.addEventListener("click", () => {
    const id = getScopeCertId();
    if (!id) return;
    if (
      !window.confirm(
        `Clear weak-question stats for ${scopeLabel()}?`
      )
    ) {
      return;
    }
    clearWeakQuestions(id);
    onDataChange();
  });

  clearBookmarksBtn?.addEventListener("click", () => {
    const id = getScopeCertId();
    if (!id) return;
    if (
      !window.confirm(
        `Clear all bookmarked questions for ${scopeLabel()}?`
      )
    ) {
      return;
    }
    clearBookmarks(id);
    onDataChange();
  });

  clearResumeBtn?.addEventListener("click", () => {
    const id = getScopeCertId();
    if (!id) return;
    clearResumeState(id);
    window.alert("Saved in-progress exam cleared.");
  });

  clearAllBtn?.addEventListener("click", () => {
    if (
      !window.confirm(
        "This will permanently delete ALL your scores, history, bookmarks, weak-question stats, and settings for every exam in this browser. This cannot be undone. Are you sure?"
      )
    ) {
      return;
    }
    clearEverything();
    onDataChange();
    window.location.reload();
  });
}
