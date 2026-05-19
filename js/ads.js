/**
 * Lightweight ad slot — hidden during active exams.
 * Configure in data/ads-config.json (copy from ads-config.example.json).
 */

/** @type {object|null} */
let config = null;
/** @type {boolean} */
let scriptLoaded = false;
/** @type {boolean} */
let adRendered = false;

const pageShell = document.getElementById("page-shell");
const adSlot = document.getElementById("ad-slot");
const adContainer = document.getElementById("ad-container");

/**
 * @param {string} basePath
 */
function resolvePath(basePath) {
  const base = document.querySelector("base")?.href ?? window.location.href;
  return new URL(basePath, base).href;
}

/**
 * @returns {Promise<object|null>}
 */
async function loadAdsConfig() {
  if (config) return config;
  try {
    const res = await fetch(resolvePath("data/ads-config.json"), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    config = await res.json();
    return config;
  } catch {
    return null;
  }
}

/**
 * @param {object} cfg
 */
function applyPlacement(cfg) {
  const placement = cfg.placement === "side" ? "side" : "bottom";
  pageShell?.classList.toggle("layout-side-ad", placement === "side");
  adSlot?.classList.toggle("ad-slot--side", placement === "side");
  adSlot?.classList.toggle("ad-slot--bottom", placement === "bottom");
}

/**
 * @param {object} cfg
 */
function renderCustomAd(cfg) {
  if (!adContainer || !cfg.custom?.href || !cfg.custom?.text) return;

  const label = cfg.custom.label ?? "Sponsored";
  const link = document.createElement("a");
  link.className = "ad-custom-link";
  link.href = cfg.custom.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer sponsored";
  link.textContent = cfg.custom.text;

  const caption = document.createElement("span");
  caption.className = "ad-slot-label";
  caption.textContent = label;

  adContainer.replaceChildren(caption, link);
  adRendered = true;
}

/**
 * @param {object} cfg
 */
function loadAdSenseScript(client) {
  if (scriptLoaded || document.querySelector('script[data-adsense="true"]')) {
    scriptLoaded = true;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = "anonymous";
    script.dataset.adsense = "true";
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("AdSense script failed to load"));
    document.head.appendChild(script);
  });
}

/**
 * @param {object} cfg
 */
async function renderAdSense(cfg) {
  if (!adContainer || !cfg.adsense?.client || !cfg.adsense?.slot) return;

  await loadAdSenseScript(cfg.adsense.client);

  const ins = document.createElement("ins");
  ins.className = "adsbygoogle";
  ins.style.display = "block";
  ins.setAttribute("data-ad-client", cfg.adsense.client);
  ins.setAttribute("data-ad-slot", cfg.adsense.slot);
  ins.setAttribute("data-ad-format", cfg.adsense.format ?? "auto");
  if (cfg.adsense.fullWidthResponsive !== false) {
    ins.setAttribute("data-full-width-responsive", "true");
  }

  adContainer.replaceChildren(ins);

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    adRendered = true;
  } catch (err) {
    console.warn("AdSense push failed:", err);
  }
}

export async function initAds() {
  const cfg = await loadAdsConfig();
  if (!cfg?.enabled) return;

  applyPlacement(cfg);

  if (cfg.provider === "custom") {
    renderCustomAd(cfg);
  } else if (cfg.provider === "adsense") {
    try {
      await renderAdSense(cfg);
    } catch (err) {
      console.warn("Ads not loaded:", err);
    }
  }

  if (adRendered && adSlot) {
    adSlot.classList.remove("hidden");
    updateAdVisibility(true);
  }
}

/**
 * Hide ads during the exam so they never cover questions.
 * @param {boolean} visible
 */
export function updateAdVisibility(visible) {
  if (!adSlot || !config?.enabled || !adRendered) return;
  adSlot.classList.toggle("hidden", !visible);
  adSlot.setAttribute("aria-hidden", visible ? "false" : "true");
}
