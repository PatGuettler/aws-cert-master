import { dismissNotice, isNoticeDismissed } from "./storage.js";

export function initStorageNotice() {
  if (isNoticeDismissed()) return;

  const banner = document.createElement("div");
  banner.className = "storage-notice";
  banner.setAttribute("role", "status");
  banner.innerHTML = `
    <p>Your progress is saved in <strong>this browser only</strong>. Use <strong>Export</strong> in the menu to back up your data.</p>
    <button type="button" class="storage-notice-dismiss" aria-label="Dismiss">Dismiss</button>
  `;

  banner.querySelector(".storage-notice-dismiss")?.addEventListener("click", () => {
    dismissNotice();
    banner.remove();
  });

  document.body.insertBefore(banner, document.body.firstChild);
}
