import { getHistory } from "./storage.js";

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
