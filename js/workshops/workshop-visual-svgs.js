/**
 * Inline SVG diagrams for KeyTrain workshop interactives.
 */

const C = {
  bg: "#1a2634",
  panel: "#243447",
  accent: "#ff9900",
  safe: "#3fb950",
  risk: "#f85149",
  text: "#e6edf3",
  muted: "#8b9cb3",
  line: "#4a6278",
};

/**
 * @param {string} inner
 * @param {number} [w]
 * @param {number} [h]
 */
export function svgWrap(inner, w = 520, h = 220) {
  return `<svg class="workshop-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${inner}</svg>`;
}

export function svgBuildingBadge() {
  return svgWrap(`
    <rect x="20" y="40" width="200" height="160" rx="8" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
    <text x="120" y="70" text-anchor="middle" fill="${C.text}" font-size="14" font-weight="700">Building</text>
    <rect x="50" y="90" width="60" height="50" rx="4" fill="${C.bg}" stroke="${C.accent}" stroke-width="2"/>
    <text x="80" y="120" text-anchor="middle" fill="${C.accent}" font-size="11">Front desk</text>
    <text x="80" y="135" text-anchor="middle" fill="${C.muted}" font-size="9">Authentication</text>
    <rect x="130" y="100" width="70" height="35" rx="4" fill="${C.bg}" stroke="${C.safe}" stroke-width="2"/>
    <text x="165" y="122" text-anchor="middle" fill="${C.safe}" font-size="10">Your badge</text>
    <path d="M165 135 L165 175" stroke="${C.safe}" stroke-width="2" stroke-dasharray="4"/>
    <rect x="130" y="175" width="70" height="25" rx="3" fill="${C.bg}" stroke="${C.line}"/>
    <text x="165" y="192" text-anchor="middle" fill="${C.muted}" font-size="9">Authorization</text>
    <circle cx="380" cy="110" r="45" fill="${C.panel}" stroke="${C.risk}" stroke-width="2"/>
    <text x="380" y="105" text-anchor="middle" fill="${C.risk}" font-size="11">Attacker</text>
    <text x="380" y="122" text-anchor="middle" fill="${C.muted}" font-size="9">stolen login</text>
    <path d="M335 110 L230 110" stroke="${C.risk}" stroke-width="2" marker-end="url(#arr)"/>
    <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${C.risk}"/></marker></defs>
  `);
}

/** @param {number} step 0-3 */
export function svgAuthFlow(step) {
  const user = `<circle cx="70" cy="110" r="28" fill="${C.panel}" stroke="${C.accent}" stroke-width="2"/><text x="70" y="115" text-anchor="middle" fill="${C.text}" font-size="11">You</text>`;
  const app = `<rect x="200" y="75" width="120" height="70" rx="8" fill="${C.panel}" stroke="${step >= 1 ? C.accent : C.line}" stroke-width="2"/><text x="260" y="105" text-anchor="middle" fill="${C.text}" font-size="12">App / Website</text>`;
  const idp = `<rect x="380" y="75" width="120" height="70" rx="8" fill="${C.panel}" stroke="${step >= 2 ? C.accent : C.line}" stroke-width="2"/><text x="440" y="100" text-anchor="middle" fill="${C.text}" font-size="11">Identity</text><text x="440" y="118" text-anchor="middle" fill="${C.muted}" font-size="9">provider</text>`;
  const phone =
    step >= 2
      ? `<rect x="400" y="165" width="80" height="45" rx="6" fill="${C.panel}" stroke="${C.safe}" stroke-width="2"/><text x="440" y="192" text-anchor="middle" fill="${C.safe}" font-size="10">MFA ✓</text>`
      : "";
  const lock = step >= 3 ? `<text x="260" y="168" text-anchor="middle" fill="${C.safe}" font-size="13" font-weight="700">Access granted</text>` : "";
  const arrows =
    step >= 1
      ? `<path d="M98 110 L200 110" stroke="${C.accent}" stroke-width="2"/>`
      : `<path d="M98 110 L200 110" stroke="${C.line}" stroke-width="1" stroke-dasharray="4"/>`;
  const arrows2 =
    step >= 2
      ? `<path d="M320 110 L380 110" stroke="${C.accent}" stroke-width="2"/>`
      : "";
  return svgWrap(`${user}${arrows}${app}${arrows2}${idp}${phone}${lock}`);
}

/** @param {boolean} safe */
export function svgMfaCompare(safe) {
  const color = safe ? C.safe : C.risk;
  const label = safe ? "Blocked at MFA" : "Password stolen";
  return svgWrap(`
    <rect x="40" y="60" width="440" height="120" rx="10" fill="${C.panel}" stroke="${color}" stroke-width="2"/>
    <circle cx="100" cy="120" r="30" fill="${C.bg}" stroke="${C.text}" stroke-width="2"/>
    <text x="100" y="125" text-anchor="middle" fill="${C.text}" font-size="10">User</text>
    <rect x="180" y="85" width="100" height="70" rx="6" fill="${C.bg}" stroke="${C.line}"/>
    <text x="230" y="115" text-anchor="middle" fill="${C.muted}" font-size="10">Password</text>
    <text x="230" y="130" text-anchor="middle" fill="${safe ? C.safe : C.risk}" font-size="10">${safe ? "✓ entered" : "✗ phished"}</text>
    <rect x="320" y="85" width="130" height="70" rx="6" fill="${C.bg}" stroke="${color}" stroke-width="2"/>
    <text x="385" y="115" text-anchor="middle" fill="${color}" font-size="11" font-weight="700">${label}</text>
    <text x="385" y="132" text-anchor="middle" fill="${C.muted}" font-size="9">${safe ? "No phone access" : "Sign-in completes"}</text>
  `, 520, 200);
}

export function svgEmailPath() {
  return svgWrap(`
    <rect x="30" y="90" width="90" height="50" rx="6" fill="${C.panel}" stroke="${C.accent}"/><text x="75" y="120" text-anchor="middle" fill="${C.text}" font-size="10">Sender</text>
    <rect x="160" y="70" width="100" height="90" rx="6" fill="${C.panel}" stroke="${C.line}"/><text x="210" y="100" text-anchor="middle" fill="${C.text}" font-size="10">Mail</text><text x="210" y="118" text-anchor="middle" fill="${C.muted}" font-size="9">gateway</text>
    <rect x="300" y="90" width="90" height="50" rx="6" fill="${C.panel}" stroke="${C.safe}"/><text x="345" y="120" text-anchor="middle" fill="${C.text}" font-size="10">You</text>
    <path d="M120 115 L160 115" stroke="${C.accent}" stroke-width="2"/><path d="M260 115 L300 115" stroke="${C.safe}" stroke-width="2"/>
    <rect x="400" y="40" width="100" height="40" rx="4" fill="${C.bg}" stroke="${C.risk}" stroke-width="2"/><text x="450" y="65" text-anchor="middle" fill="${C.risk}" font-size="9">Fake domain</text>
    <path d="M450 80 L345 90" stroke="${C.risk}" stroke-width="1" stroke-dasharray="4"/>
  `);
}

export function svgPhishLayers() {
  return svgWrap(`
    <rect x="40" y="30" width="440" height="28" rx="4" fill="${C.safe}" opacity="0.25"/><text x="260" y="49" text-anchor="middle" fill="${C.safe}" font-size="11">Filter / block bad links</text>
    <rect x="40" y="68" width="440" height="28" rx="4" fill="${C.accent}" opacity="0.25"/><text x="260" y="87" text-anchor="middle" fill="${C.accent}" font-size="11">Report phish — remove copies</text>
    <rect x="40" y="106" width="440" height="28" rx="4" fill="${C.accent}" opacity="0.35"/><text x="260" y="125" text-anchor="middle" fill="${C.text}" font-size="11">Verify sender address (not display name)</text>
    <rect x="40" y="144" width="440" height="28" rx="4" fill="${C.panel}" stroke="${C.line}"/><text x="260" y="163" text-anchor="middle" fill="${C.muted}" font-size="11">You — last line of defense</text>
    <text x="260" y="195" text-anchor="middle" fill="${C.text}" font-size="10">Defense in depth: many layers, not one tool</text>
  `, 520, 210);
}

export function svgDataStates(active) {
  const states = [
    { id: "rest", label: "At rest (disk)", x: 60 },
    { id: "use", label: "In use (logged in)", x: 200 },
    { id: "transit", label: "In transit (network)", x: 340 },
  ];
  const nodes = states
    .map((s) => {
      const on = active === s.id;
      return `<rect x="${s.x}" y="80" width="120" height="70" rx="8" fill="${C.panel}" stroke="${on ? C.accent : C.line}" stroke-width="${on ? 3 : 1}"/><text x="${s.x + 60}" y="115" text-anchor="middle" fill="${on ? C.accent : C.text}" font-size="11">${s.label}</text>`;
    })
    .join("");
  return svgWrap(`${nodes}<text x="260" y="180" text-anchor="middle" fill="${C.muted}" font-size="10">Protect each state differently</text>`, 520, 200);
}

export function svgAppLayers(highlight) {
  const layers = [
    { id: "user", label: "Browser / user", y: 30 },
    { id: "app", label: "Application", y: 75 },
    { id: "db", label: "Database", y: 120 },
  ];
  const rects = layers
    .map((l) => {
      const on = highlight === l.id;
      return `<rect x="140" y="${l.y}" width="240" height="36" rx="6" fill="${C.panel}" stroke="${on ? C.accent : C.line}" stroke-width="${on ? 3 : 1}"/><text x="260" y="${l.y + 22}" text-anchor="middle" fill="${on ? C.accent : C.text}" font-size="11">${l.label}</text>`;
    })
    .join("");
  const arrow =
    highlight === "user"
      ? `<path d="M80 48 L140 48" stroke="${C.risk}" stroke-width="2"/><text x="50" y="52" fill="${C.risk}" font-size="9">input</text>`
      : "";
  return svgWrap(`${rects}${arrow}`, 520, 180);
}

export function svgNetworkZones() {
  return svgWrap(`
    <rect x="30" y="50" width="140" height="130" rx="8" fill="${C.bg}" stroke="${C.safe}" stroke-width="2"/><text x="100" y="80" text-anchor="middle" fill="${C.safe}" font-size="11">Trusted LAN</text>
    <rect x="200" y="50" width="120" height="130" rx="8" fill="${C.panel}" stroke="${C.accent}" stroke-width="2"/><text x="260" y="80" text-anchor="middle" fill="${C.accent}" font-size="11">DMZ</text>
    <rect x="350" y="50" width="140" height="130" rx="8" fill="${C.bg}" stroke="${C.risk}" stroke-width="2"/><text x="420" y="80" text-anchor="middle" fill="${C.risk}" font-size="11">Internet</text>
    <path d="M170 115 L200 115" stroke="${C.line}" stroke-width="2"/><path d="M320 115 L350 115" stroke="${C.line}" stroke-width="2"/>
  `);
}

export function svgEndpointInfection(step) {
  const labels = ["Email link", "Malware runs", "Calls home", "Spreads"];
  const x = 50 + step * 110;
  const nodes = labels
    .map((lb, i) => {
      const on = i <= step;
      return `<circle cx="${50 + i * 110}" cy="110" r="32" fill="${C.panel}" stroke="${on ? (i === step ? C.accent : C.safe) : C.line}" stroke-width="2"/><text x="${50 + i * 110}" y="115" text-anchor="middle" fill="${on ? C.text : C.muted}" font-size="9">${lb}</text>`;
    })
    .join("");
  return svgWrap(`${nodes}`, 520, 200);
}

export function svgWireVerify() {
  return svgWrap(`
    <rect x="40" y="70" width="100" height="60" rx="6" fill="${C.panel}" stroke="${C.line}"/><text x="90" y="105" text-anchor="middle" fill="${C.text}" font-size="10">Email</text>
    <text x="200" y="100" text-anchor="middle" fill="${C.risk}" font-size="18">?</text>
    <rect x="260" y="70" width="120" height="60" rx="6" fill="${C.panel}" stroke="${C.safe}" stroke-width="2"/><text x="320" y="95" text-anchor="middle" fill="${C.safe}" font-size="10">Phone call</text><text x="320" y="112" text-anchor="middle" fill="${C.muted}" font-size="8">number on file</text>
    <rect x="410" y="70" width="80" height="60" rx="6" fill="${C.panel}" stroke="${C.accent}"/><text x="450" y="105" text-anchor="middle" fill="${C.text}" font-size="10">Pay</text>
    <path d="M140 100 L180 100" stroke="${C.risk}" stroke-dasharray="4"/><path d="M380 100 L410 100" stroke="${C.safe}" stroke-width="2"/>
  `);
}

export function svgPhysicalDoor() {
  return svgWrap(`
    <rect x="180" y="40" width="160" height="150" rx="4" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
    <rect x="220" y="80" width="80" height="100" fill="${C.bg}" stroke="${C.accent}"/>
    <circle cx="290" cy="130" r="5" fill="${C.accent}"/>
    <circle cx="120" cy="130" r="22" fill="${C.panel}" stroke="${C.safe}"/><text x="120" y="135" text-anchor="middle" fill="${C.text}" font-size="9">You</text>
    <circle cx="400" cy="130" r="22" fill="${C.panel}" stroke="${C.risk}"/><text x="400" y="135" text-anchor="middle" fill="${C.risk}" font-size="9">Stranger</text>
    <path d="M142 130 L220 130" stroke="${C.risk}" stroke-width="2" stroke-dasharray="5"/>
    <text x="260" y="30" text-anchor="middle" fill="${C.muted}" font-size="10">Tailgating — one swipe, two people</text>
  `);
}

export function svgHipaaFlow() {
  return svgWrap(`
    <ellipse cx="80" cy="110" rx="50" ry="35" fill="${C.panel}" stroke="${C.accent}"/><text x="80" y="115" text-anchor="middle" fill="${C.text}" font-size="10">Patient</text>
    <rect x="160" y="85" width="90" height="50" rx="6" fill="${C.panel}" stroke="${C.line}"/><text x="205" y="115" text-anchor="middle" fill="${C.text}" font-size="9">Clinic EHR</text>
    <rect x="280" y="85" width="90" height="50" rx="6" fill="${C.panel}" stroke="${C.line}"/><text x="325" y="110" text-anchor="middle" fill="${C.text}" font-size="9">Billing</text>
    <rect x="400" y="85" width="90" height="50" rx="6" fill="${C.panel}" stroke="${C.safe}"/><text x="445" y="110" text-anchor="middle" fill="${C.safe}" font-size="9">BAA vendor</text>
    <path d="M130 110 L160 110" stroke="${C.accent}"/><path d="M250 110 L280 110" stroke="${C.line}"/><path d="M370 110 L400 110" stroke="${C.safe}"/>
    <text x="260" y="165" text-anchor="middle" fill="${C.muted}" font-size="10">Minimum necessary at each hop</text>
  `);
}
