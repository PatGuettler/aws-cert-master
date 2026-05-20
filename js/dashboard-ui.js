import {
  getHistory,
  getWeakQuestions,
  getBookmarks,
  removeHistoryEntry,
} from "./storage.js";
import { getDomainAccuracySummary } from "./cert-loader.js";

const CHART_LIMIT = 12;

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
 * @param {number} seconds
 */
function formatDuration(seconds) {
  if (!seconds || seconds < 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h}h ${rm}m`;
  }
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/**
 * @param {object[]} exams Chronological (oldest first)
 */
function computeScoreTrend(exams) {
  if (exams.length < 2) return { label: "Not enough data", className: "neutral" };
  const recent = exams.slice(-3);
  const prior = exams.slice(-6, -3);
  if (prior.length === 0) {
    const delta = exams[exams.length - 1].scaledScore - exams[0].scaledScore;
    if (delta > 15) return { label: "Improving since your first attempt", className: "up" };
    if (delta < -15) return { label: "Scores dipped since your first attempt", className: "down" };
    return { label: "Holding steady", className: "neutral" };
  }
  const avg = (arr) =>
    arr.reduce((s, e) => s + e.scaledScore, 0) / arr.length;
  const delta = avg(recent) - avg(prior);
  if (delta >= 25) return { label: "Getting better — recent scores are up", className: "up" };
  if (delta <= -25) return { label: "Recent scores are down — review weak domains", className: "down" };
  return { label: "Holding steady", className: "neutral" };
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
      const short = d.name.replace(/^Domain \d+: /, "").slice(0, 22);
      return `${short} ${d.percent}%`;
    })
    .join(", ");
}

/**
 * @param {string} certId
 * @param {import('./cert-loader.js').CertData} cert
 */
export function renderProgressTeaser(certId, cert) {
  const summary = document.getElementById("progress-teaser-summary");
  if (!summary) return;

  const exams = getHistory(certId)
    .filter((e) => e.type !== "drill")
    .slice()
    .reverse();
  const drills = getHistory(certId).filter((e) => e.type === "drill");
  const bookmarks = getBookmarks(certId);

  if (exams.length === 0) {
    summary.textContent =
      "Finish a practice exam to see score trends, weak domains, flagged questions, and time per attempt.";
    return;
  }

  const latest = exams[exams.length - 1];
  const passed = exams.filter((e) => e.passed).length;
  const trend = computeScoreTrend(exams);
  const parts = [
    `${exams.length} exam attempt${exams.length > 1 ? "s" : ""}`,
    `latest ${latest.scaledScore}/${cert.exam.maxScore}`,
    `${passed} pass${passed !== 1 ? "es" : ""}`,
  ];
  if (bookmarks.size > 0) parts.push(`${bookmarks.size} flagged`);
  if (drills.length > 0) parts.push(`${drills.length} drill${drills.length > 1 ? "s" : ""}`);
  summary.textContent = `${parts.join(" · ")}. ${trend.label}.`;
}

/**
 * @param {string} certId
 * @param {import('./cert-loader.js').CertData} cert
 * @param {{ onHistoryChange?: () => void }} [opts]
 */
export function renderDashboard(certId, cert, opts = {}) {
  const root = document.getElementById("dashboard-root");
  if (!root) return;

  document.getElementById("dashboard-cert-name").textContent = cert.name;
  document.getElementById("dashboard-cert-code").textContent = cert.code;

  const allHistory = getHistory(certId);
  const exams = allHistory.filter((e) => e.type !== "drill").slice().reverse();
  const drills = allHistory.filter((e) => e.type === "drill");
  const weakMap = getWeakQuestions(certId);
  const bookmarks = getBookmarks(certId);
  const domainAcc = getDomainAccuracySummary(cert, weakMap);

  if (exams.length === 0 && drills.length === 0) {
    root.innerHTML = `
      <p class="dashboard-empty">No practice data yet. Complete an exam to unlock trends for scores, domains, timing, and weak areas.</p>`;
    return;
  }

  const trend = computeScoreTrend(exams);
  const passed = exams.filter((e) => e.passed).length;
  const best = exams.reduce(
    (max, e) => (e.scaledScore > max ? e.scaledScore : max),
    exams[0]?.scaledScore ?? 0
  );
  const latest = exams[exams.length - 1];
  const withDuration = exams.filter((e) => e.durationSeconds > 0);
  const avgDuration =
    withDuration.length > 0
      ? Math.round(
          withDuration.reduce((s, e) => s + e.durationSeconds, 0) /
            withDuration.length
        )
      : null;

  let html = "";

  if (exams.length > 0) {
    html += `<section class="dash-section dash-summary">
      <p class="dash-trend dash-trend--${trend.className}">${trend.label}</p>
      <div class="dash-stat-grid">
        <div class="dash-stat"><span class="dash-stat-value">${exams.length}</span><span class="dash-stat-label">Attempts</span></div>
        <div class="dash-stat"><span class="dash-stat-value">${passed}/${exams.length}</span><span class="dash-stat-label">Passed</span></div>
        <div class="dash-stat"><span class="dash-stat-value">${best}</span><span class="dash-stat-label">Best score</span></div>
        <div class="dash-stat"><span class="dash-stat-value">${latest.scaledScore}</span><span class="dash-stat-label">Latest</span></div>
        ${avgDuration !== null ? `<div class="dash-stat"><span class="dash-stat-value">${formatDuration(avgDuration)}</span><span class="dash-stat-label">Avg time</span></div>` : ""}
      </div>
    </section>`;

    const chartExams = exams.slice(-CHART_LIMIT);
    const maxScore = cert.exam.maxScore;
    const passLine = cert.exam.passingScore;

    html += `<section class="dash-section">
      <h3>Score over time</h3>
      <p class="dash-hint">Most recent on the right. Dashed line = passing score (${passLine}).</p>
      <div class="dash-chart" role="img" aria-label="Score trend chart">
        ${chartExams
          .map((e) => {
            const h = Math.max(8, Math.round((e.scaledScore / maxScore) * 100));
            const pass = e.passed;
            return `<div class="dash-bar-wrap" title="${formatDate(e.date)}: ${e.scaledScore}">
              <div class="dash-bar ${pass ? "dash-bar--pass" : "dash-bar--fail"}" style="height:${h}%"></div>
              <span class="dash-bar-label">${e.scaledScore}</span>
            </div>`;
          })
          .join("")}
        <div class="dash-pass-line" style="bottom:${Math.round((passLine / maxScore) * 100)}%" aria-hidden="true"></div>
      </div>
    </section>`;

    const domainTrends = buildDomainTrends(exams, cert);
    if (domainTrends.length > 0) {
      html += `<section class="dash-section">
        <h3>Domain trends</h3>
        <p class="dash-hint">Latest attempt vs your average across all attempts.</p>
        <ul class="dash-domain-trends">`;
      for (const d of domainTrends) {
        const arrow =
          d.delta > 5 ? "↑" : d.delta < -5 ? "↓" : "→";
        const cls =
          d.delta > 5 ? "up" : d.delta < -5 ? "down" : "flat";
        html += `<li>
          <span class="dash-domain-name">${escapeHtml(d.name)}</span>
          <span class="dash-domain-stats">
            <span class="dash-domain-latest">${d.latest}%</span>
            <span class="dash-domain-delta dash-domain-delta--${cls}">${arrow} ${d.delta >= 0 ? "+" : ""}${d.delta}% vs avg</span>
          </span>
        </li>`;
      }
      html += `</ul></section>`;
    }
  }

  const weakList = buildWeakQuestionList(cert, weakMap);
  const strongDomains = domainAcc.filter((d) => d.accuracy !== null && d.accuracy >= 75);
  const weakDomains = domainAcc.filter((d) => d.accuracy !== null);

  html += `<section class="dash-section dash-two-col">
    <div>
      <h3>Weak areas</h3>
      ${
        weakDomains.length === 0
          ? "<p class=\"dash-hint\">Complete more exams to build domain accuracy (5+ question attempts per domain).</p>"
          : `<ul class="dash-list">${weakDomains
              .sort((a, b) => (a.accuracy ?? 100) - (b.accuracy ?? 100))
              .map(
                (d) =>
                  `<li>${escapeHtml(d.name)} <strong>${d.accuracy}%</strong>${d.isWeakest ? ' <span class="domain-weak-badge">Weakest</span>' : ""}</li>`
              )
              .join("")}</ul>`
      }
      ${
        weakList.length > 0
          ? `<h4 class="dash-subhead">Toughest questions</h4><ul class="dash-list dash-list--compact">${weakList
              .map(
                (q) =>
                  `<li><code>${escapeHtml(q.id)}</code> — ${q.accuracy}% (${q.attempts} tries)</li>`
              )
              .join("")}</ul>`
          : ""
      }
    </div>
    <div>
      <h3>Strengths &amp; flags</h3>
      ${
        strongDomains.length > 0
          ? `<p class="dash-hint">Domains at 75%+ accuracy:</p><ul class="dash-list">${strongDomains
              .map((d) => `<li>${escapeHtml(d.name)} <strong>${d.accuracy}%</strong></li>`)
              .join("")}</ul>`
          : "<p class=\"dash-hint\">No strong domains yet — keep practicing.</p>"
      }
      <p class="dash-flags"><strong>${bookmarks.size}</strong> question${bookmarks.size !== 1 ? "s" : ""} flagged for review</p>
    </div>
  </section>`;

  if (withDuration.length > 0) {
    const timeRows = [...exams]
      .reverse()
      .filter((e) => e.durationSeconds > 0)
      .slice(-CHART_LIMIT);
    html += `<section class="dash-section">
      <h3>Time to complete</h3>
      <p class="dash-hint">How long each full exam took (when tracked).</p>
      <ul class="dash-time-list">`;
    const maxDur = Math.max(...timeRows.map((e) => e.durationSeconds));
    for (const e of timeRows) {
      const pct = Math.round((e.durationSeconds / maxDur) * 100);
      html += `<li>
        <span>${formatDate(e.date)}</span>
        <span class="dash-time-bar-wrap"><span class="dash-time-bar" style="width:${pct}%"></span></span>
        <strong>${formatDuration(e.durationSeconds)}</strong>
      </li>`;
    }
    html += `</ul></section>`;
  }

  if (drills.length > 0) {
    html += `<section class="dash-section">
      <h3>Drill sessions</h3>
      <p class="dash-hint">${drills.length} drill${drills.length > 1 ? "s" : ""} — focused practice, not included in score trend above.</p>
    </section>`;
  }

  const showAll = root.dataset.showAllHistory === "true";
  const tableExams = showAll ? [...allHistory] : allHistory.slice(0, 15);

  html += `<section class="dash-section">
    <h3>All attempts</h3>
    <table class="history-table dash-history-table"><thead><tr>
      <th>Date</th><th>Type</th><th>Score</th><th>Result</th><th>Time</th><th>Domains</th><th></th>
    </tr></thead><tbody>`;

  for (const entry of tableExams) {
    const isDrill = entry.type === "drill";
    html += `<tr>
      <td>${formatDate(entry.date)}</td>
      <td>${isDrill ? "Drill" : "Exam"}</td>
      <td>${isDrill ? `${entry.percent}%` : `${entry.scaledScore} / ${cert.exam.maxScore}`}</td>
      <td class="${entry.passed ? "history-pass" : "history-fail"}">${isDrill ? "—" : entry.passed ? "Pass" : "Fail"}</td>
      <td>${formatDuration(entry.durationSeconds)}</td>
      <td class="history-domains">${isDrill ? "—" : formatWeakDomains(entry.domainBreakdown)}</td>
      <td><button type="button" class="history-delete" data-date="${entry.date}" aria-label="Delete">×</button></td>
    </tr>`;
  }

  html += `</tbody></table>`;

  if (allHistory.length > 15) {
    html += `<button type="button" id="dash-history-toggle" class="btn btn-outline btn-sm">
      ${showAll ? "Show less" : `View all (${allHistory.length})`}
    </button>`;
  }

  html += `</section>`;

  root.innerHTML = html;

  root.querySelectorAll(".history-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const date = btn.getAttribute("data-date");
      if (!date) return;
      if (!window.confirm("Delete this attempt from your history?")) return;
      removeHistoryEntry(certId, date);
      renderDashboard(certId, cert, opts);
      opts.onHistoryChange?.();
    });
  });

  document.getElementById("dash-history-toggle")?.addEventListener("click", () => {
    root.dataset.showAllHistory = showAll ? "false" : "true";
    renderDashboard(certId, cert, opts);
  });
}

/**
 * @param {object[]} exams Chronological
 * @param {import('./cert-loader.js').CertData} cert
 */
function buildDomainTrends(exams, cert) {
  if (exams.length < 2) return [];

  /** @type {Record<string, number[]>} */
  const byDomain = {};

  for (const entry of exams) {
    if (!Array.isArray(entry.domainBreakdown)) continue;
    for (const d of entry.domainBreakdown) {
      const key = d.id ?? d.domainId ?? d.name;
      if (!byDomain[key]) byDomain[key] = [];
      byDomain[key].push(d.percent);
    }
  }

  const latestEntry = exams[exams.length - 1];
  const latestMap = new Map(
    (latestEntry.domainBreakdown ?? []).map((d) => [
      d.id ?? d.domainId ?? d.name,
      d.percent,
    ])
  );

  return cert.domains
    .map((dom) => {
      const key = dom.id;
      const scores = byDomain[key];
      if (!scores || scores.length < 2) return null;
      const avg = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      );
      const latest = latestMap.get(key);
      if (latest === undefined) return null;
      return {
        name: dom.name,
        latest,
        avg,
        delta: latest - avg,
      };
    })
    .filter(Boolean);
}

/**
 * @param {import('./cert-loader.js').CertData} cert
 * @param {Record<string, { attempts: number, correct: number }>} weakMap
 */
function buildWeakQuestionList(cert, weakMap) {
  const rows = [];
  for (const q of cert.questions) {
    const s = weakMap[q.id];
    if (!s || s.attempts < 2) continue;
    const accuracy = Math.round((s.correct / s.attempts) * 100);
    rows.push({ id: q.id, accuracy, attempts: s.attempts });
  }
  return rows.sort((a, b) => a.accuracy - b.accuracy).slice(0, 8);
}

/**
 * @param {string} text
 */
function escapeHtml(text) {
  const el = document.createElement("span");
  el.textContent = text;
  return el.innerHTML;
}
