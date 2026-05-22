"""Additional length-balanced scenario MCQs (one per domain) for larger, fairer exam pools."""

from __future__ import annotations

from question_bank.key_training_questions import QuestionTemplate

# (stem, correct, [wrong×3], explanation) — options authored with similar word counts
EXTENDED_BY_DOMAIN: dict[str, list[QuestionTemplate]] = {
    "authentication": [
        (
            "IdP logs show successful logins for a disabled contractor account. What is the BEST remediation?",
            "Disable federation to the account, revoke refresh tokens, and audit provisioning sync jobs",
            [
                "Re-enable the account so the contractor can finish work without delay",
                "Reset only the contractor password while leaving all active sessions valid",
                "Publish the contractor credentials in the ticket for faster troubleshooting",
            ],
            "Disabled accounts should not authenticate; broken deprovisioning or stale federation mappings need fixing.",
        ),
    ],
    "mfa": [
        (
            "Security wants MFA for all VPN users; help desk reports 40% lockouts after rollout. Best NEXT step?",
            "Analyze failure reasons, offer phishing-resistant options, and targeted training for edge cases",
            [
                "Remove MFA from VPN entirely to restore previous login success rates quickly",
                "Set MFA remember-me to ninety days on all devices without reviewing risk",
                "Allow SMS-only MFA permanently because it has the lowest support burden",
            ],
            "MFA rollouts need tuning and user support; abandoning MFA removes a critical control.",
        ),
    ],
    "privilege-escalation": [
        (
            "Cloud audit shows a Lambda role with iam:PassRole and sts:AssumeRole on admin roles. Risk?",
            "Attackers who compromise the function can chain roles to obtain administrative cloud access",
            [
                "PassRole only affects billing reports and cannot change infrastructure permissions",
                "AssumeRole is safe when the function code is stored in a private repository",
                "Removing MFA from the function owner prevents lockouts during deployments",
            ],
            "Overly broad execution roles are a common cloud privilege-escalation path.",
        ),
    ],
    "account-misuse": [
        (
            "Service desk creates generic 'team-admin' accounts shared by three shifts. Primary concern?",
            "Shared privileged accounts prevent attribution and violate individual accountability controls",
            [
                "Shared accounts improve password memorization and reduce forgotten-password tickets",
                "Generic names make SIEM correlation easier than per-user accounts would",
                "Shift-based sharing is acceptable if the password is rotated every five years",
            ],
            "Accountability requires per-person identities, especially for administrative access.",
        ),
    ],
    "credential-abuse": [
        (
            "Okta ThreatInsight flags cred-stuffing against your customer portal. FIRST technical response?",
            "Enable breached-credential detection, step-up MFA, and temporary IP rate limits on auth endpoints",
            [
                "Disable customer logins globally until marketing approves a customer communication",
                "Lower password length to six characters to reduce typing errors during attacks",
                "Publish successful login counts on the status page to prove transparency",
            ],
            "Credential stuffing needs rate limits, MFA, and detection—not global lockout without analysis.",
        ),
    ],
    "phishing": [
        (
            "Users report a Teams message with a QR code linking to a fake O365 login. Best containment?",
            "Remove messages org-wide, block the URL at proxy, and force password reset for submitters",
            [
                "Ask users to scan the QR with personal phones to verify if it is malicious",
                "Disable Teams chat for all users until the next quarterly security training",
                "Forward the QR image to external researchers before taking internal action",
            ],
            "Quishing bypasses email filters; rapid takedown and credential resets limit harm.",
        ),
    ],
    "spoofing": [
        (
            "DMARC aggregate reports show 12% of mail using your domain fails alignment from unknown IPs. Action?",
            "Move DMARC policy toward quarantine/reject after fixing authorized senders and DKIM signing",
            [
                "Set DMARC to none permanently because reports are sufficient protection",
                "Disable SPF because it conflicts with mailing lists and marketing tools",
                "Allow all IPs to send as your domain to simplify vendor onboarding",
            ],
            "DMARC enforcement stops many spoofed messages once legitimate sources are aligned.",
        ),
    ],
    "malicious-attachments": [
        (
            "An attachment is a .html file claiming to be an invoice preview. Safest handling?",
            "Quarantine and detonate in sandbox; block HTML attachments at gateway if not business-required",
            [
                "Open in the default browser on a finance workstation to verify the vendor name",
                "Rename to .txt so the mail client will not flag it as dangerous content",
                "Ask the sender to resend as a password-protected executable for integrity",
            ],
            "HTML attachments can phish or download payloads; sandbox before any user interaction.",
        ),
    ],
    "bec": [
        (
            "AP receives email changing ACH details for a top vendor; phone number in signature is new. Step?",
            "Call the vendor using the phone number in the ERP vendor master, not the email",
            [
                "Process the change if the email uses the vendor logo and familiar font styling",
                "Reply in-thread to confirm because the sender domain looks similar to the real one",
                "Forward the request to the CEO for one-click approval to meet quarter-end deadlines",
            ],
            "BEC payment changes must be verified out-of-band with trusted contact data.",
        ),
    ],
    "sensitive-exposure": [
        (
            "A researcher finds patient MRNs in a public analytics dashboard screenshot on LinkedIn. FIRST step?",
            "Take the dashboard offline, preserve access logs, and start incident/breach assessment",
            [
                "Ask the researcher to delete their post before IT investigates the dashboard",
                "Change dashboard colors so MRNs are harder to read in future screenshots",
                "Ignore because social media posts are outside the organization's control boundary",
            ],
            "Confirmed PHI exposure requires immediate containment and regulated breach evaluation.",
        ),
    ],
    "encryption": [
        (
            "Developers store TLS private keys in the application Git repo for 'deployment speed.' Fix?",
            "Move keys to a managed secrets store with rotation and remove keys from Git history",
            [
                "Encrypt the Git repo password while keeping keys in the same repository tree",
                "Use longer RSA keys in Git without changing storage or access controls",
                "Share the repo with all contractors to improve on-call coverage",
            ],
            "Private keys in VCS are exposed to anyone with repo access; use HSM/KMS-backed secrets.",
        ),
    ],
    "dlp": [
        (
            "Engineers paste production database connection strings into a public Slack channel. Response?",
            "Rotate credentials, purge channel history per policy, and enable DLP for chat exfil patterns",
            [
                "Delete the Slack workspace and recreate it weekly to limit historical exposure",
                "Trust that Slack encryption makes public channel secrets safe from attackers",
                "Ask engineers to use code comments instead of chat for sharing secrets",
            ],
            "Secrets in chat are credential exposure; rotate and add preventive DLP controls.",
        ),
    ],
    "removable-media": [
        (
            "A conference hands out branded USB drives at your booth. Security recommendation?",
            "Do not insert into corporate systems; destroy or scan only in an isolated lab machine",
            [
                "Autorun the drive on a reception PC to display the marketing PDF quickly",
                "Distribute drives to executives first because they have the latest patches",
                "Store drives in the server room safe as backup media for nightly jobs",
            ],
            "Untrusted USB media is a common initial-access vector; never trust giveaway drives.",
        ),
    ],
    "backups": [
        (
            "Immutable backups are enabled, but backup admin can delete vault locks. Best improvement?",
            "Separate backup admin with MFA, dual control on lock changes, and alert on deletion APIs",
            [
                "Use one cloud root account for production and backups to simplify billing",
                "Disable immutability during incidents so ransomware can be deleted faster",
                "Store backup credentials in the same wiki page as production admin passwords",
            ],
            "Backup protection fails if the same identity can delete production and backups.",
        ),
    ],
    "malware": [
        (
            "EDR detects a living-off-the-land script spawning rundll32 from WinWord. Next step?",
            "Isolate the host, collect triage package, and hunt for lateral movement from that user",
            [
                "Add a firewall rule blocking Word globally without examining the endpoint",
                "Whitelist rundll32 because it is a signed Microsoft binary on all systems",
                "Reboot once and close the ticket if the user can open documents again",
            ],
            "Office spawning rundll32 is suspicious; isolate and investigate before declaring clean.",
        ),
    ],
    "ransomware": [
        (
            "A subsidiary reports encrypted file shares but still has network connectivity. IMMEDIATE action?",
            "Segment affected VLANs and disable compromised service accounts per runbook",
            [
                "Pay a small ransom immediately to test whether attackers provide working keys",
                "Restore from the newest online snapshot without verifying backup integrity first",
                "Announce full recovery on social media to reassure customers during investigation",
            ],
            "Segmentation limits spread; preserve evidence before mass restore attempts.",
        ),
    ],
    "process-analysis": [
        (
            "Sysmon shows powershell.exe -enc launching from excel.exe with outbound 443. Meaning?",
            "Likely macro-driven execution downloading or executing a second-stage payload",
            [
                "Normal Excel behavior when opening any spreadsheet from email attachments",
                "Indicates a printer driver update scheduled by Windows Update automatically",
                "Proof that TLS inspection is misconfigured on the perimeter firewall only",
            ],
            "Encoded PowerShell from Office is a classic malware staging pattern.",
        ),
    ],
    "persistence": [
        (
            "Autoruns shows an unknown scheduled task calling a binary in %ProgramData%. Action?",
            "Disable the task, quarantine the binary, and search for other hosts with same hash",
            [
                "Delete only the task file so the binary remains for future malware research",
                "Ignore if the binary is larger than one megabyte because large files are safe",
                "Reboot the PC once without collecting logs to clear persistence automatically",
            ],
            "Unknown scheduled tasks with unusual paths warrant hunt and remediation.",
        ),
    ],
    "av-status": [
        (
            "GPO audit shows 18% of laptops with Defender disabled by local admin tools. Fix?",
            "Enforce tamper protection via policy and investigate who disabled protection",
            [
                "Remove AV entirely on those laptops to improve boot time for sales staff",
                "Allow users to disable AV during presentations without logging events",
                "Whitelist all unsigned drivers to prevent future Defender alerts",
            ],
            "Disabled endpoint protection is a critical finding; restore centrally managed AV/EDR.",
        ),
    ],
    "ids-ips": [
        (
            "IPS blocks a SQL injection attempt against a legacy app, but app logs show no WAF upstream. Concern?",
            "IPS may be blind to internal or TLS-east traffic; fix the application and add WAF in depth",
            [
                "IPS blocks mean the application source code is now fully patched automatically",
                "Disable IPS because blocking attacks might upset legitimate penetration testers",
                "Move the database to the DMZ to reduce latency for external customers",
            ],
            "IPS is compensating control; vulnerable apps still need code-level fixes.",
        ),
    ],
    "port-anomalies": [
        (
            "NetFlow shows workstations initiating SMB(445) to hundreds of internal hosts at night. Likely?",
            "Lateral movement or worm-like propagation requiring isolation and EDR hunt",
            [
                "Normal Windows Update behavior that security should ignore completely",
                "Evidence that DNS filtering is misconfigured on guest Wi-Fi only",
                "Proof that users need local admin to fix printer drivers faster",
            ],
            "Mass internal SMB from workstations is abnormal and often post-compromise.",
        ),
    ],
    "beaconing": [
        (
            "Proxy logs show 64-byte HTTPS posts every 60 seconds to a rare domain for one host. Interpretation?",
            "Possible command-and-control beacon deserving host isolation and PCAP capture",
            [
                "Typical video streaming adaptive bitrate behavior from a browser tab",
                "Sign that patch management failed on printers in the finance VLAN",
                "Benign telemetry unless more than ten thousand hosts show the pattern",
            ],
            "Regular small periodic callbacks are classic beaconing indicators.",
        ),
    ],
    "arp-spoofing": [
        (
            "Users report SSL warnings only on the office Wi-Fi, not VPN. Suspected cause?",
            "On-path attacker performing ARP spoofing or rogue AP with malicious certificate",
            [
                "Expired corporate code-signing certificate on the domain controllers only",
                "Misconfigured SPF records for the company's marketing email domain",
                "Routine Windows patch Tuesday reboot affecting laptops temporarily",
            ],
            "Wi-Fi-only cert warnings may indicate MITM on local LAN.",
        ),
    ],
    "dns-tunneling": [
        (
            "DNS analytics show long random subdomains to a newly registered domain from one server. Action?",
            "Block the domain, isolate the server, and inspect processes making DNS queries",
            [
                "Increase DNS TTL globally to reduce query volume on resolvers",
                "Allow the traffic because DNS is encrypted with DNSSEC by default",
                "Disable DNS logging to improve resolver performance during business hours",
            ],
            "High-entropy subdomains may encode exfiltrated data via DNS tunneling.",
        ),
    ],
    "traffic-inspection": [
        (
            "Security proposes TLS decryption for egress web traffic on corporate proxies. Main benefit?",
            "Detect malware C2 and data exfil hidden inside HTTPS that firewalls otherwise cannot see",
            [
                "Eliminate the need for endpoint antivirus on all managed laptops",
                "Guarantee end users cannot visit phishing sites without any false positives",
                "Replace the need for patch management on internet-facing servers",
            ],
            "Inspection reveals threats inside encrypted traffic with appropriate privacy safeguards.",
        ),
    ],
    "patching": [
        (
            "CISA adds a VPN vendor CVE to KEV; your appliance is two versions behind. Priority?",
            "Emergency patch or isolate VPN per vendor advisory within hours, not next quarter",
            [
                "Wait for the next penetration test to validate exploitability in your environment",
                "Disable automatic updates on the VPN to prevent unexpected reboots during holidays",
                "Publish the CVE internally but defer patching until budget approval next year",
            ],
            "Known exploited vulnerabilities on edge VPNs are top patching priority.",
        ),
    ],
    "outdated-software": [
        (
            "A critical app requires Java 8 with no vendor roadmap; server sits in the DMZ. Mitigation?",
            "Segment heavily, monitor closely, and fund migration with documented risk acceptance",
            [
                "Move the server to the internal LAN without segmentation to reduce latency",
                "Install additional antivirus products until three vendors report clean scans",
                "Disable TLS on the app to improve performance for external customers",
            ],
            "Unsupported runtimes need network isolation and a retirement plan.",
        ),
    ],
    "config-drift": [
        (
            "CSPM reports public SSH open on a prod instance that Terraform should manage privately. Fix?",
            "Revert drift via IaC pipeline, investigate manual change, and enforce policy-as-code guardrails",
            [
                "Snapshot the instance and advertise SSH in the security newsletter as a feature",
                "Disable CSPM because Terraform already ran successfully last year",
                "Add the security group rule to the template so drift becomes permanent",
            ],
            "Drift from IaC baselines should be corrected and prevented with guardrails.",
        ),
    ],
    "update-compliance": [
        (
            "Only 62% of laptops meet the 14-day critical patch SLA. Best program improvement?",
            "Report by business unit, enforce maintenance windows, and escalate chronic noncompliance",
            [
                "Extend SLA to one year for all devices to achieve one hundred percent compliance",
                "Stop measuring compliance because users dislike reboot notifications",
                "Allow users to opt out of updates if they sign a paper waiver",
            ],
            "Metrics and accountability drive patch compliance, not indefinite SLAs.",
        ),
    ],
    "unsupported-os": [
        (
            "Medical devices run Windows 7 embedded with no vendor patch path. Control?",
            "Network isolate devices, monitor east-west traffic, and document compensating controls",
            [
                "Connect devices directly to the internet for vendor remote support convenience",
                "Upgrade to Windows 7 SP1 because service packs extend official support forever",
                "Disable encryption on device traffic to simplify legacy protocol troubleshooting",
            ],
            "Unsupported OS on IoMT needs segmentation and explicit risk acceptance.",
        ),
    ],
    "vulnerable-apps": [
        (
            "Bug bounty reports IDOR on an API returning other users' orders by changing ?userId=. Fix?",
            "Enforce server-side authorization checks on every object reference, then regression test",
            [
                "Hide the parameter in client-side JavaScript so users cannot easily edit it",
                "Rate-limit the API to one request per day without fixing authorization logic",
                "Close the report because the app uses HTTPS which encrypts parameter tampering",
            ],
            "IDOR is an authorization flaw; TLS does not substitute for access control.",
        ),
    ],
    "insecure-coding": [
        (
            "A Node service builds SQL with template literals including user search terms. Risk?",
            "SQL injection allowing data theft or authentication bypass against the database",
            [
                "No risk because Node is JavaScript and therefore memory-safe against injection",
                "Low risk if the database is hosted inside the same VPC as the application",
                "Fixed by minifying the source code before deploying to production containers",
            ],
            "Dynamic SQL concatenation is unsafe; use parameterized queries or ORM bindings.",
        ),
    ],
    "exploits": [
        (
            "Threat actors weaponize a Citrix ADC flaw within 24 hours of disclosure. Your edge uses ADC. Step?",
            "Apply vendor hotfix or WAF virtual patch immediately and hunt for IOCs on appliances",
            [
                "Schedule remediation at the next monthly maintenance window without monitoring",
                "Disable all VPN until the next major version upgrade in six months",
                "Rely on users to report slowness as the primary exploitation detection method",
            ],
            "Edge appliances with active exploitation need emergency patching and threat hunting.",
        ),
    ],
    "sast": [
        (
            "SAST flags deserialization of untrusted data in a Java admin servlet. Why critical?",
            "Remote attackers may execute arbitrary code via gadget chains during deserialization",
            [
                "Deserialization only affects JSON field names in mobile clients, not servers",
                "Finding is informational because the servlet requires HTTPS in production",
                "SAST cannot detect real issues; developers should ignore Java findings",
            ],
            "Unsafe deserialization is a frequent RCE path in enterprise Java apps.",
        ),
    ],
    "fraud-indicators": [
        (
            "Payroll adds a new bank account for an employee who did not request a change. Indicator?",
            "Possible payroll diversion fraud requiring HR verification before payment",
            [
                "Routine HR system bug that should be ignored if pay amount is unchanged",
                "Evidence that multifactor authentication on email is unnecessary for finance",
                "Normal behavior when employees travel internationally for conferences",
            ],
            "Unrequested payroll account changes are a classic fraud indicator.",
        ),
    ],
    "accounting-integrity": [
        (
            "Auditors find journal entries posted after close without approval workflow. Issue?",
            "Breaks segregation of duties and enables post-close financial manipulation",
            [
                "Improves agility because accountants can fix numbers faster without delays",
                "Required for real-time dashboards and therefore always acceptable",
                "Only a problem if the company is publicly traded on major exchanges",
            ],
            "Post-close entries need the same approval and audit trail as regular entries.",
        ),
    ],
    "workflow-protection": [
        (
            "Wire transfers under $25k auto-approve if initiated by finance managers. Risk?",
            "Fraudsters can split large thefts into smaller wires bypassing dual control thresholds",
            [
                "Improves security because smaller amounts are never targeted by criminals",
                "Eliminates the need for out-of-band verification on any payment change",
                "Required by PCI-DSS for all card-not-present transactions globally",
            ],
            "Threshold-based auto-approval enables structuring; use consistent dual control.",
        ),
    ],
    "invoice-manipulation": [
        (
            "PDF invoice metadata shows different authoring software than prior invoices from the vendor. Action?",
            "Hold payment and verify with vendor through established contacts; hunt for BEC",
            [
                "Pay immediately because PDF files cannot be altered once exported",
                "Trust the invoice if the total matches the purchase order within ten percent",
                "Post the PDF on the intranet so AP can crowdsource authenticity checks",
            ],
            "Metadata anomalies may signal forged invoices in BEC campaigns.",
        ),
    ],
    "unauthorized-access": [
        (
            "Tailgating incidents rise after badge readers fail open during a fire drill. Mitigation?",
            "Repair readers, reinforce training, and add reception or camera verification during peaks",
            [
                "Remove badges and use honor-system sign-in sheets at the front desk",
                "Prop doors during business hours to reduce reader wear and tear",
                "Disable fire alarms to prevent future fail-open events on the access system",
            ],
            "Fail-open events increase tailgating; combine physical controls with awareness.",
        ),
    ],
    "device-theft": [
        (
            "An employee's encrypted laptop is stolen from a car; BitLocker was on but the session unlocked. Risk?",
            "Data at rest is protected; data in use may be accessible until credentials are rotated",
            [
                "No risk because theft of encrypted devices never leads to data disclosure",
                "Risk only if the laptop was not registered in the asset inventory spreadsheet",
                "Fixed automatically when the user changes their desktop wallpaper",
            ],
            "Encryption helps at rest; unlocked sessions may still expose data and tokens.",
        ),
    ],
    "badge-access": [
        (
            "Terminated employee's badge still opens the lab overnight. Root cause to fix FIRST?",
            "Physical access system not integrated with HR termination feed or guard tour process",
            [
                "Employee remembered the door code written on a sticky note near the reader",
                "CCTV retention too short to identify who entered the lab",
                "Need for longer passwords on employee email accounts",
            ],
            "Badge deprovisioning must be tied to HR status in real time.",
        ),
    ],
    "cctv": [
        (
            "Legal asks whether lobby cameras can use facial recognition for 'security.' Concern?",
            "Privacy impact, consent, retention limits, and bias risks require legal/privacy review",
            [
                "Facial recognition has no compliance implications if video stays on-prem",
                "HIPAA requires facial recognition in all healthcare lobbies by default",
                "CCTV cannot be used for security purposes in commercial buildings",
            ],
            "Biometric surveillance needs DPIA and policy alignment before deployment.",
        ),
    ],
    "hipaa": [
        (
            "A vendor offers free analytics on ePHI if they sign a BAA. What must you verify?",
            "BAA terms, minimum necessary data shared, subprocessors, and breach notification duties",
            [
                "HIPAA does not apply if the vendor stores data in the United States only",
                "Free services are exempt from business associate requirements automatically",
                "Encryption at rest removes the need for any vendor contract review",
            ],
            "Business associates need BAAs with explicit permitted uses and safeguards.",
        ),
    ],
    "policy-adherence": [
        (
            "Developers bypass code review using emergency break-glass accounts weekly. Issue?",
            "Break-glass is being normalized; tighten approvals, logging, and time limits",
            [
                "Shows healthy agility; break-glass should replace standard change management",
                "Proves MFA is unnecessary for engineers who understand security",
                "Required for SOC 2 Type I reports only, not operational security",
            ],
            "Emergency access must be rare, logged, and reviewed—not a daily workflow.",
        ),
    ],
    "audit-readiness": [
        (
            "Auditors request proof of privileged access reviews; team has screenshots but no tickets. Gap?",
            "Lack of traceable workflow and evidence tying reviews to remediation actions",
            [
                "Screenshots are always sufficient if stored on a shared drive",
                "Audits should not cover identity governance in technology companies",
                "Privileged access reviews are optional under all frameworks",
            ],
            "Audit evidence needs systems of record, not informal images alone.",
        ),
    ],
    "documentation": [
        (
            "Incident response fails because network diagrams are six years out of date. Improvement?",
            "Maintain living diagrams tied to CMDB changes with quarterly validation owners",
            [
                "Delete diagrams to force engineers to memorize the network instead",
                "Outsource documentation only after major incidents occur",
                "Use oral tradition during onboarding instead of written runbooks",
            ],
            "Accurate documentation speeds containment and communication during incidents.",
        ),
    ],
    "risk-management": [
        (
            "Leadership accepts ransomware risk without backup testing or IR exercises. Problem?",
            "Risk acceptance lacks controls and testing; likely ineffective during real events",
            [
                "Acceptance automatically transfers liability to the cyber insurance carrier",
                "Risk register entries never need review once leadership signs them",
                "Exercises are optional if endpoint antivirus is installed",
            ],
            "Accepted risks still need compensating controls and validation.",
        ),
    ],
}
