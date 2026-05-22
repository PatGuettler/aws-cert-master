/**
 * Medium- and Hard-only interactive visuals (workplace scenarios & advanced IR).
 */
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
  return { id, type: "visual", title, visual };
}

/** @type {Record<string, WorkshopStep[]>} */
export const VISUALS_MEDIUM = {
  "keytrain-identity-access": [
    visualStep("viz-med-privilege", "Where privilege abuse starts", {
      kind: "hotspot",
      subtitle: "Tap each path — attackers chain small misconfigurations into admin access.",
      baseSvg: svgNetworkZones(),
      hotspots: [
        {
          id: "1",
          label: "Local Administrators group",
          why: "Unexpected local admin on a laptop may mean malware or an attacker preparing persistence.",
          x: 22,
          y: 45,
        },
        {
          id: "2",
          label: "Over-privileged cloud role",
          why: "Automation or human error can grant admin-equivalent API rights—review IAM and Entra roles.",
          x: 50,
          y: 45,
        },
        {
          id: "3",
          label: "Service account secret",
          why: "Long-lived secrets without rotation are high-value targets—monitor new credentials.",
          x: 78,
          y: 45,
        },
      ],
    }),
    visualStep("viz-med-mfa-fatigue", "MFA push you did not start", {
      kind: "compare",
      subtitle: "Same alert — two different responses.",
      leftSvg: svgMfaCompare(false),
      rightSvg: svgMfaCompare(true),
      left: {
        title: "Approve to stop notifications",
        body: "Clears the prompt but may grant an attacker access if your password was phished.",
      },
      right: {
        title: "Deny and report",
        body: "Stops the session and triggers investigation—paired with password reset and session revoke.",
      },
    }),
    visualStep("viz-med-signin-order", "Workplace: strange sign-in alert", {
      kind: "order",
      subtitle: "Rank what you would do when MFA or sign-in alerts look wrong.",
      orderItems: [
        { id: "deny", label: "Deny unknown MFA / sign-in prompts" },
        { id: "report", label: "Report to IT or security" },
        { id: "reset", label: "Change password from a clean device" },
        { id: "share", label: "Post screenshot on public social media" },
      ],
      correctOrder: ["deny", "report", "reset"],
      orderSuccess: "Deny first, report for investigation, then reset credentials safely.",
    }),
  ],

  "keytrain-email-security": [
    visualStep("viz-med-phish-layers", "Layers of email defense", {
      kind: "hotspot",
      subtitle: "Tap each layer — no single control catches everything.",
      baseSvg: svgPhishLayers(),
      hotspots: [
        {
          id: "1",
          label: "Gateway filters",
          why: "Blocks known bad links and attachments—attackers constantly rotate infrastructure.",
          x: 50,
          y: 18,
        },
        {
          id: "2",
          label: "Report phish",
          why: "Removes copies from mailboxes and improves detection for the whole tenant.",
          x: 50,
          y: 35,
        },
        {
          id: "3",
          label: "Verify sender address",
          why: "Display names lie; cousin domains and look-alike addresses bypass casual review.",
          x: 50,
          y: 52,
        },
        {
          id: "4",
          label: "You",
          why: "Urgency, payment changes, and odd attachments deserve pause—not reflex clicks.",
          x: 50,
          y: 72,
        },
      ],
    }),
    visualStep("viz-med-bec-wire", "Verify a payment change (ordering)", {
      kind: "order",
      subtitle: "New bank details in email — order your steps before any wire goes out.",
      orderItems: [
        { id: "call", label: "Call vendor using number in ERP, not in the email" },
        { id: "pay", label: "Process wire after verbal confirmation" },
        { id: "reply", label: "Reply to the email thread asking if it is real" },
        { id: "logo", label: "Approve because the logo looks correct" },
      ],
      correctOrder: ["call", "pay"],
      orderSuccess: "Out-of-band verification breaks BEC—attackers control email, not your phone list on file.",
    }),
  ],

  "keytrain-data-protection": [
    visualStep("viz-med-dlp", "Sending work data outside approved tools", {
      kind: "compare",
      baseSvg: svgDataStates("use"),
      left: {
        title: "Personal webmail / USB",
        body: "Bypasses DLP, retention, and monitoring—creates breach and compliance exposure.",
      },
      right: {
        title: "Approved secure transfer",
        body: "Logged, scanned, and policy-aligned—security can support the business need safely.",
      },
    }),
    visualStep("viz-med-data-states", "Three states of data (workshop)", {
      kind: "flow",
      subtitle: "Each state needs different controls in the workplace.",
      frames: [
        {
          label: "Data at rest on laptop or file share",
          why: "Encryption and access control protect stolen devices and overshared folders.",
          svg: svgDataStates("rest"),
        },
        {
          label: "Data in use while you are logged in",
          why: "Screen lock and least privilege limit exposure on unlocked sessions.",
          svg: svgDataStates("use"),
        },
        {
          label: "Data in transit over Wi‑Fi or VPN",
          why: "TLS and corporate VPN protect against casual interception.",
          svg: svgDataStates("transit"),
        },
      ],
    }),
  ],

  "keytrain-endpoint-security": [
    visualStep("viz-med-malware-chain", "Malware chain on a workstation", {
      kind: "flow",
      subtitle: "Break the chain early—most infections start with a click.",
      frames: [
        {
          label: "User opens attachment or link",
          why: "Social engineering beats filters sometimes—pause on unexpected files.",
          svg: svgEndpointInfection(0),
        },
        {
          label: "Malware executes on the endpoint",
          why: "EDR should alert—if disabled or tampered, treat as compromise.",
          svg: svgEndpointInfection(1),
        },
        {
          label: "Beaconing to command-and-control",
          why: "Regular small connections to rare domains warrant isolation and IR.",
          svg: svgEndpointInfection(2),
        },
      ],
    }),
    visualStep("viz-med-ransomware-order", "Ransomware: first responses", {
      kind: "order",
      subtitle: "Files are encrypting — order your steps.",
      orderItems: [
        { id: "iso", label: "Disconnect from network / isolate device" },
        { id: "ir", label: "Call incident response or IT" },
        { id: "pay", label: "Pay ransom immediately without telling anyone" },
        { id: "reboot", label: "Reboot repeatedly until files return" },
      ],
      correctOrder: ["iso", "ir"],
      orderSuccess: "Contain first to protect others; IR guides evidence and recovery.",
    }),
  ],

  "keytrain-network-security": [
    visualStep("viz-med-zones", "Network zones at work", {
      kind: "hotspot",
      subtitle: "Why flat networks help ransomware spread.",
      baseSvg: svgNetworkZones(),
      hotspots: [
        {
          id: "1",
          label: "User VLAN",
          why: "Workstations should not talk SMB to every other workstation by default.",
          x: 22,
          y: 45,
        },
        {
          id: "2",
          label: "DMZ",
          why: "Public services sit here—patch and monitor aggressively.",
          x: 48,
          y: 45,
        },
        {
          id: "3",
          label: "Internet egress",
          why: "Egress filtering and DNS logging catch C2 and data exfil attempts.",
          x: 78,
          y: 45,
        },
      ],
    }),
    visualStep("viz-med-beacon", "Normal browsing vs possible C2", {
      kind: "compare",
      baseSvg: svgNetworkZones(),
      left: {
        title: "Normal browsing",
        body: "Irregular timing, varied destinations, larger page loads.",
      },
      right: {
        title: "Possible beacon",
        body: "Small, periodic connections to one rare host—escalate to security for investigation.",
      },
    }),
  ],

  "keytrain-system-hygiene": [
    visualStep("viz-med-patch-flow", "Patch lifecycle in operations", {
      kind: "flow",
      subtitle: "Why delaying critical patches increases risk.",
      frames: [
        {
          label: "Vendor publishes security update",
          why: "Attackers weaponize public CVEs quickly—especially on internet-facing systems.",
          svg: svgEndpointInfection(0),
        },
        {
          label: "Change advisory and testing",
          why: "Balance stability with emergency paths for actively exploited flaws.",
          svg: svgEndpointInfection(1),
        },
        {
          label: "Deployment and compliance measurement",
          why: "Unpatched assets are the doors attackers walk through.",
          svg: svgEndpointInfection(2),
        },
      ],
    }),
    visualStep("viz-med-kev-compare", "KEV on the edge vs internal-only", {
      kind: "compare",
      baseSvg: svgEndpointInfection(1),
      left: {
        title: "Internet-facing + KEV listed",
        body: "Treat as emergency—compensating controls until patched within hours, not months.",
      },
      right: {
        title: "Internal-only legacy server",
        body: "Still patch on SLA, but network placement lowers immediate exploitation risk.",
      },
    }),
  ],

  "keytrain-application-security": [
    visualStep("viz-med-app-layers", "Inside a business web app", {
      kind: "flow",
      subtitle: "Where authorization and injection flaws appear.",
      frames: [
        {
          label: "Untrusted input from browser",
          why: "Validate, sanitize, and parameterize—never trust hidden form fields.",
          svg: svgAppLayers("user"),
        },
        {
          label: "Server-side authorization",
          why: "Every API route must check object ownership—UI hiding is not security.",
          svg: svgAppLayers("app"),
        },
        {
          label: "Database with sensitive records",
          why: "Least-privilege DB accounts limit blast radius after compromise.",
          svg: svgAppLayers("db"),
        },
      ],
    }),
    visualStep("viz-med-waf", "WAF vs fixing code", {
      kind: "compare",
      baseSvg: svgAppLayers("app"),
      left: {
        title: "WAF only at edge",
        body: "Blocks some payloads but misses internal traffic and business-logic flaws.",
      },
      right: {
        title: "Secure code + WAF",
        body: "Fix injection and authZ at source; keep monitoring at the perimeter.",
      },
    }),
  ],

  "keytrain-financial-security": [
    visualStep("viz-med-wire", "Verify before you wire", {
      kind: "flow",
      subtitle: "Finance workflow that resists BEC.",
      frames: [
        {
          label: "Email requests new bank details",
          why: "Forged or compromised senders are common—treat instructions as untrusted.",
          svg: svgWireVerify(),
        },
        {
          label: "Call vendor on a known number",
          why: "Out-of-band breaks BEC: attacker owns email, not ERP contact data.",
          svg: svgWireVerify(),
        },
        {
          label: "Dual approval before payment file export",
          why: "Process controls catch look-alike domains and master-data tampering.",
          svg: svgWireVerify(),
        },
      ],
    }),
    visualStep("viz-med-fraud-order", "Suspicious invoice — your move", {
      kind: "order",
      subtitle: "Order actions before any payment leaves AP.",
      orderItems: [
        { id: "hold", label: "Hold payment and verify vendor" },
        { id: "soc", label: "Alert AP manager and security" },
        { id: "pay", label: "Pay fast to avoid late fees" },
        { id: "fwd", label: "Forward invoice to personal email" },
      ],
      correctOrder: ["hold", "soc"],
      orderSuccess: "Stop money movement first; escalate for broader fraud hunt.",
    }),
  ],

  "keytrain-physical-security": [
    visualStep("viz-med-tailgate", "Tailgating at the door", {
      kind: "hotspot",
      subtitle: "Tap each moment — physical access enables cyber attacks.",
      baseSvg: svgPhysicalDoor(),
      hotspots: [
        {
          id: "1",
          label: "You badge in",
          why: "Your badge is only valid if nobody follows without badging.",
          x: 22,
          y: 55,
        },
        {
          id: "2",
          label: "Door propped or held",
          why: "Politeness is exploited—follow policy on individual badging.",
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
    visualStep("viz-med-laptop-theft", "Stolen laptop scenario", {
      kind: "compare",
      baseSvg: svgPhysicalDoor(),
      left: {
        title: "No full-disk encryption",
        body: "Offline disk access exposes data at rest—assume breach.",
      },
      right: {
        title: "Encrypted disk + remote wipe",
        body: "Disk is protected offline—still rotate passwords if session was active.",
      },
    }),
  ],

  "keytrain-compliance-governance": [
    visualStep("viz-med-hipaa", "Where PHI moves in operations", {
      kind: "flow",
      subtitle: "Minimum necessary at each handoff.",
      frames: [
        {
          label: "Patient data in clinical system",
          why: "Collect only fields required for care—reduces breach impact.",
          svg: svgHipaaFlow(),
        },
        {
          label: "Billing uses subset of fields",
          why: "Role-based access prevents front desk from exporting full charts.",
          svg: svgHipaaFlow(),
        },
        {
          label: "Vendors require BAA before access",
          why: "Contracts define security duties—no BAA means no sharing.",
          svg: svgHipaaFlow(),
        },
      ],
    }),
    visualStep("viz-med-audit-order", "Audit evidence — sensible order", {
      kind: "order",
      subtitle: "Audit coming — order preparation tasks.",
      orderItems: [
        { id: "map", label: "Map controls to systems you actually use" },
        { id: "evidence", label: "Pull samples from tickets and logs" },
        { id: "fabricate", label: "Create evidence the night before the audit" },
        { id: "ignore", label: "Skip policies that are inconvenient" },
      ],
      correctOrder: ["map", "evidence"],
      orderSuccess: "Audits test whether controls run year-round—not rushed fiction.",
    }),
  ],
};

/** @type {Record<string, WorkshopStep[]>} */
export const VISUALS_HARD = {
  "keytrain-identity-access": [
    visualStep("viz-hard-oauth-flow", "OAuth & refresh-token abuse chain", {
      kind: "flow",
      subtitle: "Advanced identity attacks often skip passwords entirely.",
      frames: [
        {
          label: "User grants consent to a new enterprise application",
          why: "Illicit consent grants let attackers maintain API access without knowing the password.",
          svg: svgAuthFlow(0),
        },
        {
          label: "Attacker uses refresh token from the malicious app",
          why: "Token grants may bypass MFA if conditional access does not cover the client.",
          svg: svgAuthFlow(1),
        },
        {
          label: "Risky sign-ins and MailItemsAccessed anomalies appear",
          why: "Correlate consent events with mailbox and Graph API activity.",
          svg: svgAuthFlow(2),
        },
        {
          label: "Contain: revoke tokens, remove consent, reset creds, hunt rules",
          why: "Persistence hides in mailbox rules, delegates, and service principals.",
          svg: svgAuthFlow(3),
        },
      ],
    }),
    visualStep("viz-hard-tier0", "Tiered administration (hotspot)", {
      kind: "hotspot",
      subtitle: "Tap each tier — where domain and cloud admins should live.",
      baseSvg: svgBuildingBadge(),
      hotspots: [
        {
          id: "1",
          label: "Privileged Access Workstation (PAW)",
          why: "Tier-0 tasks from hardened jump hosts—not daily email/browsing machines.",
          x: 14,
          y: 42,
        },
        {
          id: "2",
          label: "Break-glass accounts",
          why: "Monitored separately; use rarely with hardware-backed MFA and safe storage.",
          x: 52,
          y: 58,
        },
        {
          id: "3",
          label: "Service principal secrets",
          why: "New credentials without change tickets are a top cloud persistence indicator.",
          x: 72,
          y: 38,
        },
      ],
    }),
    visualStep("viz-hard-token-order", "Token incident — containment sequence", {
      kind: "order",
      subtitle: "SOC: OAuth consent + high-risk sign-in — order enterprise containment.",
      orderItems: [
        { id: "revoke", label: "Revoke refresh tokens and active sessions tenant-wide for user" },
        { id: "consent", label: "Remove malicious enterprise application consent" },
        { id: "pwd", label: "Force password reset from known-good device" },
        { id: "hunt", label: "Hunt mailbox rules, delegates, and new service principals" },
        { id: "wait", label: "Wait for user callback next week before any revocation" },
      ],
      correctOrder: ["revoke", "consent", "pwd", "hunt"],
      orderSuccess:
        "Revoke tokens first, strip consent, rotate credentials, then hunt persistence across mail and Graph.",
    }),
  ],

  "keytrain-email-security": [
    visualStep("viz-hard-ato-flow", "Account takeover persistence", {
      kind: "flow",
      subtitle: "After phish succeeds, attackers hide in rules and OAuth.",
      frames: [
        {
          label: "Credential theft via phish or password reuse",
          why: "First foothold—MFA fatigue and session cookie theft are variants.",
          svg: svgEmailPath(),
        },
        {
          label: "Hidden inbox rule forwards mail externally",
          why: "Users rarely check rules—automate hunts after any ATO declaration.",
          svg: svgEmailPath(),
        },
        {
          label: "OAuth app consent added for persistent Graph access",
          why: "Mail access without repeated password entry—review enterprise apps quarterly.",
          svg: svgEmailPath(),
        },
      ],
    }),
    visualStep("viz-hard-dmarc", "SPF pass, DMARC fail — BEC angle", {
      kind: "compare",
      subtitle: "Why authentication alignment matters on cousin domains.",
      leftSvg: svgEmailPath(),
      rightSvg: svgPhishLayers(),
      left: {
        title: "SPF passes on sending infrastructure",
        body: "Envelope sender can be unrelated to the visible From: address users trust.",
      },
      right: {
        title: "DMARC alignment required",
        body: "Organizational domain must align with From:—stops many look-alike wire-fraud domains.",
      },
    }),
    visualStep("viz-hard-mailbox-order", "Executive mailbox rule — IR order", {
      kind: "order",
      subtitle: "Transport rule BCCs external archive — order first actions.",
      orderItems: [
        { id: "disable", label: "Disable account and revoke all sessions" },
        { id: "hunt", label: "Hunt inbox/transport rules and OAuth apps tenant-wide" },
        { id: "ual", label: "Preserve unified audit log and mailbox export" },
        { id: "user", label: "Ask user to delete the rule and monitor" },
      ],
      correctOrder: ["disable", "hunt", "ual"],
      orderSuccess: "Contain identity, hunt persistence, preserve cloud audit evidence.",
    }),
  ],

  "keytrain-data-protection": [
    visualStep("viz-hard-exfil-flow", "OAuth bulk download to personal tenant", {
      kind: "flow",
      subtitle: "Approved SaaS paths are common exfil channels.",
      frames: [
        {
          label: "User authenticates to corporate SaaS with SSO",
          why: "Identity is known—data movement still needs DLP and CASB context.",
          svg: svgDataStates("use"),
        },
        {
          label: "OAuth sync client copies files to personal cloud",
          why: "Labels and CASB policies should block unapproved destinations.",
          svg: svgDataStates("transit"),
        },
        {
          label: "DLP alert or CASB session policy fires",
          why: "Investigate scope, revoke tokens, assess regulatory notification.",
          svg: svgDataStates("rest"),
        },
      ],
    }),
    visualStep("viz-hard-public-bucket", "Public snapshot of production data", {
      kind: "compare",
      baseSvg: svgDataStates("rest"),
      left: {
        title: "Public ACL on copy of prod DB",
        body: "Potential reportable breach—invoke IR, revoke keys, forensic scope.",
      },
      right: {
        title: "Private encrypted bucket with logging",
        body: "Access denied by default; CloudTrail shows who touched objects.",
      },
    }),
    visualStep("viz-hard-breach-order", "Data spill response order", {
      kind: "order",
      subtitle: "Engineer copied prod to personal cloud with public ACL — order IR.",
      orderItems: [
        { id: "ir", label: "Invoke IR, revoke credentials, block public access" },
        { id: "assess", label: "Assess regulated data and notification duties" },
        { id: "rename", label: "Rename bucket and continue debugging" },
        { id: "ignore", label: "Delete quietly; no breach if removed within a year" },
      ],
      correctOrder: ["ir", "assess"],
      orderSuccess: "Treat as incident first—legal/privacy assessment follows evidence.",
    }),
  ],

  "keytrain-endpoint-security": [
    visualStep("viz-hard-lolbin", "LOLBins + ransomware precursors", {
      kind: "flow",
      subtitle: "EDR alerts on living-off-the-land before encryption.",
      frames: [
        {
          label: "rundll32 loads DLL from user-writable path",
          why: "Common staging—correlate with parent process and code signing.",
          svg: svgEndpointInfection(1),
        },
        {
          label: "vssadmin delete shadows / bcdedit recovery disabled",
          why: "High-fidelity ransomware precursor—isolate immediately.",
          svg: svgEndpointInfection(2),
        },
        {
          label: "Outbound beacon to rare IP or domain",
          why: "Network isolate host, preserve memory, block IOCs tenant-wide.",
          svg: svgEndpointInfection(3),
        },
      ],
    }),
    visualStep("viz-hard-edr-tamper", "EDR bypass via vulnerable driver", {
      kind: "compare",
      baseSvg: svgEndpointInfection(1),
      left: {
        title: "Unsigned kernel driver loaded",
        body: "Bring-your-own-vulnerable-driver can blind or kill EDR from kernel mode.",
      },
      right: {
        title: "Driver blocklist + tamper protection on",
        body: "Block known-vulnerable drivers; alert on EDR service stoppage.",
      },
    }),
    visualStep("viz-hard-ransom-order", "Ransomware — enterprise containment order", {
      kind: "order",
      subtitle: "VSS deleted + beacon detected — order SOC response.",
      orderItems: [
        { id: "iso", label: "Network isolate host; preserve disk and memory" },
        { id: "ir", label: "Escalate IR; block IOCs across environment" },
        { id: "reboot", label: "Reboot repeatedly to clear infection" },
        { id: "pay", label: "Pay ransom immediately without telling anyone" },
      ],
      correctOrder: ["iso", "ir"],
      orderSuccess: "Contain and preserve evidence before recovery decisions.",
    }),
  ],

  "keytrain-network-security": [
    visualStep("viz-hard-segment", "East-west SMB spread", {
      kind: "flow",
      subtitle: "Architectural response to ransomware lateral movement.",
      frames: [
        {
          label: "Workstation-to-workstation SMB allowed",
          why: "Ransomware and worms traverse flat networks in minutes.",
          svg: svgNetworkZones(),
        },
        {
          label: "Default-deny microsegmentation between tiers",
          why: "Identity-aware policies limit blast radius per workload.",
          svg: svgNetworkZones(),
        },
        {
          label: "ZTNA for admin and sensitive apps",
          why: "Replace VPN flat access with per-app identity checks.",
          svg: svgNetworkZones(),
        },
      ],
    }),
    visualStep("viz-hard-doh", "Encrypted DNS (DoH) bypass", {
      kind: "compare",
      baseSvg: svgNetworkZones(),
      left: {
        title: "DoH to consumer resolver",
        body: "Corporate DNS filtering and logging bypassed—users still resolve malware domains.",
      },
      right: {
        title: "Managed DoH + egress allow list",
        body: "Offer controlled encrypted DNS; block unsanctioned DoH endpoints on firewall.",
      },
    }),
    visualStep("viz-hard-lateral-order", "Ransomware on VLAN — long-term fix order", {
      kind: "order",
      subtitle: "SMB storms between user subnets — prioritize architecture.",
      orderItems: [
        { id: "seg", label: "East-west default-deny segmentation with identity policies" },
        { id: "flat", label: "Keep flat /16 for helpdesk simplicity" },
        { id: "log", label: "Disable NetFlow to save storage" },
        { id: "rdp", label: "Open RDP from internet for faster support" },
      ],
      correctOrder: ["seg"],
      orderSuccess: "Segmentation is the primary brake on lateral movement.",
    }),
  ],

  "keytrain-system-hygiene": [
    visualStep("viz-hard-kev", "KEV + public exploit on VPN edge", {
      kind: "flow",
      subtitle: "Risk-based patching when exploit is in the wild.",
      frames: [
        {
          label: "CVE added to CISA KEV with public exploit code",
          why: "Internet-facing edge devices are emergency SLA regardless of normal cadence.",
          svg: svgEndpointInfection(0),
        },
        {
          label: "Compensating WAF/rate limits while patch staged",
          why: "Reduce exposure until maintenance window completes.",
          svg: svgEndpointInfection(1),
        },
        {
          label: "Emergency change installs vendor fix",
          why: "Validate integrity and monitor for IOCs post-compromise.",
          svg: svgEndpointInfection(2),
        },
      ],
    }),
    visualStep("viz-hard-sbom", "SBOM when library CVE drops", {
      kind: "compare",
      baseSvg: svgAppLayers("app"),
      left: {
        title: "No component inventory",
        body: "Teams grep repos manually—slow blast-radius analysis after Log4j-style events.",
      },
      right: {
        title: "SBOM in CI/CD",
        body: "Quickly list services shipping the vulnerable package version.",
      },
    }),
    visualStep("viz-hard-patch-order", "KEV edge device — decision order", {
      kind: "order",
      subtitle: "Patch staged 30 days out; exploit public — order actions.",
      orderItems: [
        { id: "emergency", label: "Emergency change within hours + compensating controls" },
        { id: "wait", label: "Wait 30 days on standard cadence" },
        { id: "logs", label: "Disable logging to improve VPN throughput" },
        { id: "publish", label: "Publish exploit internally for awareness only" },
      ],
      correctOrder: ["emergency"],
      orderSuccess: "KEV + public exploit on edge = hours, not months.",
    }),
  ],

  "keytrain-application-security": [
    visualStep("viz-hard-ssrf", "SSRF to cloud metadata", {
      kind: "flow",
      subtitle: "Server-side fetch to 169.254.169.254 steals role credentials.",
      frames: [
        {
          label: "User-supplied URL fetched server-side",
          why: "Attackers pivot to link-local and internal IPs—block metadata in egress.",
          svg: svgAppLayers("user"),
        },
        {
          label: "Application reaches instance metadata service",
          why: "IMDSv2 and network ACLs reduce credential theft from apps.",
          svg: svgAppLayers("app"),
        },
        {
          label: "Keys used from attacker infrastructure",
          why: "Rotate credentials, scope IAM down, add WAF rules on URL fetch feature.",
          svg: svgAppLayers("db"),
        },
      ],
    }),
    visualStep("viz-hard-jwt", "JWT algorithm confusion", {
      kind: "compare",
      baseSvg: svgAppLayers("app"),
      left: {
        title: "Server trusts client alg header",
        body: "RS256 token re-signed with HS256 using public key as HMAC secret.",
      },
      right: {
        title: "Pinned allowed algorithms",
        body: "Reject none/ambiguous algs; validate with intended asymmetric keys only.",
      },
    }),
    visualStep("viz-hard-ssrf-order", "SSRF finding — remediation order", {
      kind: "order",
      subtitle: "Logs show metadata access — order engineering fixes.",
      orderItems: [
        { id: "block", label: "Block link-local/metadata egress; rotate cloud keys" },
        { id: "validate", label: "Fix URL validation and allowlist destinations" },
        { id: "ignore", label: "Mark as informational; health checks use same path" },
        { id: "waf", label: "WAF only at edge; no app code changes" },
      ],
      correctOrder: ["block", "validate"],
      orderSuccess: "Network controls plus code fix—WAF alone misses internal SSRF.",
    }),
  ],

  "keytrain-financial-security": [
    visualStep("viz-hard-deepfake", "Deepfake voice + DMARC-pass email", {
      kind: "flow",
      subtitle: "Layered fraud bypasses single-channel trust.",
      frames: [
        {
          label: "Compromised executive mailbox sends wire instructions",
          why: "DMARC may pass on real domain—email alone is insufficient.",
          svg: svgWireVerify(),
        },
        {
          label: "AI-cloned voice urges urgency on phone",
          why: "Voice can be faked—callback policy must use known numbers.",
          svg: svgWireVerify(),
        },
        {
          label: "Dual approval + verbal callback stops payment",
          why: "Process controls survive ATO and deepfake channels.",
          svg: svgWireVerify(),
        },
      ],
    }),
    visualStep("viz-hard-erp", "Vendor master tampering", {
      kind: "compare",
      baseSvg: svgWireVerify(),
      left: {
        title: "Same user creates and approves vendor",
        body: "SoD failure—bank account field changes go unnoticed.",
      },
      right: {
        title: "SoD + field-level alerts + dual payment approval",
        body: "Catches master-data fraud before funds leave.",
      },
    }),
    visualStep("viz-hard-wire-order", "Deepfake wire — control gap order", {
      kind: "order",
      subtitle: "CFO voice approves $2M; email on real domain — prioritize controls.",
      orderItems: [
        { id: "callback", label: "Mandatory callback to known contacts + dual approval on wires" },
        { id: "mailbox", label: "Increase mailbox quota for executives" },
        { id: "social", label: "Require more social media followers for finance team" },
        { id: "pdf", label: "Standardize PDF color profiles on invoices" },
      ],
      correctOrder: ["callback"],
      orderSuccess: "Out-of-band verification and dual control beat synthetic voice and ATO email.",
    }),
  ],

  "keytrain-physical-security": [
    visualStep("viz-hard-badge", "Anti-passback violation + asset loss", {
      kind: "flow",
      subtitle: "Physical indicators correlated with theft.",
      frames: [
        {
          label: "Same badge ID enters twice without exit",
          why: "Suggests cloned badge or tailgating—check CCTV and access logs.",
          svg: svgPhysicalDoor(),
        },
        {
          label: "Servers missing from rack after night entry",
          why: "Correlate physical access with asset inventory alarms.",
          svg: svgPhysicalDoor(),
        },
        {
          label: "Disable badge, audit access, involve facilities and IR",
          why: "Treat as potential insider or external physical breach.",
          svg: svgPhysicalDoor(),
        },
      ],
    }),
    visualStep("viz-hard-implant", "Hardware implant after maintenance", {
      kind: "compare",
      baseSvg: svgPhysicalDoor(),
      left: {
        title: "Unchecked keyboard/dock after vendor visit",
        body: "Inline keyloggers bypass many software controls.",
      },
      right: {
        title: "Inspection + sealed hardware chain of custody",
        body: "High-security areas verify peripherals after maintenance.",
      },
    }),
    visualStep("viz-hard-physical-order", "Badge anomaly — response order", {
      kind: "order",
      subtitle: "Anti-passback disabled; servers missing — order steps.",
      orderItems: [
        { id: "disable", label: "Disable badge, review CCTV, audit access logs" },
        { id: "hvac", label: "Treat as HVAC scheduling issue only" },
        { id: "dns", label: "Flush DNS on domain controllers" },
        { id: "printer", label: "Replace label printer on floor three" },
      ],
      correctOrder: ["disable"],
      orderSuccess: "Physical-security incident path—correlate badge, video, and assets.",
    }),
  ],

  "keytrain-compliance-governance": [
    visualStep("viz-hard-phi-saas", "PHI in unsanctioned chat SaaS", {
      kind: "flow",
      subtitle: "Shadow IT with regulated data triggers breach analysis.",
      frames: [
        {
          label: "Staff pastes PHI into unapproved chat tool",
          why: "No BAA—vendor may store data outside your compliance boundary.",
          svg: svgHipaaFlow(),
        },
        {
          label: "DLP or CASB discovers regulated content",
          why: "Block OAuth, preserve evidence, notify privacy officer.",
          svg: svgHipaaFlow(),
        },
        {
          label: "Risk analysis for HIPAA breach notification",
          why: "Document scope, affected individuals, and remediation timeline.",
          svg: svgHipaaFlow(),
        },
      ],
    }),
    visualStep("viz-hard-risk-register", "Deferred critical pen-test finding", {
      kind: "compare",
      baseSvg: svgHipaaFlow(),
      left: {
        title: "Finding deferred with no risk entry",
        body: "Audit failure and unmanaged liability—no owner or deadline.",
      },
      right: {
        title: "Risk register: accept/mitigate/transfer",
        body: "Executive sign-off, compensating controls, and review date required.",
      },
    }),
    visualStep("viz-hard-hipaa-order", "PHI in shadow SaaS — order actions", {
      kind: "order",
      subtitle: "500+ records in chat without BAA — HIPAA order.",
      orderItems: [
        { id: "ir", label: "Invoke IR; notify privacy officer; assess notification" },
        { id: "delete", label: "Delete chat only; no documentation" },
        { id: "post", label: "Post sample PHI publicly to confirm sensitivity" },
        { id: "email", label: "Disable all corporate email for 48 hours" },
      ],
      correctOrder: ["ir"],
      orderSuccess: "Privacy and security process drives containment and legal analysis.",
    }),
  ],
};
