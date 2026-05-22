/**
 * Hard-level KeyTrain workshops — advanced scenarios and technical depth.
 */
import { workshop } from "./keytrain-workshop-factory.js";
import { prepareWorkshopQuiz } from "./prepare-workshop-quiz.js";

/**
 * @param {object} c
 */
function hard(c) {
  const q1 = prepareWorkshopQuiz(c.q1, c.id, "hard_q1");
  const q2 = prepareWorkshopQuiz(c.q2, c.id, "hard_q2");
  return workshop({
    id: c.id,
    categoryId: c.id,
    level: "hard",
    title: c.title,
    code: c.code,
    tagline: "Hard — advanced scenarios, trade-offs, and incident-style decisions.",
    topics: c.topics,
    steps: [
      {
        id: "context",
        type: "lesson",
        title: "Advanced context",
        paragraphs: c.context,
        bullets: c.focus,
      },
      {
        id: "deep-dive",
        type: "lesson",
        title: "Technical depth",
        paragraphs: c.depth,
        bullets: c.signals,
      },
      {
        id: "quiz-1",
        type: "quiz",
        title: "Decision drill",
        prompt: q1.prompt,
        options: q1.options,
        correct: q1.correct,
        explanation: q1.explanation,
        quizType: q1.multi ? "multiple-response" : "multiple-choice",
      },
      {
        id: "checklist",
        type: "checklist",
        title: "IR / engineering checklist",
        paragraphs: ["Use during tabletop exercises or real incidents."],
        items: c.checklist.map((item, i) => ({ id: `c${i}`, label: item.label, detail: item.detail })),
      },
      {
        id: "quiz-2",
        type: "quiz",
        title: "Multi-factor scenario",
        prompt: q2.prompt,
        options: q2.options,
        correct: q2.correct,
        explanation: q2.explanation,
        quizType: q2.multi ? "multiple-response" : "multiple-choice",
      },
      {
        id: "wrap",
        type: "summary",
        title: "Hard-level takeaways",
        bullets: c.takeaways,
      },
    ],
  });
}

/** @type {Record<string, import('../workshop-runner.js').KeytrainWorkshop>} */
export const HARD_WORKSHOPS = {
  "keytrain-identity-access": hard({
    id: "keytrain-identity-access",
    title: "Identity & Access Security",
    code: "KT-IAS",
    topics: ["Kerberos", "OAuth/OIDC", "PAM", "Conditional access", "Token theft"],
    context: [
      "Modern attacks chain phishing → token theft → API abuse, bypassing passwords entirely. Defenders must instrument identity providers, session lifetimes, and privilege tiers.",
    ],
    focus: [
      "Refresh token theft (device code, illicit consent grants).",
      "Golden/silver ticket indicators in Active Directory.",
      "Break-glass accounts monitored separately.",
    ],
    depth: [
      "Conditional access should consider device compliance, location, risk score, and step-up auth for admin roles.",
    ],
    signals: [
      "Impossible travel plus successful OAuth consent to a new app.",
      "Service principal credential added without change ticket.",
      "PAM session started outside maintenance window.",
    ],
    q1: {
      prompt:
        "SOC alerts: user mailbox shows OAuth consent to 'Mail Sync Pro' from a new enterprise app; sign-in risk = high; no MFA challenge. Best containment sequence?",
      options: [
        { id: "a", text: "Revoke refresh tokens, disable app consent, reset password, review mailbox rules" },
        { id: "b", text: "Force password change only" },
        { id: "c", text: "Delete the user account" },
        { id: "d", text: "Wait for user callback next week" },
      ],
      correct: ["a"],
      explanation: "Token + consent abuse needs session revocation, consent removal, credential rotation, and mailbox rule hunting.",
    },
    q2: {
      prompt: "Which indicators best suggest Kerberoasting activity? (Select all that apply.)",
      multi: true,
      options: [
        { id: "a", text: "Spike of TGS-REQ for service accounts with weak encryption" },
        { id: "b", text: "Legitimate help-desk password reset ticket" },
        { id: "c", text: "Offline cracking tools pulling service ticket hashes" },
        { id: "d", text: "Monitor brightness change" },
      ],
      correct: ["a", "c"],
      explanation: "Kerberoasting requests service tickets for offline cracking—correlate with weak SPN accounts.",
    },
    checklist: [
      { label: "Inventory OAuth apps and consent grants quarterly", detail: "Remove unused enterprise apps." },
      { label: "Tier-0 admin from hardened PAWs only", detail: "No email/browsing on domain admin workstations." },
      { label: "Alert on new service principal secrets", detail: "Pair with change management." },
    ],
    takeaways: [
      "Treat tokens like credentials—revoke aggressively on suspicion.",
      "Monitor OAuth consent and service principal changes.",
      "Separate privileged access paths from standard user workstations.",
    ],
  }),

  "keytrain-email-security": hard({
    id: "keytrain-email-security",
    title: "Email Security",
    code: "KT-EMS",
    topics: ["DMARC alignment", "ATO", "HTML smuggling", "Thread hijacking"],
    context: ["Attackers bypass SEGs using legitimate infrastructure, thread hijacking, and look-alike domains with valid MX."],
    focus: ["DMARC p=reject for owned domains", "Internal relay abuse", "HTML/RTF smuggling past sandboxes"],
    depth: ["Auto-forwarding rules and hidden inbox rules are common post-ATO persistence."],
    signals: ["Inbox rule forwarding to external freemail", "MailItemsAccessed spike from unfamiliar client"],
    q1: {
      prompt: "Executive mailbox shows new transport rule BCCing archive@external-mail.net. User denies creating it. First actions?",
      options: [
        { id: "a", text: "Disable account, revoke sessions, hunt rules across tenant, preserve UAL" },
        { id: "b", text: "Ask user to delete the rule" },
        { id: "c", text: "Increase mailbox quota" },
        { id: "d", text: "Whitelist the external domain" },
      ],
      correct: ["a"],
      explanation: "Account takeover persistence lives in rules—contain identity and preserve cloud audit logs.",
    },
    q2: {
      prompt: "DMARC fails alignment but SPF passes on a look-alike domain used in BEC. Why might SPF alone be insufficient?",
      options: [
        { id: "a", text: "SPF can pass on unrelated domains; DMARC alignment ties From: to authenticated domain" },
        { id: "b", text: "SPF always blocks phishing" },
        { id: "c", text: "DMARC is only for marketing mail" },
        { id: "d", text: "SPF encrypts message bodies" },
      ],
      correct: ["a"],
      explanation: "BEC often uses cousin domains—DMARC alignment and display-name training remain critical.",
    },
    checklist: [
      { label: "Hunt hidden inbox rules after any ATO", detail: "Include delegate permissions." },
      { label: "Enforce external tagging + anti-spoof policies", detail: "Warn on look-alike domains." },
      { label: "Tabletop BEC wire-change playbooks", detail: "Finance + security joint drill." },
    ],
    takeaways: ["Rules-based persistence is post-phish standard—automate hunts.", "DMARC alignment closes cousin-domain gaps SPF alone misses."],
  }),

  "keytrain-data-protection": hard({
    id: "keytrain-data-protection",
    title: "Data Protection",
    code: "KT-DP",
    topics: ["Tokenization", "KMS policies", "DLP bypass", "Data residency"],
    context: ["Exfiltration increasingly uses approved SaaS and encrypted channels—policy must cover identity, device, and data context."],
    focus: ["ABAC vs RBAC for data lakes", "Client-side encryption trade-offs", "DLP OCR limits"],
    depth: ["Key rotation without re-encrypting entire datasets requires envelope encryption design."],
    signals: ["Bulk download to personal tenant via OAuth", "Unlabeled S3 bucket with ListBucket public"],
    q1: {
      prompt: "An engineer copies production DB snapshot to a personal S3 bucket 'for debugging' with public ACL. Compliance impact?",
      options: [
        { id: "a", text: "Potential regulatory breach; invoke IR, revoke creds, assess notification duties" },
        { id: "b", text: "No issue if deleted within a year" },
        { id: "c", text: "Only a performance concern" },
        { id: "d", text: "Fixed by renaming bucket" },
      ],
      correct: ["a"],
      explanation: "Public copies of regulated data trigger incident response and possible breach notification.",
    },
    q2: {
      prompt: "Which controls best reduce DLP bypass via encrypted personal cloud sync? (Select all that apply.)",
      multi: true,
      options: [
        { id: "a", text: "Block unapproved cloud sync on managed devices" },
        { id: "b", text: "Disable all TLS" },
        { id: "c", text: "CASB with session inspection where policy allows" },
        { id: "d", text: "Label-driven encryption + access policies" },
      ],
      correct: ["a", "c", "d"],
      explanation: "Combine device control, CASB, and sensitivity labels—breaking TLS is not viable.",
    },
    checklist: [
      { label: "Scan for public object ACLs daily", detail: "Automate remediation tickets." },
      { label: "Map data flows for each new SaaS", detail: "Update DPIA records." },
      { label: "Test restore from immutable backups", detail: "Quarterly ransomware drill." },
    ],
    takeaways: ["Approved paths still need monitoring—OAuth exfil is common.", "Encryption without key governance fails audits."],
  }),

  "keytrain-endpoint-security": hard({
    id: "keytrain-endpoint-security",
    title: "Endpoint Security",
    code: "KT-EPS",
    topics: ["EDR tuning", "LOLBins", "Kernel drivers", "Ransomware TTPs"],
    context: ["Attackers live off the land (PowerShell, WMI, rundll32) and disable EDR via vulnerable drivers."],
    focus: ["Tamper protection", "Memory-only malware", "VSS deletion before encryption"],
    depth: ["Isolate hosts via network ACL, not just local Wi-Fi disconnect, to stop lateral movement."],
    signals: ["vssadmin delete shadows", "bcdedit recoveryenabled No", "New kernel driver load unsigned"],
    q1: {
      prompt: "EDR shows rundll32 loading a DLL from ProgramData with network beacon to 185.x.x.x; VSS shadow delete detected. Priority?",
      options: [
        { id: "a", text: "Network isolate host, preserve memory/disk, escalate IR, block IOCs tenant-wide" },
        { id: "b", text: "Reboot and monitor" },
        { id: "c", text: "Uninstall EDR to stop alerts" },
        { id: "d", text: "Pay ransom immediately" },
      ],
      correct: ["a"],
      explanation: "Ransomware prep sequence needs enterprise-wide containment and evidence preservation.",
    },
    q2: {
      prompt: "Why block unsigned vulnerable drivers used in EDR bypass kits?",
      options: [
        { id: "a", text: "They allow kernel-level tampering with security agents" },
        { id: "b", text: "They improve battery life" },
        { id: "c", text: "They are required for printing only" },
        { id: "d", text: "They encrypt disks automatically" },
      ],
      correct: ["a"],
      explanation: "Bring-your-own-vulnerable-driver attacks kill EDR from kernel mode.",
    },
    checklist: [
      { label: "Alert on shadow copy deletion", detail: "High-fidelity ransomware precursor." },
      { label: "Application control for LOLBins where feasible", detail: "Balance with dev needs." },
      { label: "Validate EDR tamper protection on all agents", detail: "Weekly health dashboard." },
    ],
    takeaways: ["LOLBins + driver abuse evade naive AV—EDR + isolation matter.", "Treat VSS deletion as ransomware until proven otherwise."],
  }),

  "keytrain-network-security": hard({
    id: "keytrain-network-security",
    title: "Network Security",
    code: "KT-NET",
    topics: ["East-west segmentation", "ZTNA", "JA3/JA4", "Encrypted traffic visibility"],
    context: ["Flat networks let ransomware spread in minutes; zero trust limits blast radius per identity and workload."],
    focus: ["Microsegmentation policies", "DNS over HTTPS blind spots", "C2 over CDN edges"],
    depth: ["JA3 fingerprints help detect custom malware TLS stacks when payload is encrypted."],
    signals: ["SMB storms between workstations", "Rare JA3 hash to bulletproof host"],
    q1: {
      prompt: "Ransomware spreads via SMB between user VLANs. Long-term architectural fix?",
      options: [
        { id: "a", text: "East-west default-deny segmentation with identity-aware policies" },
        { id: "b", text: "Single flat /16 for simplicity" },
        { id: "c", text: "Disable all logging" },
        { id: "d", text: "Open RDP from internet for support" },
      ],
      correct: ["a"],
      explanation: "Limit lateral movement—workstations should not talk SMB to each other by default.",
    },
    q2: {
      prompt: "Encrypted DNS (DoH) to consumer resolvers bypasses corporate DNS filtering. Mitigations? (Select all that apply.)",
      multi: true,
      options: [
        { id: "a", text: "Block known DoH endpoints on egress firewall" },
        { id: "b", text: "Provide managed DoH resolver with logging" },
        { id: "c", text: "Disable all DNS" },
        { id: "d", text: "Use SWG/ZTNA with DNS inspection policies" },
      ],
      correct: ["a", "b", "d"],
      explanation: "Offer controlled encrypted DNS and block unsanctioned resolvers.",
    },
    checklist: [
      { label: "Map critical asset communication paths", detail: "Update segmentation yearly." },
      { label: "Retain NetFlow/PCAP for critical servers", detail: "Support IR timelines." },
      { label: "Test ransomware lateral movement in purple team", detail: "Document gaps." },
    ],
    takeaways: ["Segmentation is the top ransomware spread brake.", "Plan for encrypted DNS and TLS visibility limits."],
  }),

  "keytrain-system-hygiene": hard({
    id: "keytrain-system-hygiene",
    title: "System Hygiene",
    code: "KT-SYS",
    topics: ["CVSS prioritization", "SBOM", "CIS benchmarks", "Immutable infra"],
    context: ["Patch everything is impossible—risk-based SLAs tied to exposure and exploitability win."],
    focus: ["KEV catalog prioritization", "Golden AMI pipelines", "Drift detection at scale"],
    depth: ["Immutable infrastructure replaces patching running pets—with faster rollback."],
    signals: ["CVE in edge VPN with public exploit added to CISA KEV", "Terraform plan shows open SG 0.0.0.0/0"],
    q1: {
      prompt: "KEV lists critical RCE in your border firewall; exploit public; patch staged 30 days out. Decision?",
      options: [
        { id: "a", text: "Emergency change within hours + compensating WAF/rate limits until patched" },
        { id: "b", text: "Wait 30 days" },
        { id: "c", text: "Disable logging instead" },
        { id: "d", text: "Publish exploit internally" },
      ],
      correct: ["a"],
      explanation: "KEV + public exploit on internet edge = emergency SLA regardless of normal cadence.",
    },
    q2: {
      prompt: "Why integrate SBOM into CI for container releases?",
      options: [
        { id: "a", text: "Rapid identification of affected services when new library CVEs drop" },
        { id: "b", text: "Eliminates need for scanning" },
        { id: "c", text: "Replaces firewalls" },
        { id: "d", text: "Only for marketing" },
      ],
      correct: ["a"],
      explanation: "SBOMs accelerate blast-radius analysis after supply-chain advisories.",
    },
    checklist: [
      { label: "SLA: KEV internet-facing < 72h", detail: "Document exceptions with CISO sign-off." },
      { label: "Automated CIS compliance scans on deploy", detail: "Fail pipeline on critical drift." },
      { label: "Retire pets that cannot meet patch SLA", detail: "Isolate or rebuild." },
    ],
    takeaways: ["Prioritize by exposure + active exploitation, not CVSS alone.", "SBOM + immutable deploys shrink patch lag."],
  }),

  "keytrain-application-security": hard({
    id: "keytrain-application-security",
    title: "Application Security",
    code: "KT-APP",
    topics: ["SSRF", "JWT misuse", "Supply chain", "API authZ"],
    context: ["Cloud-native apps expose APIs and serverless functions—misconfigurations become remote code execution."],
    focus: ["SSRF to metadata endpoints", "Algorithm confusion in JWT", "Dependency confusion"],
    depth: ["Authorize every object on every route—GraphQL field auth included."],
    signals: ["Lambda calling 169.254.169.254", "JWT alg=none accepted", "Unexpected outbound from app tier"],
    q1: {
      prompt: "App fetches user-supplied URL server-side; logs show requests to http://169.254.169.254/latest/meta-data/. Risk?",
      options: [
        { id: "a", text: "SSRF stealing cloud instance credentials—block metadata access, fix URL validation" },
        { id: "b", text: "Harmless health check" },
        { id: "c", text: "DNS caching issue only" },
        { id: "d", text: "Browser font problem" },
      ],
      correct: ["a"],
      explanation: "SSRF to IMDS is a classic cloud credential theft path—use IMDSv2 and network controls.",
    },
    q2: {
      prompt: "JWT accepted with alg header changed from RS256 to HS256 using public key as HMAC secret. Fix?",
      options: [
        { id: "a", text: "Enforce allowed algorithms server-side; reject none/ambiguous algs" },
        { id: "b", text: "Trust client alg header" },
        { id: "c", text: "Disable HTTPS" },
        { id: "d", text: "Email tokens in clear text" },
      ],
      correct: ["a"],
      explanation: "Algorithm confusion attacks break asymmetric JWT deployments—pin algorithms explicitly.",
    },
    checklist: [
      { label: "Block link-local/metadata in app egress", detail: "SG + proxy deny rules." },
      { label: "SAST + SCA in CI gate on critical findings", detail: "Waivers need expiry." },
      { label: "Threat-model SSRF on any URL fetch feature", detail: "Document abuse cases." },
    ],
    takeaways: ["SSRF is a cloud killer—validate URLs and protect metadata.", "JWT requires strict algorithm and key hygiene."],
  }),

  "keytrain-financial-security": hard({
    id: "keytrain-financial-security",
    title: "Financial Security",
    code: "KT-FIN",
    topics: ["SEPA fraud", "ERP SoD", "Deepfake CEO", "Vendor master integrity"],
    context: ["Fraud blends BEC, deepfake voice, and insider ERP manipulation—controls must be layered and logged."],
    focus: ["Out-of-band payment verification", "Immutable AP audit logs", "Deepfake awareness"],
    depth: ["SoD conflicts in ERP roles should be continuously monitored, not annual attestation only."],
    signals: ["Vendor bank change + urgent CEO voicemail", "Same user creates and approves vendor"],
    q1: {
      prompt: "CFO deepfake voice approves $2M wire; email matches domain with DMARC pass (account compromise). Best control gap?",
      options: [
        { id: "a", text: "Missing callback to known contacts and dual approval on wires" },
        { id: "b", text: "Mailbox too small" },
        { id: "c", text: "Lack of social media" },
        { id: "d", text: "PDF color profile" },
      ],
      correct: ["a"],
      explanation: "Voice can be faked—payment policy must not rely on a single channel, even if email passes DMARC.",
    },
    q2: {
      prompt: "Which ERP controls detect vendor master fraud? (Select all that apply.)",
      multi: true,
      options: [
        { id: "a", text: "Segregation of duties on vendor create vs approve" },
        { id: "b", text: "Shared admin password" },
        { id: "c", text: "Change logs alerting on bank account field edits" },
        { id: "d", text: "Dual approval on payment file export" },
      ],
      correct: ["a", "c", "d"],
      explanation: "SoD + field-level monitoring + payment file controls catch master-data tampering.",
    },
    checklist: [
      { label: "Mandate verbal callback for bank changes", detail: "Use directory, not email signature." },
      { label: "Review SoD conflicts monthly in ERP", detail: "Automate where possible." },
      { label: "Train AP on deepfake voice red flags", detail: "Urgency + secrecy." },
    ],
    takeaways: ["Deepfake + ATO bypass email authentication—use process controls.", "Vendor master changes are high-value fraud targets."],
  }),

  "keytrain-physical-security": hard({
    id: "keytrain-physical-security",
    title: "Physical Security",
    code: "KT-PHY",
    topics: ["Piggybacking", "Clean desk audits", "Hardware implants", "SCIF basics"],
    context: ["Physical and cyber converge—badges cloned, USB implants, and dumpster diving still work."],
    focus: ["Anti-passback", "Visitor escort policy", "Port security on docks"],
    depth: ["Hardware implants may target supply chain—seal and inventory sensitive shipments."],
    signals: ["Multiple entries one exit in badge logs", "Unknown USB-C device inline with keyboard"],
    q1: {
      prompt: "Badge logs show same ID entered twice without exit (anti-passback disabled). Night crew reports missing servers. Link?",
      options: [
        { id: "a", text: "Possible cloned badge / tailgating—review CCTV, disable badge, audit access" },
        { id: "b", text: "Normal HVAC behavior" },
        { id: "c", text: "DNS issue" },
        { id: "d", text: "Printer jam" },
      ],
      correct: ["a"],
      explanation: "Anti-passback violations suggest badge sharing or cloning—correlate with asset loss.",
    },
    q2: {
      prompt: "Why inspect docking stations and keyboards after vendor maintenance in secure areas?",
      options: [
        { id: "a", text: "Hardware keyloggers/implants are low-noise exfil paths" },
        { id: "b", text: "To improve ergonomics only" },
        { id: "c", text: "Required for Wi-Fi speed" },
        { id: "d", text: "Replaces encryption" },
      ],
      correct: ["a"],
      explanation: "Inline implants bypass many software controls—physical inspection matters.",
    },
    checklist: [
      { label: "Enable anti-passback on high-security doors", detail: "Tune exceptions with security." },
      { label: "Seal and log hardware entering DC floors", detail: "Chain of custody." },
      { label: "Quarterly clean-desk / screen-lock sweeps", detail: "Document violations." },
    ],
    takeaways: ["Badge anomalies are leading indicators—correlate with video.", "Supply-chain physical implants remain in scope for high-security sites."],
  }),

  "keytrain-compliance-governance": hard({
    id: "keytrain-compliance-governance",
    title: "Compliance & Governance",
    code: "KT-CG",
    topics: ["BAA", "SOC 2 Type II", "Breach clocks", "Risk treatment"],
    context: ["Regulators and customers ask for evidence, not narratives—governance ties controls to measurable risk."],
    focus: ["HIPAA security rule vs privacy rule", "72-hour GDPR notification analysis", "Risk acceptance documentation"],
    depth: ["Control effectiveness must be tested, not just documented—Type II audits require operating evidence."],
    signals: ["PHI on unapproved SaaS without BAA", "Repeated audit finding with no risk entry"],
    q1: {
      prompt: "PHI discovered in unsanctioned chat SaaS without BAA; 500+ records. HIPAA actions?",
      options: [
        { id: "a", text: "Invoke incident response, notify privacy officer, assess breach notification & vendor remediation" },
        { id: "b", text: "Delete chat and ignore" },
        { id: "c", text: "Post PHI publicly to confirm" },
        { id: "d", text: "Disable all email" },
      ],
      correct: ["a"],
      explanation: "Unauthorized PHI processing triggers HIPAA risk analysis and possible breach notification.",
    },
    q2: {
      prompt: "Repeated penetration finding (critical) deferred three quarters with no risk register entry. Governance issue?",
      options: [
        { id: "a", text: "Failed risk treatment—document accept/mitigate/transfer with owner and deadline" },
        { id: "b", text: "Acceptable if scanner offline" },
        { id: "c", text: "Only IT style concern" },
        { id: "d", text: "Fixed by new logo" },
      ],
      correct: ["a"],
      explanation: "Findings without risk decisions fail audits and leave liability unmanaged.",
    },
    checklist: [
      { label: "Maintain BAAs for all PHI processors", detail: "Block OAuth to unapproved tools." },
      { label: "Risk-register every critical audit finding", detail: "Executive sign-off on acceptances." },
      { label: "Run tabletop on breach notification timelines", detail: "Legal + privacy + IR." },
    ],
    takeaways: ["Unauthorized SaaS + PHI = potential reportable breach.", "Risk register must reflect deferred findings with accountability."],
  }),
};
