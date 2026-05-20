/** @type {Record<string, number>} */
const AWS_CERT_SORT = {
  "cloud-practitioner": 10,
  "ai-practitioner": 20,
  "solutions-architect-associate": 30,
  "developer-associate": 40,
  "machine-learning-engineer-associate": 50,
  "data-engineer-associate": 60,
  "cloudops-engineer-associate": 70,
  "solutions-architect-professional": 80,
  "devops-engineer-professional": 90,
  "generative-ai-developer-professional": 100,
  "advanced-networking-specialty": 110,
  "security-specialty": 120,
};

/** @type {Record<string, number>} */
const COMPTIA_CERT_SORT = {
  "comptia-a-plus": 10,
  "comptia-network-plus": 20,
  "comptia-security-plus": 30,
  "comptia-cysa-plus": 40,
  "comptia-linux-plus": 50,
};

/** @type {Record<string, string>} */
const AWS_LEVEL_LABEL = {
  "cloud-practitioner": "Foundational",
  "ai-practitioner": "Foundational",
  "solutions-architect-associate": "Associate",
  "developer-associate": "Associate",
  "machine-learning-engineer-associate": "Associate",
  "data-engineer-associate": "Associate",
  "cloudops-engineer-associate": "Associate",
  "solutions-architect-professional": "Professional",
  "devops-engineer-professional": "Professional",
  "generative-ai-developer-professional": "Professional",
  "advanced-networking-specialty": "Specialty",
  "security-specialty": "Specialty",
};

/**
 * @param {import('./cert-loader.js').ExamIndexEntry[]} exams
 * @param {Record<string, number>} sortMap
 * @param {string} vendor
 */
function filterAndSort(exams, sortMap, vendor) {
  return exams
    .filter((e) => (e.vendor ?? "aws") === vendor)
    .sort((a, b) => {
      const oa = sortMap[a.id] ?? 500;
      const ob = sortMap[b.id] ?? 500;
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
}

/**
 * @param {HTMLElement|null} grid
 * @param {import('./cert-loader.js').ExamIndexEntry[]} items
 * @param {string} levelDefault
 * @param {string} metaSuffix
 * @param {(certId: string) => void} onSelectCert
 */
function renderGrid(grid, items, levelDefault, metaSuffix, onSelectCert) {
  if (!grid) return;
  grid.innerHTML = "";
  for (const exam of items) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "landing-cert-tile";
    tile.dataset.certId = exam.id;

    const level = document.createElement("span");
    level.className = "landing-cert-tile-level";
    level.textContent = levelDefault;

    const title = document.createElement("span");
    title.className = "landing-cert-tile-title";
    title.textContent = exam.name;

    const code = document.createElement("span");
    code.className = "landing-cert-tile-code";
    code.textContent = exam.code || exam.id;

    const meta = document.createElement("span");
    meta.className = "landing-cert-tile-meta";
    meta.textContent = `${exam.questionCount ?? "—"} questions${metaSuffix}`;

    tile.append(level, title, code, meta);
    tile.addEventListener("click", () => onSelectCert(exam.id));
    grid.appendChild(tile);
  }
}

/**
 * @param {import('./cert-loader.js').ExamIndexEntry[]} exams
 * @param {(certId: string) => void} onSelectCert
 */
export function renderLanding(exams, onSelectCert) {
  const awsGrid = document.getElementById("landing-cert-grid-aws");
  const comptiaGrid = document.getElementById("landing-cert-grid-comptia");
  const awsCount = document.getElementById("landing-aws-count");
  const comptiaCount = document.getElementById("landing-comptia-count");

  const awsExams = filterAndSort(exams, AWS_CERT_SORT, "aws");
  const comptiaExams = filterAndSort(exams, COMPTIA_CERT_SORT, "comptia");

  if (awsCount) awsCount.textContent = String(awsExams.length);
  if (comptiaCount) comptiaCount.textContent = String(comptiaExams.length);

  renderGrid(awsGrid, awsExams, "AWS", " in bank", onSelectCert);
  renderGrid(
    comptiaGrid,
    comptiaExams,
    "CompTIA",
    " · includes acronym drill",
    onSelectCert
  );
}
