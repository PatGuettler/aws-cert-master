"""Additional practice facts for Azure, GCP, and CompTIA exams (official doc links only)."""
from __future__ import annotations

from question_bank.cloud_factory import Fact

# fmt: off
def _f(s, c, w, e, t, u) -> Fact:
    return (s, c, w, e, t, u)

AZURE_FACT_EXPANSIONS: dict[str, dict[str, list[Fact]]] = {
    "az-900": {
        "cloud-concepts": [
            _f("define elasticity in cloud", "Scale resources up or down on demand", ("Fixed capacity only", "Manual hardware orders", "No automation"), "Elasticity matches workload changes.", "Cloud benefits", "https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/selecting-compute-service"),
            _f("explain shared responsibility", "Microsoft secures the cloud; customers secure workloads", ("Microsoft patches all apps", "No customer duties", "Disable updates"), "Shared responsibility splits security tasks.", "Shared responsibility", "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility"),
        ],
        "azure-management": [
            _f("tag resources for cost allocation", "Azure resource tags on subscriptions and resources", ("Hide all costs", "One tag for tenant", "No reporting"), "Tags enable chargeback and FinOps.", "Resource tagging", "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources"),
            _f("view consolidated cloud spend", "Microsoft Cost Management", ("Spreadsheet guesses", "Ignore invoices", "Email CSV only"), "Cost Management analyzes Azure usage.", "Cost Management", "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs-billing-overview"),
        ],
    },
    "az-104": {
        "identity-governance": [
            _f("federate on-premises AD with cloud", "Microsoft Entra Connect", ("Duplicate passwords manually", "Disable sync", "Public LDAP"), "Entra Connect syncs directory identities.", "Entra Connect", "https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/whatis-azure-ad-connect"),
            _f("review who can assign roles", "Privileged Identity Management", ("Permanent Global Admin", "Shared root", "No reviews"), "PIM provides just-in-time elevation.", "Microsoft Entra PIM", "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure"),
        ],
        "storage": [
            _f("sync on-prem files to cloud", "Azure File Sync", ("USB sneaker net", "FTP only", "Email attachments"), "File Sync extends file shares to Azure.", "Azure File Sync", "https://learn.microsoft.com/en-us/azure/storage/file-sync/file-sync-introduction"),
            _f("protect blobs from accidental delete", "Soft delete and versioning", ("Disable recovery", "Public write ACL", "No backups"), "Blob protection aids recovery.", "Blob soft delete", "https://learn.microsoft.com/en-us/azure/storage/blobs/blob-delete-recovery"),
        ],
        "compute": [
            _f("patch VM fleets at scale", "Azure Update Manager", ("Manual RDP each", "Disable updates", "Ignore CVEs"), "Update Manager orchestrates patching.", "Azure Update Manager", "https://learn.microsoft.com/en-us/azure/update-manager/overview"),
            _f("run containers without managing servers", "Azure Container Apps", ("Bare metal only", "Telnet deploy", "ICMP mesh"), "Container Apps is serverless containers.", "Azure Container Apps", "https://learn.microsoft.com/en-us/azure/container-apps/overview"),
        ],
        "networking": [
            _f("control east-west traffic in VNet", "Network security groups", ("Allow all ports", "Disable NSGs", "Public admin"), "NSGs filter subnet traffic.", "Network security groups", "https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview"),
            _f("publish services with private IPs only", "Azure Private Link", ("Expose SQL to internet", "RDP 0.0.0.0", "FTP admin"), "Private Link keeps traffic on Microsoft backbone.", "Azure Private Link", "https://learn.microsoft.com/en-us/azure/private-link/private-link-overview"),
        ],
        "monitor-backup": [
            _f("alert on metric thresholds", "Azure Monitor alert rules", ("Check logs yearly", "No notifications", "Ping script"), "Alerts automate incident detection.", "Azure Monitor alerts", "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview"),
            _f("centralize activity auditing", "Azure Activity Log", ("Delete audit trail", "Shared password", "No retention"), "Activity Log records control-plane operations.", "Azure Activity Log", "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log"),
        ],
    },
    "az-204": {
        "compute-solutions": [
            _f("host web APIs on Linux containers in Azure", "Azure App Service for Linux containers", ("FTP only", "ICMP", "Telnet"), "App Service supports containerized web apps.", "App Service containers", "https://learn.microsoft.com/en-us/azure/app-service/quickstart-custom-container"),
            _f("orchestrate long-running workflows", "Azure Durable Functions", ("Busy-wait loops", "Global variables", "No retry"), "Durable Functions manage stateful workflows.", "Durable Functions", "https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview"),
        ],
        "storage-solutions": [
            _f("grant limited-time blob access", "Shared access signatures", ("Public container always", "Embed account keys", "Email keys"), "SAS provides scoped delegated access.", "SAS", "https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview"),
            _f("store unstructured app data", "Azure Blob Storage containers", ("Local USB", "SMTP relay", "DNS only"), "Blobs store objects via REST.", "Blob Storage", "https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview"),
        ],
        "security": [
            _f("store app secrets for Functions", "Azure Key Vault references", ("Secrets in git", "Env in public repo", "Chat keys"), "Key Vault references keep secrets out of code.", "Key Vault", "https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references"),
            _f("validate JWT access tokens", "Microsoft identity platform", ("Custom crypto only", "Disable validation", "Shared password"), "Identity platform issues OAuth2 tokens.", "Microsoft identity platform", "https://learn.microsoft.com/en-us/entra/identity-platform/v2-overview"),
        ],
        "monitor-optimize": [
            _f("profile live .NET performance", "Application Insights Profiler", ("Guess hotspots", "Disable telemetry", "Ping only"), "Profiler captures traces in production.", "Profiler", "https://learn.microsoft.com/en-us/azure/azure-monitor/app/profiler"),
            _f("track custom business metrics", "Application Insights custom metrics", ("Spreadsheet only", "No SDK", "ICMP"), "Custom metrics extend observability.", "Custom metrics", "https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics"),
        ],
        "connect-consume": [
            _f("react to blob uploads with serverless code", "Event Grid blob events to Functions", ("Poll FTP hourly", "Manual copy", "Telnet"), "Event Grid delivers push notifications.", "Event Grid", "https://learn.microsoft.com/en-us/azure/event-grid/overview"),
            _f("schedule recurring jobs in cloud", "Azure Logic Apps", ("Cron on laptop", "Email tasks", "USB scripts"), "Logic Apps automate workflows.", "Logic Apps", "https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview"),
        ],
    },
    "az-305": {
        "identity-data": [
            _f("enforce guardrails on new subscriptions", "Azure Policy initiatives", ("Manual audits only", "Ignore compliance", "No definitions"), "Initiatives group related policies.", "Azure Policy", "https://learn.microsoft.com/en-us/azure/governance/policy/overview"),
            _f("design directory groups for RBAC", "Microsoft Entra groups with role assignments", ("User-by-user only", "Shared admin", "No PIM"), "Groups simplify access management.", "Entra groups", "https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users-groups"),
        ],
        "data-solutions": [
            _f("cache read-heavy relational workloads", "Azure Cache for Redis", ("Local notepad", "FTP cache", "ICMP"), "Redis reduces database read load.", "Azure Cache for Redis", "https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview"),
            _f("ingest telemetry at scale", "Azure Data Explorer", ("CSV email", "Excel only", "Telnet"), "ADX analyzes high-volume logs and metrics.", "Azure Data Explorer", "https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview"),
        ],
        "business-continuity": [
            _f("backup Azure VMs to vault", "Azure Backup recovery services vault", ("USB only", "No retention", "Disable backup"), "Recovery Services vault stores backup data.", "Recovery Services vault", "https://learn.microsoft.com/en-us/azure/backup/backup-azure-vms-first-look-arm"),
            _f("test failover for SQL databases", "Azure SQL failover groups", ("Single region only", "Hope for best", "Manual USB"), "Failover groups provide DR for SQL.", "Failover groups", "https://learn.microsoft.com/en-us/azure/azure-sql/database/failover-group-sql-db"),
        ],
        "infrastructure": [
            _f("ingress TLS with Web Application Firewall", "Application Gateway WAF", ("HTTP only", "Self-signed everywhere", "Disable WAF"), "WAF protects web apps at edge.", "WAF on App Gateway", "https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview"),
            _f("private cluster API for Kubernetes", "Private AKS clusters", ("Public API server", "Open dashboard", "Shared kubeconfig"), "Private clusters limit API exposure.", "Private AKS", "https://learn.microsoft.com/en-us/azure/aks/private-clusters"),
        ],
    },
    "az-400": {
        "devops-process": [
            _f("track work with boards and backlogs", "Azure Boards", ("Sticky notes only", "Email tasks", "No traceability"), "Boards connect work to code and builds.", "Azure Boards", "https://learn.microsoft.com/en-us/azure/devops/boards/get-started/what-is-azure-boards"),
            _f("define infrastructure environments", "Bicep or Terraform modules", ("ClickOps only", "USB scripts", "No review"), "Modules standardize environment definitions.", "Bicep", "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview"),
        ],
        "source-control": [
            _f("protect main branch from force push", "Branch policies with permissions", ("Everyone force pushes", "No reviews", "Delete history"), "Policies enforce quality gates.", "Branch policies", "https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies"),
            _f("scan repositories for secrets", "GitHub Advanced Security for Azure DevOps", ("Commit passwords", "Ignore alerts", "Public keys"), "Secret scanning prevents credential leaks.", "Secret scanning", "https://learn.microsoft.com/en-us/azure/devops/repos/security/github-advanced-security-secret-scanning"),
        ],
        "ci-cd": [
            _f("cache dependencies in pipelines", "Pipeline caching tasks", ("Download every run", "No cache", "FTP deps"), "Caching speeds up builds.", "Pipeline caching", "https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching"),
            _f("deploy to multiple stages with gates", "YAML environments and approvals", ("Deploy straight to prod", "No tests", "Shared password"), "Environments add deployment controls.", "Deployment environments", "https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments"),
        ],
        "dependency-security": [
            _f("scan container images in CI", "Defender for Cloud container scanning", ("Ignore CVEs", "Latest tag only", "No base updates"), "Image scanning finds known vulnerabilities.", "Container scanning", "https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-containers-introduction"),
        ],
        "instrumentation": [
            _f("collect pipeline logs centrally", "Log Analytics workspace integration", ("Local text files", "Delete logs", "No retention"), "Central logs support RCA.", "Log Analytics", "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview"),
        ],
    },
    "az-500": {
        "identity-access": [
            _f("block legacy authentication", "Conditional Access blocking legacy auth", ("Allow basic auth", "Shared password", "No MFA"), "Legacy protocols bypass modern controls.", "Block legacy authentication", "https://learn.microsoft.com/en-us/entra/identity/conditional-access/block-legacy-authentication"),
            _f("manage privileged roles with approval", "Entra Privileged Identity Management", ("Standing Global Admin", "No reviews", "Email approvals"), "PIM reduces standing privilege.", "PIM", "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure"),
        ],
        "platform-security": [
            _f("micro-segment workloads in VNet", "Application security groups with NSGs", ("Flat 0.0.0.0/0", "Disable NSGs", "Telnet admin"), "ASGs group VMs for rule targets.", "Application security groups", "https://learn.microsoft.com/en-us/azure/virtual-network/application-security-groups"),
            _f("store TLS certificates for apps", "Key Vault certificates", ("Self-signed in repo", "HTTP only", "Email pfx"), "Key Vault integrates with App Service TLS.", "Key Vault certificates", "https://learn.microsoft.com/en-us/azure/key-vault/certificates/about-certificates"),
        ],
        "security-operations": [
            _f("automate response with playbooks", "Sentinel automation rules", ("Manual triage only", "Ignore alerts", "Delete incidents"), "Automation reduces mean time to respond.", "Sentinel automation", "https://learn.microsoft.com/en-us/azure/sentinel/automation/automation"),
            _f("hunt threats with KQL", "Sentinel advanced hunting", ("Spreadsheet pivots", "No logs", "ICMP"), "Hunting queries search across data.", "Advanced hunting", "https://learn.microsoft.com/en-us/azure/sentinel/hunting/overview"),
        ],
        "security-posture": [
            _f("assess regulatory compliance", "Microsoft Defender for Cloud regulatory compliance", ("Ignore frameworks", "No scans", "Manual checklist"), "Regulatory dashboard maps controls.", "Regulatory compliance", "https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-regulatory-compliance"),
        ],
    },
    "sc-900": {
        "security-concepts": [
            _f("describe defense in depth", "Layered controls across identity, network, data", ("Single firewall only", "Antivirus alone", "Hope"), "Layers reduce single points of failure.", "Defense in depth", "https://learn.microsoft.com/en-us/azure/security/fundamentals/defense-in-depth"),
            _f("explain least privilege access", "Grant minimum permissions required", ("Everyone admin", "Shared accounts", "No reviews"), "Least privilege limits abuse impact.", "Least privilege", "https://learn.microsoft.com/en-us/entra/identity-platform/secure-least-privileged-access"),
        ],
        "entra": [
            _f("enable self-service password reset", "Entra SSPR policies", ("Email passwords", "Sticky notes", "No MFA"), "SSPR reduces helpdesk load.", "Entra SSPR", "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-howitworks"),
            _f("guest access for partners", "Entra B2B collaboration", ("Share one password", "Disable audit", "Public VPN"), "B2B invites external users safely.", "Entra B2B", "https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b"),
        ],
        "defender": [
            _f("protect endpoints with EDR", "Microsoft Defender for Endpoint", ("No sensors", "Disable updates", "Ping only"), "Defender for Endpoint detects threats on devices.", "Defender for Endpoint", "https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint"),
            _f("secure email against phishing", "Microsoft Defender for Office 365", ("Allow all attachments", "No filtering", "Telnet"), "Defender for Office 365 filters mail threats.", "Defender for Office 365", "https://learn.microsoft.com/en-us/defender-office-365/mdo-about"),
        ],
        "compliance": [
            _f("apply retention labels to files", "Microsoft Purview retention policies", ("Delete all mail", "No legal hold", "USB archive"), "Retention preserves data per policy.", "Retention", "https://learn.microsoft.com/en-us/purview/retention"),
        ],
    },
    "dp-900": {
        "data-concepts": [
            _f("describe batch vs streaming data", "Batch processes windows; streaming near real-time", ("Only USB", "ICMP", "DNS"), "Latency requirements drive pattern choice.", "Batch and streaming", "https://learn.microsoft.com/en-us/training/modules/intro-to-azure-data-services/"),
        ],
        "relational": [
            _f("scale reads with readable replicas", "Azure SQL read scale-out", ("Single core only", "No replicas", "FTP"), "Replicas offload read queries.", "Read scale-out", "https://learn.microsoft.com/en-us/azure/azure-sql/database/read-scale-out"),
        ],
        "nonrelational": [
            _f("choose Cosmos DB API for MongoDB", "MongoDB-compatible API on Cosmos DB", ("Excel tables", "Telnet", "ICMP"), "API compatibility eases migration.", "Cosmos DB APIs", "https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/introduction"),
        ],
        "analytics": [
            _f("lakehouse analytics on OneLake", "Microsoft Fabric lakehouse", ("CSV on desktop", "Email reports", "No catalog"), "Fabric unifies analytics workloads.", "Microsoft Fabric", "https://learn.microsoft.com/en-us/fabric/get-started/"),
        ],
    },
    "ai-900": {
        "ai-workloads": [
            _f("document model limitations", "Transparency notes and data sheets", ("Hide failures", "No testing", "Overpromise"), "Transparency builds trust.", "Transparency", "https://learn.microsoft.com/en-us/azure/ai-services/responsible-ai/transparency"),
        ],
        "machine-learning": [
            _f("use automated ML for tabular data", "Azure Machine Learning AutoML", ("Manual guess only", "No validation", "Leak labels"), "AutoML searches algorithms and hyperparameters.", "AutoML", "https://learn.microsoft.com/en-us/azure/machine-learning/concept-automated-ml"),
        ],
        "computer-vision": [
            _f("read text in images", "Azure AI Vision Read API", ("OCR via telnet", "Manual typing", "ICMP"), "Read API extracts printed and handwritten text.", "Vision Read", "https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-ocr"),
        ],
        "nlp": [
            _f("build conversational bots", "Azure AI Language + Bot Service patterns", ("Telnet chat", "ICMP bot", "FTP"), "Language services power NLU for bots.", "Azure AI Language", "https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview"),
        ],
    },
}

GCP_FACT_EXPANSIONS: dict[str, dict[str, list[Fact]]] = {
    "cloud-digital-leader": {
        "security-ops": [
            _f("encrypt data with customer-managed keys", "Cloud KMS", ("Plaintext buckets", "Email keys", "HTTP only"), "KMS manages encryption keys.", "Cloud KMS", "https://cloud.google.com/kms/docs"),
        ],
    },
    "associate-cloud-engineer": {
        "planning": [
            _f("organize projects with labels", "Resource labels for cost and ownership", ("No labels", "One project forever", "Ignore billing"), "Labels support governance at scale.", "Labels", "https://cloud.google.com/resource-manager/docs/creating-managing-labels"),
            _f("set org policies on resources", "Organization policy constraints", ("Allow all regions", "Public admin", "No guardrails"), "Org policies enforce constraints.", "Organization policies", "https://cloud.google.com/resource-manager/docs/organization-policy/overview"),
        ],
        "compute-storage": [
            _f("attach disks to Compute Engine VMs", "Persistent disks", ("USB only", "FTP disk", "ICMP"), "Persistent disks provide block storage.", "Persistent disks", "https://cloud.google.com/compute/docs/disks"),
            _f("host static assets globally", "Cloud Storage with CDN", ("Single server", "Email zip", "Telnet"), "GCS plus Cloud CDN accelerates delivery.", "Cloud CDN", "https://cloud.google.com/cdn/docs/overview"),
        ],
        "networking": [
            _f("control egress with firewall rules", "VPC firewall rules", ("0.0.0.0/0 admin", "Disable rules", "Telnet"), "Firewall rules filter VM traffic.", "VPC firewall rules", "https://cloud.google.com/vpc/docs/firewalls"),
            _f("private Google API access", "Private Google Access", ("Force public internet", "No routing", "ICMP"), "Private Google Access keeps API traffic private.", "Private Google Access", "https://cloud.google.com/vpc/docs/configure-private-google-access"),
        ],
        "security-iam": [
            _f("audit IAM changes", "Cloud Audit Logs", ("Delete logs", "Shared root", "No retention"), "Audit logs record admin activity.", "Cloud Audit Logs", "https://cloud.google.com/logging/docs/audit"),
            _f("use service accounts for workloads", "Dedicated service accounts with minimal roles", ("User credentials in VM", "Shared admin", "No rotation"), "Service accounts identify workloads.", "Service accounts", "https://cloud.google.com/iam/docs/service-account-overview"),
        ],
        "operations": [
            _f("deploy VMs from golden images", "Custom images or instance templates", ("Manual install each", "Snowflake servers", "USB"), "Images standardize VM provisioning.", "Instance templates", "https://cloud.google.com/compute/docs/instance-templates"),
            _f("schedule batch jobs on VMs", "Compute Engine + Cloud Scheduler", ("Cron on laptop", "Email scripts", "Telnet"), "Scheduler triggers automated jobs.", "Cloud Scheduler", "https://cloud.google.com/scheduler/docs"),
        ],
    },
    "professional-cloud-architect": {
        "design-plan": [
            _f("choose region for data residency", "Regional services and data locality", ("Random region", "Ignore compliance", "Single laptop"), "Regions address sovereignty requirements.", "Regions", "https://cloud.google.com/compute/docs/regions-zones"),
            _f("design hybrid connectivity", "Cloud VPN or Cloud Interconnect", ("Expose DB publicly", "RDP internet", "FTP"), "Hybrid links connect on-prem to GCP.", "Cloud VPN", "https://cloud.google.com/network-connectivity/docs/vpn"),
        ],
        "manage-provision": [
            _f("preview infrastructure changes", "Terraform plan or Deployment Manager previews", ("Apply prod first", "No review", "USB apply"), "Previews reduce deployment surprises.", "Terraform", "https://cloud.google.com/docs/terraform"),
        ],
        "security-compliance": [
            _f("centralize org security findings", "Security Command Center", ("Ignore CVEs", "No scanning", "Spreadsheet"), "SCC aggregates risk across projects.", "Security Command Center", "https://cloud.google.com/security-command-center/docs"),
        ],
        "reliability": [
            _f("design multi-region failover", "Load balancing across regions", ("Single zone", "No health checks", "Hope"), "Multi-region designs improve availability.", "Load balancing", "https://cloud.google.com/load-balancing/docs/load-balancing-overview"),
        ],
        "implementation": [
            _f("roll out configs with Cloud Build", "CI/CD pipelines for infrastructure", ("Manual console", "Email YAML", "Telnet"), "Cloud Build automates delivery.", "Cloud Build", "https://cloud.google.com/build/docs/overview"),
        ],
    },
    "professional-data-engineer": {
        "data-lifecycle": [
            _f("orchestrate batch pipelines", "Cloud Composer (managed Airflow)", ("Cron USB", "Manual FTP", "Telnet"), "Composer schedules complex workflows.", "Cloud Composer", "https://cloud.google.com/composer/docs"),
        ],
        "ingestion-storage": [
            _f("stream into BigQuery", "BigQuery streaming insert or Dataflow", ("Daily CSV email", "USB", "ICMP"), "Streaming enables near-real-time analytics.", "BigQuery streaming", "https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery"),
        ],
        "analysis-modeling": [
            _f("train models on structured data", "BigQuery ML", ("Excel regression", "Notepad", "FTP"), "BQML runs models where data lives.", "BigQuery ML", "https://cloud.google.com/bigquery/docs/bqml-introduction"),
        ],
        "reliability-ops": [
            _f("monitor pipeline SLAs", "Cloud Monitoring dashboards and alerts", ("No metrics", "Annual check", "Disable paging"), "Monitoring validates pipeline health.", "Cloud Monitoring", "https://cloud.google.com/monitoring/docs"),
        ],
    },
    "professional-cloud-security-engineer": {
        "org-governance": [
            _f("deny public bucket access org-wide", "Organization policy constraints on public access", ("Open buckets", "ACL 777", "No audit"), "Org constraints prevent data exposure.", "Public access prevention", "https://cloud.google.com/storage/docs/public-access-prevention"),
        ],
        "network-security": [
            _f("inspect HTTPS with TLS proxy LB", "SSL policies on load balancers", ("HTTP only", "Weak ciphers", "Self-signed only"), "SSL policies enforce cipher standards.", "SSL policies", "https://cloud.google.com/load-balancing/docs/ssl-policies"),
        ],
        "data-protection": [
            _f("rotate encryption keys automatically", "Cloud KMS automatic rotation", ("Never rotate", "Keys in git", "Email keys"), "Rotation limits key compromise window.", "Key rotation", "https://cloud.google.com/kms/docs/key-rotation"),
        ],
        "operations": [
            _f("investigate threats with Chronicle", "Google Security Operations (Chronicle)", ("Notepad logs", "Delete events", "ICMP"), "Chronicle analyzes security telemetry.", "Google Security Operations", "https://cloud.google.com/chronicle/docs"),
        ],
    },
    "professional-cloud-devops-engineer": {
        "cicd": [
            _f("scan artifacts in Cloud Build", "Binary Authorization or vulnerability scanning", ("Deploy any image", "Ignore CVEs", "Latest only"), "Scanning gates risky deployments.", "Artifact Analysis", "https://cloud.google.com/artifact-analysis/docs"),
        ],
        "sre": [
            _f("promote releases with Cloud Deploy", "Progressive delivery pipelines", ("FTP prod", "No rollback", "Big bang"), "Cloud Deploy manages release promotion.", "Cloud Deploy", "https://cloud.google.com/deploy/docs"),
            _f("store build artifacts securely", "Artifact Registry with IAM", ("Public FTP", "Email zip", "USB"), "Artifact Registry hosts container images.", "Artifact Registry", "https://cloud.google.com/artifact-registry/docs/overview"),
        ],
        "monitoring": [
            _f("define SLOs in Cloud Monitoring", "Service-level objectives and burn alerts", ("No SLOs", "Hope users call", "Ping only"), "SLOs align ops with reliability targets.", "SLOs", "https://cloud.google.com/stackdriver/docs/solutions/slo"),
        ],
        "optimization": [
            _f("right-size Compute Engine VMs", "Monitoring rightsizing recommendations", ("Max SKU always", "Ignore metrics", "Delete dashboards"), "Rightsizing reduces waste.", "Rightsizing", "https://cloud.google.com/compute/docs/instances/rightsizing-recommendations"),
        ],
    },
}

COMPTIA_FACT_EXPANSIONS: dict[str, dict[str, list[Fact]]] = {
    "comptia-server-plus": {
        "architecture": [
            _f("choose RAID level for performance and redundancy", "RAID 10 or RAID 5 based on workload", ("RAID 0 for prod databases", "No RAID", "USB mirror"), "RAID trade-offs affect availability.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("plan rack power and cooling", "Redundant PSUs and adequate BTU capacity", ("Single outlet", "Ignore thermal", "Open rack"), "Power planning prevents outages.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("virtualize physical servers", "Hypervisor with resource reservations", ("Overcommit RAM always", "No isolation", "Disable patches"), "Virtualization consolidates workloads.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
        ],
        "administration": [
            _f("remotely manage Windows servers", "RDP with NLA and restricted groups", ("Telnet admin", "Shared Administrator", "No logging"), "Secure remote admin reduces exposure.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("automate Linux package updates", "Scheduled maintenance with change control", ("Disable updates", "Prod first no test", "curl | bash"), "Patching reduces known vulnerabilities.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("monitor server health", "SNMP or agent-based monitoring with alerts", ("Check yearly", "Email ping", "No baselines"), "Monitoring enables proactive fixes.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
        ],
        "security": [
            _f("harden default services", "Disable unused roles and close ports", ("Enable FTP", "Open RDP world", "Guest admin"), "Hardening shrinks attack surface.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("apply firmware updates safely", "Vendor advisories and staged rollout", ("Ignore CVEs", "Flash prod first", "No rollback"), "Firmware fixes hardware-level issues.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
        ],
        "storage": [
            _f("expand volumes online", "LVM or Windows dynamic disks with planning", ("Delete data", "Offline only always", "No backup"), "Capacity planning avoids downtime.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("connect SAN storage", "Fibre Channel or iSCSI with multipathing", ("Single path", "USB SAN", "Telnet"), "Multipathing improves storage resilience.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
        ],
        "troubleshooting": [
            _f("diagnose boot failures", "Review POST codes and boot logs", ("Reinstall immediately", "Ignore logs", "Random USB"), "Boot diagnostics isolate hardware vs OS.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
            _f("resolve high CPU on database server", "Profiler and query plans before scaling up", ("Reboot only", "Disable monitoring", "Add RAM blindly"), "Root cause fixes performance sustainably.", "Server+ objectives", "https://www.comptia.org/en-us/certifications/server"),
        ],
    },
    "comptia-project-plus": {
        "concepts": [
            _f("balance scope time cost quality", "Project management triangle trade-offs", ("Ignore scope", "No stakeholders", "Skip planning"), "Constraints guide decisions.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
            _f("identify stakeholders early", "Stakeholder register and analysis", ("Start coding first", "No communication", "Hide risks"), "Stakeholders influence requirements.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
        ],
        "lifecycle": [
            _f("define requirements before build", "Approved requirements baseline", ("Build first", "Change daily", "No sign-off"), "Baselines control scope creep.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
            _f("track work with WBS", "Work breakdown structure decomposition", ("Flat todo list only", "No estimates", "Ignore dependencies"), "WBS clarifies deliverables.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
            _f("manage project risks", "Risk register with owners and responses", ("Hope for best", "Hide issues", "No mitigation"), "Risk management reduces surprises.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
        ],
        "tools": [
            _f("use Gantt charts for schedule", "Timeline with dependencies and milestones", ("Email dates only", "No critical path", "Ignore slack"), "Schedules coordinate resources.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
            _f("run retrospectives after phases", "Lessons learned documentation", ("Skip closeout", "Blame only", "No changes"), "Retrospectives improve future delivery.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
        ],
        "communication": [
            _f("escalate blockers with options", "Status report with impact and choices", ("Surprise at deadline", "No data", "Vague updates"), "Escalation enables decisions.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
            _f("manage vendor contracts", "SOW and acceptance criteria", ("Handshake only", "No SLAs", "Pay on hope"), "Contracts define deliverables.", "Project+ objectives", "https://www.comptia.org/en-us/certifications/project"),
        ],
    },
    "comptia-cloud-plus": {
        "cloud-architecture": [
            _f("design for fault domains", "Availability zones and anti-affinity", ("Single VM", "One subnet", "No health checks"), "Isolation limits blast radius.", "Cloud+ objectives", "https://www.comptia.org/en-us/certifications/cloud"),
        ],
        "operations": [
            _f("implement capacity planning", "Trend metrics before peak seasons", ("Buy max SKU", "Ignore growth", "No forecasts"), "Capacity planning avoids outages.", "Cloud+ objectives", "https://www.comptia.org/en-us/certifications/cloud"),
        ],
    },
    "comptia-data-plus": {
        "data-concepts": [
            _f("define primary keys in datasets", "Unique identifiers per entity grain", ("Duplicate keys OK", "Random UUID reuse", "No constraints"), "Keys enforce relational integrity.", "Data+ objectives", "https://www.comptia.org/en-us/certifications/data"),
        ],
        "mining-analytics": [
            _f("detect outliers before modeling", "Box plots and IQR rules", ("Delete outliers always", "Ignore extremes", "No review"), "Outliers may be errors or signal.", "Data+ objectives", "https://www.comptia.org/en-us/certifications/data"),
        ],
        "governance": [
            _f("apply GDPR-style erasure requests", "Documented deletion workflows", ("Keep forever", "Ignore legal", "Public backup"), "Privacy regulations require erasure support.", "Data+ objectives", "https://www.comptia.org/en-us/certifications/data"),
        ],
    },
    "comptia-pentest-plus": {
        "planning-scoping": [
            _f("define out-of-scope assets", "Explicit exclusions in RoE", ("Test anything", "Scan whole ISP", "No limits"), "Scope prevents collateral impact.", "PenTest+ objectives", "https://www.comptia.org/en-us/certifications/pentest"),
        ],
        "attacks-exploits": [
            _f("test API authentication", "Broken object level authorization checks", ("Use admin token only", "No IDOR tests", "Share tokens"), "API flaws are common in modern apps.", "PenTest+ objectives", "https://www.comptia.org/en-us/certifications/pentest"),
            _f("perform phishing simulation", "Approved templates and metrics", ("Send malware", "No opt-out", "Target executives only"), "Simulations measure awareness.", "PenTest+ objectives", "https://www.comptia.org/en-us/certifications/pentest"),
        ],
        "reporting": [
            _f("include reproduction steps", "Clear steps and evidence screenshots", ("Tool dump only", "No PoC", "Vague wording"), "Reproduction helps developers fix issues.", "PenTest+ objectives", "https://www.comptia.org/en-us/certifications/pentest"),
        ],
    },
}
# fmt: on


def merge_fact_banks(
    base: dict[str, dict[str, list[Fact]]],
    extra: dict[str, dict[str, list[Fact]]],
) -> dict[str, dict[str, list[Fact]]]:
    merged: dict[str, dict[str, list[Fact]]] = {
        exam: {domain: list(facts) for domain, facts in domains.items()}
        for exam, domains in base.items()
    }
    for exam_id, domains in extra.items():
        merged.setdefault(exam_id, {})
        for domain_id, facts in domains.items():
            merged[exam_id].setdefault(domain_id, []).extend(facts)
    return merged
