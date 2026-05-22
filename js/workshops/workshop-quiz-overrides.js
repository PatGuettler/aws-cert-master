/**
 * Plausible near-miss distractors (similar detail to correct answers, slightly wrong).
 * Keys: workshop category id + quiz key (q1/q2/hard_q1/quiz-mfa/scenario-admin, etc.)
 */

/** @type {Record<string, Record<string, { options: { id: string, text: string }[], correct?: string[] }>>} */
const OVERRIDES = {
  "keytrain-identity-access": {
    hard_q1: {
      options: [
        {
          id: "a",
          text: "Revoke refresh tokens, disable enterprise app consent, reset password, hunt mailbox rules and delegates",
        },
        {
          id: "b",
          text: "Revoke refresh tokens and reset password, but leave OAuth consent enabled until the user confirms by email",
        },
        {
          id: "c",
          text: "Disable OAuth consent and review inbox rules, defer password reset and session revocation until business hours",
        },
        {
          id: "d",
          text: "Force password reset and require MFA on next sign-in, postpone token revocation and tenant-wide rule hunts until Monday",
        },
      ],
    },
    hard_q2: {
      options: [
        {
          id: "a",
          text: "Spike of TGS-REQ for service accounts with RC4-HMAC encryption types from a non-admin workstation",
        },
        {
          id: "b",
          text: "Correlated help-desk password reset ticket for the same user during the authentication spike window",
        },
        {
          id: "c",
          text: "Offline cracking activity against service ticket material exported from domain controller logs",
        },
        {
          id: "d",
          text: "Burst of failed interactive logons across many users, consistent with password spray rather than ticket abuse",
        },
      ],
    },
    "quiz-mfa": {
      options: [
        { id: "a", text: "Approve the push to clear the ticket queue, then ask the user later if anything looked odd" },
        { id: "b", text: "Deny the push, report suspected compromise, and work with security on session and password reset" },
        { id: "c", text: "Share your authenticator with a teammate briefly so they can approve legitimate pushes while you are away" },
        { id: "d", text: "Disable MFA on the account to stop duplicate prompts, then re-enable after the ticket closes" },
      ],
    },
    q3: {
      options: [
        { id: "a", text: "Share the password in chat because the sender claims to be support and offered a prize" },
        { id: "b", text: "Refuse; report the contact; use official reset channels if you need account help" },
        { id: "c", text: "Share part of the password now and the remainder after verifying the prize is legitimate" },
        { id: "d", text: "Post the password publicly so the community can flag whether the offer is a scam" },
      ],
    },
    "scenario-admin": {
      options: [
        { id: "a", text: "Remove the Administrators group entry and mark the ticket resolved without further log review" },
        { id: "b", text: "Isolate the host, preserve logs, and escalate to incident response for privilege-abuse investigation" },
        { id: "c", text: "Reboot the laptop to clear transient group membership, then continue monitoring for one week" },
        { id: "d", text: "Reset the user's email password and close the ticket, without checking local group or EDR telemetry" },
      ],
    },
  },
  "keytrain-email-security": {
    hard_q1: {
      options: [
        {
          id: "a",
          text: "Disable the mailbox account, revoke all sessions, hunt transport and inbox rules tenant-wide, preserve unified audit log",
        },
        {
          id: "b",
          text: "Ask the user to delete the suspicious rule themselves, then re-enable mail flow after they confirm",
        },
        {
          id: "c",
          text: "Increase mailbox quota and archive old mail, defer session revocation until the executive returns from travel",
        },
        {
          id: "d",
          text: "Whitelist the external archive domain globally so BCC messages are not delayed by spam filtering",
        },
      ],
    },
    hard_q2: {
      options: [
        {
          id: "a",
          text: "SPF can pass on domains that do not align with the visible From: address; DMARC alignment ties authenticated mail to the From domain",
        },
        { id: "b", text: "SPF failure guarantees phishing; alignment is unnecessary when SPF passes on the envelope domain" },
        { id: "c", text: "DMARC applies only to bulk marketing programs, not wire-fraud or executive impersonation threads" },
        { id: "d", text: "SPF encrypts message bodies end-to-end, which is why cousin domains still fail authentication" },
      ],
    },
    "quiz-phish": {
      options: [
        { id: "a", text: "Click the link immediately so the password reset completes before the account locks" },
        { id: "b", text: "Report the message using the phishing button and wait for security guidance before acting" },
        { id: "c", text: "Forward the email to coworkers to see if they received the same notice" },
        { id: "d", text: "Reply to the sender asking whether the link is legitimate before clicking" },
      ],
    },
    "scenario-bec": {
      options: [
        { id: "a", text: "Process the wire using the bank details in the email thread after confirming the logo looks correct" },
        { id: "b", text: "Hold the payment and call the vendor using a phone number from your ERP vendor master record" },
        { id: "c", text: "Reply-all in the thread to ask the CFO to re-send bank details on letterhead" },
        { id: "d", text: "Forward the invoice to personal email so finance can review it over the weekend" },
      ],
    },
  },
  "keytrain-data-protection": {
    hard_q1: {
      options: [
        {
          id: "a",
          text: "Treat as potential regulatory breach; invoke IR, revoke credentials, assess notification duties and forensic scope",
        },
        {
          id: "b",
          text: "Delete the public snapshot quietly within a year; no breach if the engineer is trusted and deletes quickly",
        },
        {
          id: "c",
          text: "Rename the bucket to a non-obvious label and enable default encryption without incident documentation",
        },
        {
          id: "d",
          text: "Document as a performance tuning exercise; compliance impact is limited to storage cost overruns only",
        },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Block unapproved personal cloud sync clients on managed endpoints via MDM and network controls" },
        { id: "b", text: "Terminate all TLS sessions enterprise-wide so DLP can inspect cleartext payloads" },
        { id: "c", text: "Deploy CASB with session inspection where policy and privacy reviews permit encrypted SaaS visibility" },
        { id: "d", text: "Apply sensitivity labels with encryption and access policies tied to data classification" },
      ],
    },
    "scenario-dlp": {
      options: [
        { id: "a", text: "Rename the spreadsheet with a benign filename so DLP policies no longer match the content" },
        { id: "b", text: "Use the approved secure transfer portal after confirming classification with data owners" },
        { id: "c", text: "Zip the file with a password and email it home because encryption bypasses all DLP scanners" },
        { id: "d", text: "Temporarily disable endpoint DLP agents until the upload finishes, then turn protection back on" },
      ],
    },
  },
  "keytrain-endpoint-security": {
    hard_q1: {
      options: [
        {
          id: "a",
          text: "Network-isolate the host, preserve memory and disk images, escalate IR, block IOCs across the tenant",
        },
        { id: "b", text: "Reboot the workstation to clear malicious processes, then monitor for one hour in normal VLAN" },
        { id: "c", text: "Uninstall EDR to stop noisy alerts, reinstall after the user finishes the current project" },
        { id: "d", text: "Pay the ransom from petty cash to restore files, then reinstall the browser and resume work" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "They allow kernel-mode tampering that can disable or blind endpoint protection agents" },
        { id: "b", text: "They primarily improve laptop battery life by offloading TLS to kernel space" },
        { id: "c", text: "They are required for corporate printing and should be allowlisted by default" },
        { id: "d", text: "They automatically encrypt disks and therefore replace the need for EDR telemetry" },
      ],
    },
    "quiz-ransom": {
      options: [
        { id: "a", text: "Pay the ransom immediately from petty cash so files decrypt before the backup window expires" },
        { id: "b", text: "Disconnect from the network, notify IT or incident response, and preserve evidence for investigation" },
        { id: "c", text: "Reboot repeatedly until extensions revert, then continue emailing attachments from the infected host" },
        { id: "d", text: "Reinstall the web browser only, because most ransomware lives in browser cache not file shares" },
      ],
    },
  },
  "keytrain-network-security": {
    hard_q1: {
      options: [
        { id: "a", text: "Implement east-west default-deny segmentation with identity-aware policies between workload tiers" },
        { id: "b", text: "Maintain a flat /16 user VLAN for operational simplicity and rely on host firewalls alone" },
        { id: "c", text: "Disable NetFlow and PCAP collection to reduce storage costs during the outbreak" },
        { id: "d", text: "Publish RDP to the internet on a non-standard port for faster support during incidents" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Block known consumer DoH endpoints on egress firewalls where policy permits" },
        { id: "b", text: "Offer a managed DoH resolver with logging and acceptable-use enforcement" },
        { id: "c", text: "Disable all DNS resolution internally so applications cannot resolve hostnames" },
        { id: "d", text: "Deploy SWG or ZTNA policies that inspect DNS requests to sanctioned resolvers" },
      ],
    },
    "scenario-arp": {
      options: [
        { id: "a", text: "Duplicate MAC on the default gateway plus internal TLS warnings—likely LAN MITM or rogue DHCP" },
        { id: "b", text: "Slow Wi-Fi association times on guest SSID only, unrelated to certificate trust errors" },
        { id: "c", text: "Spreadsheet macro size limits causing SSL offload failures on the load balancer" },
        { id: "d", text: "Printer spooler jam on floor three correlating with user complaints about latency" },
      ],
    },
  },
  "keytrain-system-hygiene": {
    hard_q1: {
      options: [
        { id: "a", text: "Emergency change within hours plus compensating WAF and rate limits until the vendor patch is applied" },
        { id: "b", text: "Wait for the standard 30-day maintenance window because the firewall has never been exploited internally" },
        { id: "c", text: "Disable security logging on the edge device to improve throughput during peak hours" },
        { id: "d", text: "Publish the public exploit details internally so engineers can test without change control" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Rapidly identify which deployed services include vulnerable libraries when new CVE advisories publish" },
        { id: "b", text: "Eliminates the need for runtime vulnerability scanning because inventory is static" },
        { id: "c", text: "Replaces network firewalls for east-west traffic because dependencies are documented" },
        { id: "d", text: "Satisfies marketing requirements for customer-facing brochures about secure development" },
      ],
    },
    "quiz-patch": {
      options: [
        { id: "a", text: "Defer the KEV patch 90 days because internal scans show no active exploitation yet" },
        { id: "b", text: "Prioritize emergency patching for internet-facing assets on the CISA KEV list with documented exceptions only" },
        { id: "c", text: "Disable Windows Update service on servers to prevent unplanned reboots during quarter close" },
        { id: "d", text: "Apply the patch only to workstations because servers are protected by VLAN segmentation" },
      ],
    },
  },
  "keytrain-application-security": {
    hard_q1: {
      options: [
        { id: "a", text: "SSRF toward instance metadata—block link-local access, fix URL validation, rotate cloud credentials" },
        { id: "b", text: "Benign health check traffic to the metadata service required for autoscaling group registration" },
        { id: "c", text: "DNS caching anomaly on the app server causing intermittent resolver timeouts only" },
        { id: "d", text: "Browser font rendering issue when users paste URLs into the comment field" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Enforce an allowlist of signing algorithms server-side; reject none, HS256 with public key material, and ambiguous algs" },
        { id: "b", text: "Trust the alg header from the client to support backward compatibility with legacy mobile builds" },
        { id: "c", text: "Disable HTTPS on the API gateway so JWT signatures are visible to debugging proxies" },
        { id: "d", text: "Email JWTs in cleartext to support teams when users report authentication errors" },
      ],
    },
    "scenario-auth": {
      options: [
        { id: "a", text: "Accept tokens with alg=none in staging only, promote the same library defaults to production for parity" },
        { id: "b", text: "Pin allowed algorithms in API middleware and reject tokens that do not match configured asymmetric keys" },
        { id: "c", text: "Increase JWT expiry to 30 days so mobile users are not interrupted during travel" },
        { id: "d", text: "Store JWT signing secrets in the front-end bundle to reduce round trips to the auth service" },
      ],
    },
  },
  "keytrain-financial-security": {
    hard_q1: {
      options: [
        { id: "a", text: "Missing out-of-band callback to known contacts and dual approval on high-value wires" },
        { id: "b", text: "Executive mailbox storage quota too low, causing voicemail notifications to truncate" },
        { id: "c", text: "Lack of corporate social media presence, preventing users from verifying CEO identity online" },
        { id: "d", text: "PDF color profile mismatch between marketing and finance templates on wire instructions" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Segregation of duties between vendor creation and vendor approval in ERP workflows" },
        { id: "b", text: "Shared SAP_ALL password for AP team efficiency during month-end close" },
        { id: "c", text: "Change-data alerts on vendor bank account fields with ticketed approvals" },
        { id: "d", text: "Dual approval on outbound payment file exports above defined thresholds" },
      ],
    },
    "scenario-invoice": {
      options: [
        { id: "a", text: "Pay within 24 hours using the new bank details to avoid supplier late fees and service interruption" },
        { id: "b", text: "Hold payment, verify vendor identity out-of-band, and alert AP leadership plus security" },
        { id: "c", text: "Reply in-thread to confirm bank change because the message passed SPF and DMARC checks" },
        { id: "d", text: "Forward the PDF to personal email for weekend review without logging a case in ERP" },
      ],
    },
  },
  "keytrain-physical-security": {
    hard_q1: {
      options: [
        { id: "a", text: "Possible cloned badge or tailgating—review CCTV, disable badge, audit physical access logs" },
        { id: "b", text: "Normal HVAC cycling on the datacenter floor causing false positive temperature alerts" },
        { id: "c", text: "Internal DNS replication delay between domain controllers affecting badge server lookups" },
        { id: "d", text: "Label printer jam on floor two unrelated to server rack inventory discrepancies" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Inline hardware implants and keyloggers are low-noise exfiltration paths in serviced workspaces" },
        { id: "b", text: "Keyboard ergonomics assessments are the primary reason to inspect peripherals after maintenance" },
        { id: "c", text: "Docking station firmware updates are required to achieve Wi-Fi 6 throughput targets" },
        { id: "d", text: "Physical inspections replace disk encryption and therefore eliminate data-at-rest risk" },
      ],
    },
    "quiz-tailgate": {
      options: [
        { id: "a", text: "Hold the door open without badging because the person is carrying catering trays" },
        { id: "b", text: "Badge in individually and politely ask unknown persons to use their own credential or see security" },
        { id: "c", text: "Badge once for the group to save time during shift change" },
        { id: "d", text: "Ignore tailgating if the person is wearing a high-visibility contractor vest" },
      ],
    },
  },
  "keytrain-compliance-governance": {
    hard_q1: {
      options: [
        {
          id: "a",
          text: "Invoke incident response, notify privacy officer, assess breach notification duties, and block unsanctioned SaaS OAuth",
        },
        { id: "b", text: "Delete the chat workspace and document as resolved if no screenshots were posted publicly" },
        { id: "c", text: "Post a sample of the PHI to the intranet to confirm whether employees recognize regulated data" },
        { id: "d", text: "Disable all corporate email for 48 hours to prevent further PHI transmission" },
      ],
    },
    hard_q2: {
      options: [
        { id: "a", text: "Failed risk treatment—document accept, mitigate, or transfer with owner, deadline, and residual risk" },
        { id: "b", text: "Acceptable deferral if vulnerability scanner hardware is end-of-life and awaiting procurement" },
        { id: "c", text: "Purely cosmetic IT issue with no governance impact because penetration tests are optional" },
        { id: "d", text: "Resolved by updating the security awareness slide template with a new corporate logo" },
      ],
    },
    "quiz-phi": {
      options: [
        { id: "a", text: "Migrate PHI quietly to approved storage next quarter without notifying privacy because volume is small" },
        { id: "b", text: "Report to privacy and security immediately per policy, begin containment and impact assessment" },
        { id: "c", text: "Delete all mailboxes in the tenant to ensure no additional PHI can leak" },
        { id: "d", text: "Post an apology on social media explaining the mistake so patients are not surprised" },
      ],
    },
  },
};

/**
 * @param {string} workshopId
 * @param {string} key
 */
export function getWorkshopQuizOverride(workshopId, key) {
  return OVERRIDES[workshopId]?.[key] ?? null;
}
