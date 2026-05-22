/**
 * Warning flags and per-option teaching for Easy KeyTrain workshop quizzes.
 */

/**
 * @typedef {object} QuizTeachingExtra
 * @property {string[]} [warningFlags]
 * @property {Record<string, string>} [optionNotes]
 */

/** @type {Record<string, Record<string, QuizTeachingExtra>>} */
const CUSTOM = {
  "keytrain-identity-access": {
    q1: {
      warningFlags: [
        "Authentication = proving identity (login); authorization = what you may do after login.",
        "If an option swaps those definitions, it is a trap.",
        "Deleting files is an authorization action—not what authentication means.",
      ],
      optionNotes: {
        a: "Correct: login vs access rights are different steps.",
        b: "They are related but not the same—authentication comes first.",
        c: "Authorization covers permissions, not password storage alone.",
        d: "Authentication does not decide file deletion—that is authorization.",
      },
    },
    q2: {
      warningFlags: [
        "Passwords can be phished, guessed, or stolen from breaches—strength alone is not enough.",
        "MFA is a second hurdle after the password.",
        "Be skeptical of claims that MFA replaces passwords or is only for executives.",
      ],
      optionNotes: {
        a: "Correct: MFA blocks most logins even when the password is stolen.",
        b: "MFA adds to passwords; it does not remove them.",
        c: "MFA is about security, not computer performance.",
        d: "MFA protects everyday accounts—not only managers.",
      },
    },
    q3: {
      warningFlags: [
        "Unsolicited contact from a stranger asking for secrets",
        "Prize, reward, or urgency used to bypass your judgment",
        "Claims to be “support” but wants your password in chat—not on an official reset site",
        "Any request for your full password (or “half”)—legitimate orgs use secure reset flows you start yourself",
        "Public posting exposes credentials to everyone and helps criminals",
      ],
      optionNotes: {
        a: "Impersonating support is common—real IT uses portals and reset links, not DMs asking for passwords.",
        b: "Correct: refuse and contact the organization through a number or site you look up yourself.",
        c: "Partial passwords still help attackers guess or reuse the rest.",
        d: "Posting publicly spreads the secret and violates basic safety.",
      },
    },
  },
  "keytrain-email-security": {
    q3: {
      warningFlags: [
        "Unexpected attachment you were not waiting for",
        "Sender could be spoofed even if the display name looks familiar",
        "Opening files to “see if interesting” runs malware before you can think",
        "Disabling security tools removes your last line of defense",
        "Verify through a channel you initiate (phone/portal), not reply-to on the same email",
      ],
      optionNotes: {
        a: "Opening unknown attachments is how ransomware and spyware often start.",
        b: "Correct: out-of-band confirmation breaks forged sender attacks.",
        c: "Turning off antivirus helps malware, not you.",
        d: "Public sharing spreads malicious files and harms others.",
      },
    },
  },
  "keytrain-data-protection": {
    q3: {
      warningFlags: [
        "Found media in a public place—treat as untrusted",
        "Curiosity to “find the owner” can auto-run malware on plug-in",
        "Unknown USBs are a classic targeted attack path",
        "IT/security has safe processes to analyze without infecting your PC",
      ],
      optionNotes: {
        a: "Plugging in unknown drives can install malware instantly.",
        b: "Correct: hand to IT/security without connecting it to your machine.",
        c: "Sharing unknown files spreads risk to friends and work.",
        d: "Silent disposal may lose evidence; reporting is safer.",
      },
    },
  },
  "keytrain-endpoint-security": {
    q3: {
      warningFlags: [
        "Sudden file extension changes (.locked) and ransom notes",
        "Pressure to pay quickly—attackers want panic, not thinking",
        "Paying does not guarantee recovery and may fund more crime",
        "Continuing normal email can spread encryption to shares and contacts",
        "Isolate first so IT can preserve evidence and protect others",
      ],
      optionNotes: {
        a: "Immediate payment rewards criminals and may still leave data encrypted.",
        b: "Correct: disconnect/isolate and notify professionals.",
        c: "Ignoring active encryption lets damage spread.",
        d: "Public screenshots leak sensitive info and do not restore files.",
      },
    },
  },
  "keytrain-network-security": {
    q3: {
      warningFlags: [
        "Unsolicited hardware you did not order",
        "“Free” gear can hide rogue access points or packet capture",
        "Anything that touches the network needs inventory and approval",
        "Visitors should not receive unvetted devices",
      ],
      optionNotes: {
        a: "Plugging unknown gear can open backdoors on the LAN.",
        b: "Correct: IT validates what may connect.",
        c: "Passing untrusted hardware spreads risk.",
        d: "Hiding it avoids policy but leaves a threat if someone else plugs it in.",
      },
    },
  },
  "keytrain-system-hygiene": {
    q3: {
      warningFlags: [
        "Update prompts close security holes—snoozing forever leaves you exposed",
        "Attackers exploit known vulnerabilities on unpatched systems",
        "Deleting system files breaks the machine and does not patch anything",
        "Password sharing is never part of patching",
      ],
      optionNotes: {
        a: "Deferring updates indefinitely invites exploit kits.",
        b: "Correct: apply updates on a schedule you can plan for.",
        c: "Destroying system files is sabotage, not maintenance.",
        d: "Credentials are unrelated to installing security updates.",
      },
    },
  },
  "keytrain-application-security": {
    q3: {
      warningFlags: [
        "Changing an ID in the URL and seeing someone else’s data = broken authorization",
        "That is not normal caching—it is accessing another user’s records",
        "Wi-Fi speed or printers do not explain cross-account data leaks",
        "Report to the service owner so they can fix server-side checks",
      ],
      optionNotes: {
        a: "Correct: server must authorize every record on every request.",
        b: "Caching should not show another person’s private orders.",
        c: "Network performance is unrelated to IDOR flaws.",
        d: "Printer issues do not expose other users’ data in apps.",
      },
    },
  },
  "keytrain-financial-security": {
    q3: {
      warningFlags: [
        "Urgent family emergency you have not verified",
        "Gift cards and wire transfers are scam favorites (hard to reverse)",
        "Pressure to act before you call someone you already know",
        "Asking for bank passwords in email or text is never legitimate",
        "Public posts spread the scam and do not verify the story",
      ],
      optionNotes: {
        a: "Gift-card codes sent to strangers are almost always fraud.",
        b: "Correct: call the relative on a number you already trust.",
        c: "Publishing the message helps scammers, not you.",
        d: "No bank will ask for your password by email.",
      },
    },
  },
  "keytrain-physical-security": {
    q3: {
      warningFlags: [
        "A lost badge is an active key until revoked",
        "Delay gives someone else time to enter and access systems",
        "Physical access often leads to data theft or planting devices",
        "Reporting is an security control—not an HR paperwork chore only",
      ],
      optionNotes: {
        a: "Correct: disable the badge before it is misused.",
        b: "Wallpapers do not protect doors or data centers.",
        c: "Badges absolutely matter for physical and logical access.",
        d: "Security operations need to know immediately—not only HR later.",
      },
    },
  },
  "keytrain-compliance-governance": {
    q3: {
      warningFlags: [
        "Sending regulated data to the wrong recipient is a reportable incident",
        "Hiding mistakes blocks containment and required notifications",
        "Mass deletion can destroy evidence needed for investigation",
        "Social media posts can worsen legal and privacy harm",
        "Early reporting starts clock for required breach steps",
      ],
      optionNotes: {
        a: "Covering up delays help for victims and increases penalties.",
        b: "Correct: follow privacy/security reporting policy immediately.",
        c: "Deleting everything may be destruction of evidence.",
        d: "Public apologies do not replace official incident process.",
      },
    },
  },
};

/**
 * @param {{ prompt: string, options: { id: string, text: string }[], correct: string[], explanation: string }} q
 * @returns {QuizTeachingExtra}
 */
function autoFromQuiz(q) {
  /** @type {Record<string, string>} */
  const optionNotes = {};
  for (const opt of q.options) {
    optionNotes[opt.id] = q.correct.includes(opt.id)
      ? `Best fit: ${q.explanation}`
      : `Risky choice: does not align with—${q.explanation}`;
  }

  const wrong = q.options.filter((o) => !q.correct.includes(o.id));
  const warningFlags = [
    "Pause if the scenario uses urgency, fear, prizes, or secrecy",
    "Ask whether legitimate organizations actually work this way",
    `Core lesson: ${q.explanation}`,
    ...wrong.map(
      (o) =>
        `Red flag if tempted by: “${o.text.length > 72 ? `${o.text.slice(0, 69)}…` : o.text}”`
    ),
  ];

  return { optionNotes, warningFlags };
}

/**
 * @param {string} workshopId
 * @param {"q1"|"q2"|"q3"} key
 * @param {{ prompt: string, options: { id: string, text: string }[], correct: string[], explanation: string }} q
 * @returns {QuizTeachingExtra}
 */
export function getEasyQuizTeaching(workshopId, key, q) {
  const base = autoFromQuiz(q);
  const custom = CUSTOM[workshopId]?.[key];
  if (!custom) return base;
  return {
    optionNotes: { ...base.optionNotes, ...custom.optionNotes },
    warningFlags: custom.warningFlags ?? base.warningFlags,
  };
}
