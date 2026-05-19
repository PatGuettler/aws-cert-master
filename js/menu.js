import { loadSettings, saveSettings } from "./storage.js";

/**
 * @param {Object} opts
 * @param {import('./cert-loader.js').ExamIndexEntry[]} opts.exams
 * @param {() => string} opts.getActiveCertId
 * @param {import('./config.js').ExamSettings} opts.settings
 * @param {(certId: string) => void} opts.onExamChange
 * @param {(settings: import('./config.js').ExamSettings) => void} opts.onSettingsChange
 */
export function initMenu({
  exams,
  getActiveCertId,
  settings,
  onExamChange,
  onSettingsChange,
}) {
  let activeCertId = getActiveCertId();
  /** @type {import('./cert-loader.js').ExamIndexEntry[]} */
  let examList = exams;

  const menuBtn = document.getElementById("menu-btn");
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("drawer");
  const examListEl = document.getElementById("exam-list");
  const examListEmpty = document.getElementById("exam-list-empty");
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

  function renderExamList() {
    if (!examListEl) return;

    examListEl.innerHTML = "";

    if (examList.length === 0) {
      examListEmpty?.classList.remove("hidden");
      return;
    }

    examListEmpty?.classList.add("hidden");

    for (const exam of examList) {
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
      examListEl.appendChild(li);
    }
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
    examListEl?.querySelectorAll("button[data-exam-id]").forEach((btn) => {
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
   * Update the nested exam list when data/exams/*.json changes (new index).
   * @param {import('./cert-loader.js').ExamIndexEntry[]} nextExams
   */
  function updateExamList(nextExams) {
    examList = nextExams;
    renderExamList();
  }

  return { closeDrawer, setActiveCert, refreshSettings, updateExamList };
}
