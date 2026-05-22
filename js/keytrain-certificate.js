/**
 * Client-side PDF certificate generation (jsPDF loaded on demand).
 * CDN 2.5.2 on cdnjs returns 404; use jsDelivr + self-hosted vendor fallback.
 */

import { resolveAssetPath } from "./paths.js";

const JSPDF_CDN =
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js";
const JSPDF_LOCAL = "vendor/jspdf.umd.min.js";

let jsPdfPromise = null;

/**
 * @param {string} src
 * @returns {Promise<typeof import('jspdf').jsPDF>}
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.jspdf?.jsPDF) {
      resolve(window.jspdf.jsPDF);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      if (window.jspdf?.jsPDF) resolve(window.jspdf.jsPDF);
      else reject(new Error("jsPDF loaded but global was not found"));
    };
    script.onerror = () =>
      reject(new Error(`Could not load PDF library from ${src}`));
    document.head.appendChild(script);
  });
}

function loadJsPdf() {
  if (jsPdfPromise) return jsPdfPromise;
  if (window.jspdf?.jsPDF) {
    jsPdfPromise = Promise.resolve(window.jspdf.jsPDF);
    return jsPdfPromise;
  }
  const localUrl = resolveAssetPath(JSPDF_LOCAL);
  jsPdfPromise = loadScript(localUrl).catch(() => loadScript(JSPDF_CDN));
  return jsPdfPromise;
}

/** Preload jsPDF when opening the certificate form (reduces wait on download). */
export function preloadKeytrainCertificatePdf() {
  loadJsPdf().catch(() => {
    /* surfaced on download click */
  });
}

/**
 * @param {object} opts
 * @param {string} opts.recipientName
 * @param {string} opts.certificateTitle
 * @param {string} opts.certificateId
 * @param {string} opts.issuedAt ISO date
 * @param {number} opts.scaledScore
 * @param {number} opts.passingScore
 * @param {string} opts.examCode
 */
export async function downloadKeytrainCertificatePdf(opts) {
  let jsPDF;
  try {
    jsPDF = await loadJsPdf();
  } catch (e) {
    const hint =
      e instanceof Error && e.message.includes("Could not load")
        ? " Check your network or try again. If you opened the site from disk (file://), use a local web server instead."
        : "";
    throw new Error(
      `Could not load PDF library.${hint}`,
      e instanceof Error ? { cause: e } : undefined
    );
  }
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const margin = 48;

  doc.setFillColor(35, 47, 62);
  doc.rect(0, 0, w, h, "F");

  doc.setDrawColor(255, 153, 0);
  doc.setLineWidth(3);
  doc.rect(margin, margin, w - margin * 2, h - margin * 2);

  doc.setTextColor(255, 153, 0);
  doc.setFontSize(28);
  doc.text("KeyTrain", w / 2, margin + 52, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("CERTIFICATION OF ACHIEVEMENT", w / 2, margin + 78, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(200, 210, 220);
  doc.text("This certifies that", w / 2, margin + 118, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  const name = (opts.recipientName || "Certificate Holder").trim();
  doc.text(name, w / 2, margin + 158, { align: "center" });

  doc.setFontSize(13);
  doc.setTextColor(220, 228, 235);
  doc.text("has successfully completed the requirements for", w / 2, margin + 198, {
    align: "center",
  });

  doc.setTextColor(255, 153, 0);
  doc.setFontSize(20);
  const titleLines = doc.splitTextToSize(opts.certificateTitle, w - margin * 2 - 80);
  doc.text(titleLines, w / 2, margin + 232, { align: "center" });

  if (opts.examCode) {
    doc.setFontSize(11);
    doc.setTextColor(180, 190, 200);
    doc.text(`Exam reference: ${opts.examCode}`, w / 2, margin + 262, { align: "center" });
  }

  const issued = new Date(opts.issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(11);
  doc.setTextColor(200, 210, 220);
  doc.text(
    `Issued ${issued}  ·  Score ${opts.scaledScore} (passing ${opts.passingScore})  ·  ID ${opts.certificateId}`,
    w / 2,
    h - margin - 36,
    { align: "center" }
  );

  doc.setFontSize(9);
  doc.setTextColor(140, 150, 160);
  doc.text(
    "KeyTrain certification is issued by Cert Master for study purposes. Not affiliated with AWS, Microsoft, Google, or CompTIA.",
    w / 2,
    h - margin - 18,
    { align: "center",
      maxWidth: w - margin * 2 - 40 }
  );

  const safeName = name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 40);
  doc.save(`KeyTrain-Certificate-${safeName || "recipient"}.pdf`);
}
