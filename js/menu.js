import { loadSettings, saveSettings } from "./storage.js";

/**
 * @param {Object} opts
 * @param {import('./cert-loader.js').CertRegistryEntry[]} opts.registry
 * @param {() => string} opts.getActiveCertId
 * @param {import('./config.js').ExamSettings} opts.settings
 * @param {(certId: string) => void} opts.onCertChange
 * @param {(settings: import('./config.js').ExamSettings) => void} opts.onSettingsChange
 */
export function initMenu({
  registry,
  getActiveCertId,
  settings,
  onCertChange,
  onSettingsChange,
}) {
  let activeCertId = getActiveCertId();
  const menuBtn = document.getElementById("menu-btn");
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("drawer");
  const certList = document.getElementById("cert-list");
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

  certList.innerHTML = "";
  for (const cert of registry) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = cert.available
      ? `${cert.name} (${cert.code})`
      : `${cert.name} — coming soon`;
    btn.disabled = !cert.available;
    if (cert.id === activeCertId) btn.classList.add("active");
    btn.addEventListener("click", () => {
      if (!cert.available) return;
      onCertChange(cert.id);
      closeDrawer();
    });
    li.appendChild(btn);
    certList.appendChild(li);
  }

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
    certList?.querySelectorAll("button").forEach((btn, i) => {
      const cert = registry[i];
      btn.classList.toggle("active", cert?.id === certId);
    });
    if (timeLimitToggle) timeLimitToggle.checked = settings.timeLimitEnabled;
    if (feedbackToggle) feedbackToggle.checked = settings.immediateFeedback;
    if (docLinksToggle) docLinksToggle.checked = settings.showDocLinks;
  }

  function refreshSettings(newSettings) {
    settings = newSettings;
    if (timeLimitToggle) timeLimitToggle.checked = settings.timeLimitEnabled;
    if (feedbackToggle) feedbackToggle.checked = settings.immediateFeedback;
    if (docLinksToggle) docLinksToggle.checked = settings.showDocLinks;
  }

  return { closeDrawer, setActiveCert, refreshSettings };
}
