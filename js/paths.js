/**
 * Resolve static asset URLs for GitHub Pages project sites (e.g. /aws-cert-master/)
 * and local dev. Ignores the URL hash so #cloud-practitioner does not break fetch paths.
 */
export function getSiteRoot() {
  const { origin, pathname } = window.location;
  let base = pathname;

  if (/\.html$/i.test(base)) {
    base = base.slice(0, base.lastIndexOf("/") + 1);
  } else if (!base.endsWith("/")) {
    base = `${base}/`;
  }

  return `${origin}${base}`;
}

/**
 * @param {string} relativePath e.g. data/exams-index.json
 */
export function resolveAssetPath(relativePath) {
  const clean = relativePath.replace(/^\//, "");
  return new URL(clean, getSiteRoot()).href;
}
