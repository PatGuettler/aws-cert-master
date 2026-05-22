/**
 * Balance workshop MCQ option word counts so the correct answer is not the longest by default.
 */

const DISTRACTOR_PADS = [
  ", without revoking active sessions, OAuth grants, or hunting persistence such as mailbox rules",
  ", while leaving refresh tokens valid and deferring cross-tenant containment until later",
  ", using password reset alone and skipping consent removal, token revocation, and log preservation",
  ", based on informal user confirmation rather than defined incident-response sequencing",
  ", and postponing evidence preservation, session revocation, and enterprise-wide IOC blocking",
];

/**
 * @param {string} text
 */
function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * @param {string} text
 * @param {number} target
 */
function padDistractor(text, target) {
  let base = text.replace(/\.$/, "");
  if (wordCount(base) >= target) return text.endsWith(".") ? text : `${text}.`;
  for (const pad of DISTRACTOR_PADS) {
    const candidate = `${base}${pad}`;
    if (wordCount(candidate) >= target) return candidate;
  }
  return `${base}${DISTRACTOR_PADS[DISTRACTOR_PADS.length - 1]}`;
}

/**
 * @param {{ id: string, text: string }[]} options
 * @param {string[]} correctIds
 */
export function balanceWorkshopOptions(options, correctIds) {
  const correctSet = new Set(correctIds);
  const target = Math.max(...options.map((o) => wordCount(o.text)), 0);
  return options.map((o) => {
    if (correctSet.has(o.id)) return o;
    const padded = padDistractor(o.text, target);
    return { ...o, text: padded };
  });
}
