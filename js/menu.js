import { loadSettings, saveSettings } from "./storage.js";

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

/**
 * @param {import('./cert-loader.js').ExamIndexEntry[]} exams
 */
function sortAwsExams(exams) {
  return [...exams].sort((a, b) => {
    const oa = AWS_CERT_SORT[a.id] ?? 500;
    const ob = AWS_CERT_SORT[b.id] ?? 500;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name);
  });
}

/**
 * @param {Object} opts
 * @param {import('./cert-loader.js').ExamIndexEntry[]} opts.exams
 * @param {() => string} opts.getActiveCertId
 * @param {import('./config.js').ExamSettings} opts.settings
 * @param {(certId: string) => void} opts.onExamChange
 * @param {(settings: import('./config.js').ExamSettings) => void} opts.onSettingsChange
 * @param {() => void} opts.onNavigateHome
 * @param {() => void} opts.onNavigateDashboard
 */
export function initMenu({
  exams,
  getActiveCertId,
  settings,
  onExamChange,
  onSettingsChange,
  onNavigateHome,
  onNavigateDashboard,
}) {
  let activeCertId = getActiveCertId();
  /** @type {import('./cert-loader.js').ExamIndexEntry[]} */
  let examList = exams;

  const menuBtn = document.getElementById("menu-btn");
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("drawer");
  const examListAws = document.getElementById("exam-list-aws");
  const examListAwsEmpty = document.getElementById("exam-list-aws-empty");
  const timeLimitToggle = document.getElementById("opt-time-limit");
  const feedbackToggle = document.getElementById("opt-feedback");
  const docLinksToggle = document.getElementById("opt-doc-links");

  function openDrawer() {
    menuBtn?.setAttribute("aria-expanded", "true");
    overlay?.classList.add("open");
    drawer?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    menuBtn?.setAttribute("aria-expanded", "false");
    overlay?.classList.remove("open");
    drawer?.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuBtn?.addEventListener("click", () => {
    const open = drawer?.classList.contains("open");
    if (open) closeDrawer();
    else openDrawer();
  });

  overlay?.addEventListener("click", closeDrawer);

  document.getElementById("drawer-nav-home")?.addEventListener("click", () => {
    onNavigateHome();
    closeDrawer();
  });

  document.getElementById("drawer-nav-dashboard")?.addEventListener("click", () => {
    onNavigateDashboard();
    closeDrawer();
  });

  /**
   * @param {HTMLElement|null} listEl
   * @param {import('./cert-loader.js').ExamIndexEntry[]} items
   */
  function renderList(listEl, items) {
    if (!listEl) return;
    listEl.innerHTML = "";
    for (const exam of items) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.examId = exam.id;
      btn.textContent = exam.code
        ? `${exam.name} (${exam.code})`
        : exam.name;
      if (exam.id === activeCertId) btn.classList.add("active");
      btn.addEventListener("click", () => {
        onExamChange(exam.id);
        closeDrawer();
      });
      li.appendChild(btn);
      listEl.appendChild(li);
    }
  }

  function renderExamList() {
    const awsExams = sortAwsExams(
      examList.filter((e) => (e.vendor ?? "aws") === "aws")
    );

    if (awsExams.length === 0) {
      examListAwsEmpty?.classList.remove("hidden");
    } else {
      examListAwsEmpty?.classList.add("hidden");
    }

    renderList(examListAws, awsExams);
  }

  renderExamList();

  if (timeLimitToggle) timeLimitToggle.checked = settings.timeLimitEnabled;
  if (feedbackToggle) feedbackToggle.checked = settings.immediateFeedback;
  if (docLinksToggle) docLinksToggle.checked = settings.showDocLinks;

  function emitSettings() {
    const next = {
      timeLimitEnabled: timeLimitToggle?.checked ?? true,
      immediateFeedback: feedbackToggle?.checked ?? false,
      showDocLinks: docLinksToggle?.checked ?? true,
    };
    saveSettings(getActiveCertId(), next);
    onSettingsChange(next);
  }

  [timeLimitToggle, feedbackToggle, docLinksToggle].forEach((el) => {
    el?.addEventListener("change", emitSettings);
  });

  function setActiveCert(certId) {
    activeCertId = certId;
    examListAws?.querySelectorAll("button[data-exam-id]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.examId === certId);
    });
  }

  function refreshSettings(newSettings) {
    settings = newSettings;
    if (timeLimitToggle) timeLimitToggle.checked = settings.timeLimitEnabled;
    if (feedbackToggle) feedbackToggle.checked = settings.immediateFeedback;
    if (docLinksToggle) docLinksToggle.checked = settings.showDocLinks;
  }

  /**
   * @param {import('./cert-loader.js').ExamIndexEntry[]} nextExams
   */
  function updateExamList(nextExams) {
    examList = nextExams;
    renderExamList();
  }

  return { closeDrawer, setActiveCert, refreshSettings, updateExamList };
}
