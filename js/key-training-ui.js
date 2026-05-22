/**
 * KeyTrain hub — training, workshops, and certification.
 */

/** @typedef {import('./cert-loader.js').ExamIndexEntry} ExamIndexEntry */

import { KEYTRAIN_CATEGORIES, TRAINING_LEVELS, LEVEL_HINTS } from "./workshops/keytrain-catalog.js";
import { getKeytrainWorkshop, getLevelLabel } from "./workshops/keytrain-workshop-content.js";

const KEY_TRAINING_VENDOR = "keytraining";

/**
 * @param {ExamIndexEntry[]} exams
 */
export function filterKeyTrainingExams(exams) {
  return exams
    .filter((e) => e.vendor === KEY_TRAINING_VENDOR)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * @param {HTMLElement|null} grid
 * @param {ExamIndexEntry[]} items
 * @param {(certId: string) => void} onSelect
 * @param {string} [metaSuffix]
 */
function renderExamGrid(grid, items, onSelect, metaSuffix = " in bank") {
  if (!grid) return;
  grid.innerHTML = "";
  for (const exam of items) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "landing-cert-tile keytraining-tile";
    tile.dataset.certId = exam.id;

    const level = document.createElement("span");
    level.className = "landing-cert-tile-level";
    level.textContent = "Training";

    const title = document.createElement("span");
    title.className = "landing-cert-tile-title";
    const shortName = exam.name.replace(/^KeyTrain's Key Training — /, "");
    title.textContent = shortName;

    const code = document.createElement("span");
    code.className = "landing-cert-tile-code";
    code.textContent = exam.code || exam.id;

    const meta = document.createElement("span");
    meta.className = "landing-cert-tile-meta";
    meta.textContent = `${exam.questionCount ?? "—"} questions${metaSuffix}`;

    tile.append(level, title, code, meta);
    tile.addEventListener("click", () => onSelect(exam.id));
    grid.appendChild(tile);
  }
}

/**
 * @param {HTMLElement|null} grid
 * @param {(categoryId: string, level: string) => void} onStart
 */
function renderLeveledWorkshopGrid(grid, onStart) {
  if (!grid) return;
  grid.innerHTML = "";

  for (const cat of KEYTRAIN_CATEGORIES) {
    const card = document.createElement("article");
    card.className = "keytrain-category-card";

    const head = document.createElement("header");
    head.className = "keytrain-category-card-head";

    const code = document.createElement("span");
    code.className = "keytrain-category-code";
    code.textContent = cat.code;

    const title = document.createElement("h3");
    title.className = "keytrain-category-title";
    title.textContent = cat.name;

    const tag = document.createElement("p");
    tag.className = "keytrain-category-tagline";
    tag.textContent = cat.tagline;

    head.append(code, title, tag);

    const levels = document.createElement("div");
    levels.className = "keytrain-level-row";
    levels.setAttribute("role", "group");
    levels.setAttribute("aria-label", `${cat.name} difficulty levels`);

    for (const lv of TRAINING_LEVELS) {
      const w = getKeytrainWorkshop(cat.id, lv);
      if (!w) continue;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `btn btn-outline keytrain-level-btn keytrain-level-btn-${lv}`;
      btn.dataset.categoryId = cat.id;
      btn.dataset.level = lv;

      const label = document.createElement("span");
      label.className = "keytrain-level-btn-label";
      label.textContent = lv.charAt(0).toUpperCase() + lv.slice(1);

      const meta = document.createElement("span");
      meta.className = "keytrain-level-btn-meta";
      meta.textContent = `~${w.estimatedMinutes} min · ${w.steps.length} steps`;

      btn.title = LEVEL_HINTS[lv] ?? getLevelLabel(lv);
      btn.append(label, meta);
      btn.addEventListener("click", () => onStart(cat.id, lv));
      levels.appendChild(btn);
    }

    card.append(head, levels);
    grid.appendChild(card);
  }
}

/**
 * @param {import('./keytrain-loader.js').KeytrainCertSummary[]} items
 * @param {HTMLElement|null} grid
 * @param {(keytrainId: string) => void} onSelect
 */
function renderKeytrainCertTiles(items, grid, onSelect) {
  if (!grid) return;
  grid.innerHTML = "";
  for (const item of items) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "landing-cert-tile keytrain-tile";

    const level = document.createElement("span");
    level.className = "landing-cert-tile-level";
    level.textContent = item.level || "Certification";

    const title = document.createElement("span");
    title.className = "landing-cert-tile-title";
    title.textContent = item.certificateTitle.replace(/^KeyTrain Certified /, "");

    const code = document.createElement("span");
    code.className = "landing-cert-tile-code";
    code.textContent = item.code;

    const meta = document.createElement("span");
    meta.className = "landing-cert-tile-meta";
    meta.textContent = "Pass/fail · PDF certificate";

    tile.append(level, title, code, meta);
    tile.addEventListener("click", () => onSelect(item.id));
    grid.appendChild(tile);
  }
}

/**
 * @param {ExamIndexEntry[]} exams
 * @param {(certId: string) => void} onPractice
 * @param {(categoryId: string, level: string) => void} onWorkshop
 * @param {(keytrainId: string) => void} onKeytrainCert
 * @param {import('./keytrain-loader.js').KeytrainCertSummary[]} keytrainCatalog
 */
export function renderKeytrainHub(
  exams,
  onPractice,
  onWorkshop,
  onKeytrainCert,
  keytrainCatalog
) {
  const practice = filterKeyTrainingExams(exams);

  renderExamGrid(
    document.getElementById("keytrain-training-grid"),
    practice,
    onPractice,
    " · study mode"
  );

  renderLeveledWorkshopGrid(
    document.getElementById("keytrain-workshop-preview-grid"),
    onWorkshop
  );

  const cyber = keytrainCatalog.filter((c) => c.group === "key-training");
  const vendor = keytrainCatalog.filter((c) => c.group !== "key-training");

  const cyberGrid = document.getElementById("keytrain-cert-grid-keytraining");
  const vendorGrid = document.getElementById("keytrain-cert-grid-vendor");
  const cyberHead = document.querySelector(".keytrain-cert-subhead:not(.keytrain-cert-subhead-vendor)");
  const vendorHead = document.querySelector(".keytrain-cert-subhead-vendor");

  cyberHead?.classList.toggle("hidden", cyber.length === 0);
  vendorHead?.classList.toggle("hidden", vendor.length === 0);
  cyberGrid?.classList.toggle("hidden", cyber.length === 0);
  vendorGrid?.classList.toggle("hidden", vendor.length === 0);

  renderKeytrainCertTiles(cyber, cyberGrid, onKeytrainCert);
  renderKeytrainCertTiles(vendor, vendorGrid, onKeytrainCert);
}

/**
 * @param {(categoryId: string, level: string) => void} onStartWorkshop
 */
export function renderKeytrainWorkshops(onStartWorkshop) {
  renderLeveledWorkshopGrid(document.getElementById("keytrain-workshop-grid"), onStartWorkshop);
}

/** @deprecated */
export const renderKeyTrainingHub = renderKeytrainHub;

/** @deprecated */
export const renderKeyTrainingWorkshops = renderKeytrainWorkshops;
