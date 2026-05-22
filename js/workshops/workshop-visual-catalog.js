/**
 * Interactive visual steps per Key Training category (how + why).
 * Easy / Medium / Hard use separate visual sets — see workshop-visual-medium-hard.js.
 */
import { VISUALS_MEDIUM, VISUALS_HARD } from "./workshop-visual-medium-hard.js";
import {
  svgAuthFlow,
  svgBuildingBadge,
  svgMfaCompare,
  svgEmailPath,
  svgPhishLayers,
  svgDataStates,
  svgAppLayers,
  svgNetworkZones,
  svgEndpointInfection,
  svgWireVerify,
  svgPhysicalDoor,
  svgHipaaFlow,
} from "./workshop-visual-svgs.js";

/**
 * @typedef {import('./workshop-visual-engine.js').WorkshopVisual} WorkshopVisual
 * @typedef {import('../workshop-runner.js').WorkshopStep} WorkshopStep
 */

/**
 * @param {string} id
 * @param {string} title
 * @param {WorkshopVisual} visual
 * @returns {WorkshopStep}
 */
function visualStep(id, title, visual) {
  return {
    id,
    type: "visual",
    title,
    visual,
  };
}

/** @type {Record<string, WorkshopStep[]>} */
const VISUALS_EASY = {
  "keytrain-identity-access": [
    visualStep("viz-intro-building", "See it: the building analogy", {
      kind: "hotspot",
      subtitle: "Tap each part — learn how identity security maps to real life.",
      baseSvg: svgBuildingBadge(),
      hotspots: [
        {
          id: "1",
          label: "Front desk (authentication)",
          why: "Proves you are who you claim to be before you enter—like a password, MFA, or ID check.",
          x: 14,
          y: 42,
        },
        {
          id: "2",
          label: "Badge (authorization)",
          why: "Decides which doors you may open. Too much access means one stolen login hurts everyone.",
          x: 52,
          y: 58,
        },
        {
          id: "3",
          label: "Attacker with stolen login",
          why: "Most breaches are not “hacking the wall”—they reuse a real identity. That is why MFA and monitoring matter.",
          x: 72,
          y: 38,
        },
      ],
    }),
    visualStep("viz-auth-flow", "How sign-in works (step by step)", {
      kind: "flow",
      subtitle: "Walk through a modern login — understand the how before the why.",
      frames: [
        {
          label: "Step 1: You open the app and enter your username",
          why: "The app does not trust you yet—it only knows which account you claim.",
          svg: svgAuthFlow(0),
        },
        {
          label: "Step 2: Your password goes to the identity provider",
          why: "Central login means one place to enforce MFA, lockouts, and logging.",
          svg: svgAuthFlow(1),
        },
        {
          label: "Step 3: MFA checks your phone or security key",
          why: "Even with a stolen password, the attacker still needs your second factor.",
          svg: svgAuthFlow(2),
        },
        {
          label: "Step 4: The app grants access only to what your role allows",
          why: "Authorization is separate from login—being signed in does not mean you may do everything.",
          svg: svgAuthFlow(3),
        },
      ],
    }),
    visualStep("viz-mfa-compare", "Why MFA matters (compare)", {
      kind: "compare",
      subtitle: "Same stolen password — two different outcomes.",
      leftSvg: svgMfaCompare(false),
      rightSvg: svgMfaCompare(true),
      left: {
        title: "Password only",
        body: "Attacker phishes your password and signs in as you. There is no second check to stop them.",
      },
      right: {
        title: "Password + MFA",
        body: "Attacker has the password but cannot approve MFA on your phone. Sign-in fails.",
      },
    }),
    visualStep("viz-incident-order", "How to respond to a strange sign-in alert", {
      kind: "order",
      subtitle: "Strange sign-in alert — rank the actions you would actually take.",
      orderItems: [
        { id: "deny", label: "Deny unknown MFA / sign-in prompts" },
        { id: "report", label: "Report to IT or security" },
        { id: "reset", label: "Change password from a clean device" },
        { id: "share", label: "Post screenshot on public social media" },
      ],
      correctOrder: ["deny", "report", "reset"],
      orderSuccess:
        "Deny first to block the attacker, report so defenders can hunt, then reset credentials safely.",
      orderStepNotes: {
        deny:
          "If you did not start the sign-in, deny the prompt immediately so the attacker cannot complete MFA.",
        report:
          "Notify IT or security right away with time, device, and location—they need to investigate while access is blocked.",
        reset:
          "After denying and reporting, change your password from a trusted device so stolen sessions lose access.",
      },
      orderDistractorNotes: {
        share:
          "Public posts leak details attackers can use, may violate policy, and do not stop the account takeover.",
      },
    }),
  ],

  "keytrain-email-security": [
    visualStep("viz-email-path", "How email travels", {
      kind: "flow",
      subtitle: "Follow a message from sender to your inbox.",
      frames: [
        {
          label: "Someone composes a message and picks a From address",
          why: "The display name can lie; the real address is what security tools inspect.",
          svg: svgEmailPath(),
        },
        {
          label: "Mail passes through your organization’s gateway",
          why: "Filters, SPF/DKIM/DMARC checks, and quarantine happen here—not on your laptop alone.",
          svg: svgEmailPath(),
        },
        {
          label: "You receive it—but you are still the last line of defense",
          why: "No filter catches everything. Reporting phish helps protect coworkers.",
          svg: svgEmailPath(),
        },
      ],
    }),
    visualStep("viz-phish-layers", "Why one control is not enough", {
      kind: "hotspot",
      subtitle: "Tap each layer of email defense.",
      baseSvg: svgPhishLayers(),
      hotspots: [
        {
          id: "1",
          label: "Gateway filters",
          why: "Block known bad links and attachments—but attackers constantly change tactics.",
          x: 50,
          y: 18,
        },
        {
          id: "2",
          label: "Report button",
          why: "Removes copies from mailboxes and teaches filters what your org is seeing.",
          x: 50,
          y: 35,
        },
        {
          id: "3",
          label: "Verify the address",
          why: "CEO name + external address is a classic BEC trick.",
          x: 50,
          y: 52,
        },
        {
          id: "4",
          label: "You",
          why: "Urgent tone, odd links, and payment changes deserve pause—not reflex clicks.",
          x: 50,
          y: 72,
        },
      ],
    }),
    visualStep("viz-bec-wire", "How to verify a payment change (ordering)", {
      kind: "order",
      subtitle: "New bank details in email — set the order you would follow before paying.",
      orderItems: [
        { id: "call", label: "Call vendor using number in ERP, not in the email" },
        { id: "pay", label: "Process wire after verbal confirmation" },
        { id: "reply", label: "Reply to the email thread asking if it is real" },
        { id: "logo", label: "Approve because the logo looks correct" },
      ],
      correctOrder: ["call", "pay"],
      orderSuccess:
        "Out-of-band verification breaks BEC—attackers control email but not your phone book on file.",
      orderStepNotes: {
        call:
          "Use a phone number from your ERP or vendor master file—not from the email thread—to confirm bank changes.",
        pay: "Wire only after verbal confirmation on that trusted number; document who you spoke with.",
      },
      orderDistractorNotes: {
        reply:
          "Replying in the compromised thread gives the attacker more chances to pressure or spoof you.",
        logo:
          "Logos and formatting are trivial to fake; they are not evidence the payment request is legitimate.",
      },
    }),
  ],

  "keytrain-data-protection": [
    visualStep("viz-data-states", "Three states of data", {
      kind: "flow",
      subtitle: "Click through — each state needs different protection.",
      frames: [
        {
          label: "Data at rest — sitting on disk or in a database",
          why: "Encryption (BitLocker, database TDE) protects if a laptop or drive is stolen.",
          svg: svgDataStates("rest"),
        },
        {
          label: "Data in use — while you are logged in and working",
          why: "Lock your screen; malware on an unlocked session can still read files.",
          svg: svgDataStates("use"),
        },
        {
          label: "Data in transit — moving across Wi‑Fi or the internet",
          why: "TLS and VPNs stop casual eavesdropping on the wire.",
          svg: svgDataStates("transit"),
        },
      ],
    }),
    visualStep("viz-dlp-compare", "Sending work data home", {
      kind: "compare",
      baseSvg: svgDataStates("use"),
      left: {
        title: "Personal webmail",
        body: "Bypasses company DLP and retention. A leak may become a breach with no audit trail.",
      },
      right: {
        title: "Approved secure transfer",
        body: "Logged, scanned, and policy-aligned—security can help instead of only saying no.",
      },
    }),
  ],

  "keytrain-endpoint-security": [
    visualStep("viz-malware-flow", "How malware often spreads", {
      kind: "flow",
      subtitle: "See the chain so you can break it early.",
      frames: [
        {
          label: "1. You click a link or open an attachment",
          why: "Social engineering gets past technology—think before opening.",
          svg: svgEndpointInfection(0),
        },
        {
          label: "2. Malware runs on your device",
          why: "EDR looks for suspicious processes; allowlisting blocks unknown apps.",
          svg: svgEndpointInfection(1),
        },
        {
          label: "3. It phones home to command-and-control",
          why: "Beaconing lets attackers send commands—network monitoring can detect this.",
          svg: svgEndpointInfection(2),
        },
        {
          label: "4. It may spread to file shares or other PCs",
          why: "Isolation and patching limit lateral movement.",
          svg: svgEndpointInfection(3),
        },
      ],
    }),
    visualStep("viz-ransomware-order", "Ransomware: what to do first", {
      kind: "order",
      subtitle: "Files are encrypting — click responses in the order you would take them.",
      orderItems: [
        { id: "iso", label: "Disconnect from network / isolate device" },
        { id: "ir", label: "Call incident response or IT" },
        { id: "pay", label: "Pay ransom immediately without telling anyone" },
        { id: "reboot", label: "Reboot repeatedly until files return" },
      ],
      correctOrder: ["iso", "ir"],
      orderSuccess: "Contain first to protect others; IR preserves evidence and guides recovery.",
      orderStepNotes: {
        iso:
          "Disconnect or isolate the device to slow spread to file shares and other workstations.",
        ir:
          "Call incident response or IT immediately—they guide containment, backups, and whether to pay.",
      },
      orderDistractorNotes: {
        pay:
          "Paying without IR involvement does not guarantee decryption and may violate policy or law.",
        reboot:
          "Repeated reboots can destroy forensic evidence and rarely restores encrypted files.",
      },
    }),
  ],

  "keytrain-network-security": [
    visualStep("viz-zones", "Network zones (hotspot)", {
      kind: "hotspot",
      subtitle: "Why segmentation limits damage.",
      baseSvg: svgNetworkZones(),
      hotspots: [
        {
          id: "1",
          label: "Trusted LAN",
          why: "Workstations and internal apps live here—still need monitoring, not implicit trust.",
          x: 22,
          y: 45,
        },
        {
          id: "2",
          label: "DMZ",
          why: "Public-facing servers sit between internal and internet—controlled entry point.",
          x: 48,
          y: 45,
        },
        {
          id: "3",
          label: "Internet",
          why: "Untrusted—ingress filtering and egress monitoring matter.",
          x: 78,
          y: 45,
        },
      ],
    }),
    visualStep("viz-beacon", "Spotting beaconing (concept)", {
      kind: "compare",
      baseSvg: svgNetworkZones(),
      left: {
        title: "Normal browsing",
        body: "Irregular bursts, varied sites, larger downloads.",
      },
      right: {
        title: "Possible C2 beacon",
        body: "Small, regular connections to one rare domain—worth investigating.",
      },
    }),
  ],

  "keytrain-system-hygiene": [
    visualStep("viz-patch-flow", "Patch lifecycle", {
      kind: "flow",
      frames: [
        {
          label: "Vendor publishes a security update",
          why: "Attackers read the same bulletins—delay gives them a head start.",
          svg: svgEndpointInfection(0),
        },
        {
          label: "Your team tests and approves",
          why: "Change control avoids breaking payroll—but emergency paths exist for critical CVEs.",
          svg: svgEndpointInfection(1),
        },
        {
          label: "Devices install the patch; compliance is measured",
          why: "Unpatched devices are the weak door attackers walk through.",
          svg: svgEndpointInfection(2),
        },
      ],
    }),
  ],

  "keytrain-application-security": [
    visualStep("viz-app-layers", "Inside a web app", {
      kind: "flow",
      frames: [
        {
          label: "User input hits the application",
          why: "Untrusted input is the root of injection flaws—validate and parameterize here.",
          svg: svgAppLayers("user"),
        },
        {
          label: "Application logic enforces rules",
          why: "Authorization must be server-side; hidden buttons in the browser are not security.",
          svg: svgAppLayers("app"),
        },
        {
          label: "Database stores sensitive data",
          why: "Least-privilege DB accounts limit damage if the app is compromised.",
          svg: svgAppLayers("db"),
        },
      ],
    }),
    visualStep("viz-waf-compare", "WAF vs fixing code", {
      kind: "compare",
      baseSvg: svgAppLayers("app"),
      left: {
        title: "WAF only",
        body: "Blocks some attacks at the edge but internal traffic and logic bugs remain.",
      },
      right: {
        title: "Secure code + WAF",
        body: "Defense in depth—fix SQLi/ XSS at source and keep monitoring at the perimeter.",
      },
    }),
  ],

  "keytrain-financial-security": [
    visualStep("viz-wire", "Verify before you wire", {
      kind: "flow",
      subtitle: "How finance teams stop invoice fraud.",
      frames: [
        {
          label: "Email claims new bank details",
          why: "Sender can be forged—treat payment instructions as untrusted until verified.",
          svg: svgWireVerify(),
        },
        {
          label: "Call the vendor on a known number",
          why: "Out-of-band breaks BEC: attacker owns email, not your ERP phone list.",
          svg: svgWireVerify(),
        },
        {
          label: "Process payment only after confirmation",
          why: "Dual approval and vendor master data catch look-alike domains.",
          svg: svgWireVerify(),
        },
      ],
    }),
    visualStep("viz-fraud-order", "Suspicious invoice — your move", {
      kind: "order",
      subtitle: "Invoice looks wrong — set the order of actions before any payment goes out.",
      orderItems: [
        { id: "hold", label: "Hold payment and verify vendor" },
        { id: "soc", label: "Alert AP manager and security" },
        { id: "pay", label: "Pay fast to avoid late fees" },
        { id: "fwd", label: "Forward invoice to personal email" },
      ],
      correctOrder: ["hold", "soc"],
      orderSuccess: "Stop money movement first; then involve people who can hunt for more fraud.",
      orderStepNotes: {
        hold:
          "Pause the payment until vendor identity and bank details are verified out of band.",
        soc:
          "Alert AP leadership and security so they can check for other fraudulent invoices and accounts.",
      },
      orderDistractorNotes: {
        pay:
          "Paying quickly to avoid late fees is how BEC succeeds—fraudsters rely on urgency.",
        fwd:
          "Forwarding to personal email bypasses DLP and retention; keep evidence in approved systems.",
      },
    }),
  ],

  "keytrain-physical-security": [
    visualStep("viz-tailgate", "Tailgating scenario", {
      kind: "hotspot",
      subtitle: "What could go wrong at the door?",
      baseSvg: svgPhysicalDoor(),
      hotspots: [
        {
          id: "1",
          label: "You badge in",
          why: "Your badge proves you belong—but only if nobody slips in behind you.",
          x: 22,
          y: 55,
        },
        {
          id: "2",
          label: "Door held open",
          why: "Politeness is exploited—each person should badge individually when policy requires it.",
          x: 50,
          y: 40,
        },
        {
          id: "3",
          label: "Unknown person enters",
          why: "Challenge politely or notify security; report lost badges immediately.",
          x: 78,
          y: 55,
        },
      ],
    }),
    visualStep("viz-device-theft", "Stolen laptop", {
      kind: "compare",
      baseSvg: svgPhysicalDoor(),
      left: {
        title: "No encryption",
        body: "Thief reads the disk offline—game over for data at rest.",
      },
      right: {
        title: "Full-disk encryption",
        body: "Disk is gibberish without key—but wipe remotely and rotate passwords if logged in.",
      },
    }),
  ],

  "keytrain-compliance-governance": [
    visualStep("viz-hipaa-flow", "Where PHI flows", {
      kind: "flow",
      frames: [
        {
          label: "Patient data enters the clinic system",
          why: "Collect only what is needed—minimum necessary reduces breach impact.",
          svg: svgHipaaFlow(),
        },
        {
          label: "Billing and operations may need some fields",
          why: "Role-based access stops front desk from exporting full charts.",
          svg: svgHipaaFlow(),
        },
        {
          label: "Vendors need a BAA before touching PHI",
          why: "Contracts spell out security duties—no BAA means no sharing.",
          svg: svgHipaaFlow(),
        },
      ],
    }),
    visualStep("viz-audit-order", "Audit prep: sensible order", {
      kind: "order",
      subtitle: "Audit is coming — click tasks in the order your team should do them.",
      orderItems: [
        { id: "map", label: "Map controls to systems you actually use" },
        { id: "evidence", label: "Pull samples from tickets and logs" },
        { id: "fabricate", label: "Create evidence the night before the audit" },
        { id: "ignore", label: "Skip policies that are inconvenient" },
      ],
      correctOrder: ["map", "evidence"],
      orderSuccess: "Audits test whether controls run year-round—not whether you can rush paperwork.",
      orderStepNotes: {
        map:
          "List which systems and teams actually implement each control so evidence requests are realistic.",
        evidence:
          "Pull real tickets, logs, and change records that show controls ran during the audit period.",
      },
      orderDistractorNotes: {
        fabricate:
          "Inventing evidence is fraud and will fail under scrutiny—auditors compare stories to systems.",
        ignore:
          "Skipping inconvenient policies creates gaps auditors and regulators will find.",
      },
    }),
  ],
};

/**
 * @param {string} categoryId
 * @param {'easy'|'medium'|'hard'} [level]
 * @returns {WorkshopStep[]}
 */
export function getCategoryVisualSteps(categoryId, level = "medium") {
  if (level === "easy") return VISUALS_EASY[categoryId] ?? [];
  if (level === "hard") return VISUALS_HARD[categoryId] ?? [];
  return VISUALS_MEDIUM[categoryId] ?? [];
}

/**
 * @param {WorkshopStep[]} steps
 * @param {number} count
 * @returns {string[]}
 */
function lessonAnchorIds(steps, count) {
  return steps.filter((s) => s.type === "lesson").slice(0, count).map((s) => s.id);
}

/**
 * @param {'easy'|'medium'|'hard'} level
 * @param {WorkshopStep[]} steps
 * @returns {string[]}
 */
function defaultAnchorsForLevel(level, steps) {
  if (level === "hard") {
    const hard = ["context", "deep-dive"].filter((id) => steps.some((s) => s.id === id));
    return hard.length ? hard : lessonAnchorIds(steps, 2);
  }
  if (level === "medium") {
    const intro = steps.some((s) => s.id === "intro") ? ["intro"] : [];
    const lessons = lessonAnchorIds(steps, 2).filter((id) => id !== "intro");
    return [...intro, ...lessons].slice(0, 3);
  }
  return ["intro"];
}

/**
 * Insert level-specific visuals after lesson anchors (not dumped only at the end).
 * @param {string} categoryId
 * @param {WorkshopStep[]} steps
 * @param {{ level?: 'easy'|'medium'|'hard', maxVisuals?: number, anchors?: string[] }} [opts]
 * @returns {WorkshopStep[]}
 */
export function enrichStepsWithVisuals(categoryId, steps, opts = {}) {
  const level = opts.level ?? "medium";
  const visuals = getCategoryVisualSteps(categoryId, level);
  const max = opts.maxVisuals ?? visuals.length;
  const picked = visuals.slice(0, max);
  if (picked.length === 0) return steps;

  const anchors = opts.anchors ?? defaultAnchorsForLevel(level, steps);
  const out = [];
  let visualIdx = 0;
  let anchorIdx = 0;

  for (const step of steps) {
    out.push(step);
    const anchor = anchors[anchorIdx];
    if (anchor && step.id === anchor && visualIdx < picked.length) {
      out.push(picked[visualIdx++]);
      anchorIdx += 1;
    }
  }

  while (visualIdx < picked.length) {
    const summaryIdx = out.findIndex(
      (s) => s.type === "summary" || s.id === "done" || s.id === "wrap"
    );
    const insertAt = summaryIdx >= 0 ? summaryIdx : out.length;
    out.splice(insertAt, 0, picked[visualIdx++]);
  }

  return out;
}

/**
 * Interleave easy-only visuals after intro and each concept lesson.
 * @param {string} categoryId
 * @param {WorkshopStep[]} steps
 * @returns {WorkshopStep[]}
 */
export function interleaveConceptVisuals(categoryId, steps) {
  const visuals = getCategoryVisualSteps(categoryId, "easy");
  if (!visuals.length) return steps;

  const out = [];
  let v = 0;

  for (const step of steps) {
    out.push(step);
    if (step.id === "intro" && v < visuals.length) {
      out.push(visuals[v++]);
    } else if (step.id?.startsWith("concept-") && v < visuals.length) {
      out.push(visuals[v++]);
    }
  }

  while (v < visuals.length) {
    const idx = out.findIndex((s) => s.id === "real-life" || s.type === "summary");
    out.splice(idx >= 0 ? idx : out.length, 0, visuals[v++]);
  }

  return out;
}
