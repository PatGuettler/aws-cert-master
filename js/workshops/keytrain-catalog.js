/**
 * KeyTrain training categories (10 cybersecurity domains).
 */

/** @typedef {{ id: string, name: string, code: string, tagline: string }} KeytrainCategory */

/** @type {KeytrainCategory[]} */
export const KEYTRAIN_CATEGORIES = [
  {
    id: "keytrain-identity-access",
    name: "Identity & Access Security",
    code: "KT-IAS",
    tagline: "Who can sign in, and what they are allowed to do.",
  },
  {
    id: "keytrain-email-security",
    name: "Email Security",
    code: "KT-EMS",
    tagline: "Safe use of email and spotting fake messages.",
  },
  {
    id: "keytrain-data-protection",
    name: "Data Protection",
    code: "KT-DP",
    tagline: "Keeping private information private.",
  },
  {
    id: "keytrain-endpoint-security",
    name: "Endpoint Security",
    code: "KT-EPS",
    tagline: "Keeping phones, tablets, and computers safe.",
  },
  {
    id: "keytrain-network-security",
    name: "Network Security",
    code: "KT-NET",
    tagline: "How devices talk to each other safely on a network.",
  },
  {
    id: "keytrain-system-hygiene",
    name: "System Hygiene",
    code: "KT-SYS",
    tagline: "Updates, clean settings, and healthy software.",
  },
  {
    id: "keytrain-application-security",
    name: "Application Security",
    code: "KT-APP",
    tagline: "Safety in apps and websites you use every day.",
  },
  {
    id: "keytrain-financial-security",
    name: "Financial Security",
    code: "KT-FIN",
    tagline: "Protecting money, payments, and invoices from tricks.",
  },
  {
    id: "keytrain-physical-security",
    name: "Physical Security",
    code: "KT-PHY",
    tagline: "Locks, badges, and protecting devices in the real world.",
  },
  {
    id: "keytrain-compliance-governance",
    name: "Compliance & Governance",
    code: "KT-CG",
    tagline: "Following rules that protect people's information.",
  },
];

/** @type {readonly ('easy'|'medium'|'hard')[]} */
export const TRAINING_LEVELS = ["easy", "medium", "hard"];

/** @type {Record<string, string>} */
export const LEVEL_LABELS = {
  easy: "Easy — Getting started",
  medium: "Medium — Building skills",
  hard: "Hard — Advanced scenarios",
};

/** @type {Record<string, string>} */
export const LEVEL_HINTS = {
  easy: "Plain language for beginners, kids, and anyone new to security.",
  medium: "Workplace scenarios with standard security terms.",
  hard: "Technical detail and tricky decisions for experienced learners.",
};

/** @type {string[]} */
export const KEYTRAIN_CATEGORY_IDS = KEYTRAIN_CATEGORIES.map((c) => c.id);
