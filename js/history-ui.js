import { getHistory, removeHistoryEntry } from "./storage.js";

const DISPLAY_LIMIT = 10;

/**
 * @param {string} dateIso
 */
function formatDate(dateIso) {
  try {
    return new Date(dateIso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateIso;
  }
}

/**
 * @param {object[]} domainBreakdown
 */
function formatWeakDomains(domainBreakdown) {
  if (!Array.isArray(domainBreakdown)) return "—";
  const weak = domainBreakdown.filter((d) => d.weak || d.percent < 70);
  if (weak.length === 0) return "All domains ≥70%";
  return weak
    .map((d) => {
      const short = d.name.replace(/^Domain \d+: /, "").slice(0, 18);
      return `${short} ${d.percent}%`;
    })
    .join(", ");
}

/**
 * @param {string} certId
 * @param {import('./cert-loader.js').CertData} cert
 * @param {{ onHistoryChange?: () => void }} [opts]
 */
export function renderHistoryPanel(certId, cert, opts = {}) {
  const panel = document.getElementById("history-panel");
  const body = document.getElementById("history-panel-body");
  const toggle = document.getElementById("history-panel-toggle");
  if (!panel || !body) return;

  const history = getHistory(certId).filter((e) => e.type !== "drill");
  const drills = getHistory(certId).filter((e) => e.type === "drill");

  if (history.length === 0 && drills.length === 0) {
    body.innerHTML =
      "<p class=\"history-empty\">No practice exams yet. Finish an exam to track your scores here.</p>";
    return;
  }

  const showAll = panel.dataset.showAll === "true";
  const slice = showAll ? history : history.slice(0, DISPLAY_LIMIT);

  let html = `<table class="history-table"><thead><tr>
    <th>Date</th><th>Score</th><th>Result</th><th>Domains</th><th></th>
  </tr></thead><tbody>`;

  for (const entry of slice) {
    const pass = entry.passed;
    html += `<tr>
      <td>${formatDate(entry.date)}</td>
      <td>${entry.scaledScore} / ${cert.exam.maxScore}</td>
      <td class="${pass ? "history-pass" : "history-fail"}">${pass ? "Pass" : "Fail"}</td>
      <td class="history-domains">${formatWeakDomains(entry.domainBreakdown)}</td>
      <td><button type="button" class="history-delete" data-date="${entry.date}" aria-label="Delete this attempt">×</button></td>
    </tr>`;
  }

  html += "</tbody></table>";

  if (history.length > DISPLAY_LIMIT) {
    html += `<button type="button" id="history-view-all" class="btn btn-outline btn-sm">
      ${showAll ? "Show less" : `View all (${history.length})`}
    </button>`;
  }

  if (drills.length > 0) {
    html += `<p class="history-drill-note">📋 ${drills.length} drill session${drills.length > 1 ? "s" : ""} (not shown in score trend)</p>`;
  }

  body.innerHTML = html;

  body.querySelectorAll(".history-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const date = btn.getAttribute("data-date");
      if (!date) return;
      if (!window.confirm("Delete this attempt from your history?")) return;
      removeHistoryEntry(certId, date);
      renderHistoryPanel(certId, cert, opts);
      opts.onHistoryChange?.();
    });
  });

  document.getElementById("history-view-all")?.addEventListener("click", () => {
    panel.dataset.showAll = showAll ? "false" : "true";
    renderHistoryPanel(certId, cert, opts);
  });

  if (toggle && !toggle.dataset.bound) {
    toggle.dataset.bound = "true";
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
}

/**
 * @param {string} certId
 * @param {import('./cert-loader.js').CertData} cert
 * @param {object} currentResult
 * @returns {string}
 */
export function buildTrendLine(certId, cert, currentResult) {
  const history = getHistory(certId).filter((e) => e.type !== "drill");
  if (history.length === 0) return "";

  if (history.length === 1) {
    return "This is your first recorded attempt for this exam.";
  }

  const prev = history[1];
  const delta = currentResult.scaledScore - prev.scaledScore;
  const sign = delta >= 0 ? "⬆" : "⬇";
  const abs = Math.abs(delta);
  const dir = delta >= 0 ? "up" : "down";
  let line = `${sign} ${abs} points from your last attempt (${prev.scaledScore})`;

  const best = history.reduce(
    (max, e) => (e.scaledScore > max.scaledScore ? e : max),
    history[0]
  );
  if (best.scaledScore !== currentResult.scaledScore) {
    const bestDelta = currentResult.scaledScore - best.scaledScore;
    if (bestDelta !== 0) {
      line += ` · ${bestDelta >= 0 ? "⬆" : "⬇"} ${Math.abs(bestDelta)} from your best (${best.scaledScore})`;
    }
  }

  return line;
}
