"""
Original DOP-C02 scenario-style practice questions.

Inspired by public exam guide domains and AWS documentation — not copied from
Skill Builder, certification exams, or other proprietary training item banks.
"""
from __future__ import annotations

from question_bank.common import RawQuestion

# domain, type, stem, options, correct, explanation, docs
DOP_SCENARIO_QUESTIONS: list[RawQuestion] = [
    (
        "config-management-iac",
        "multiple-choice",
        "A team provisions workloads with a minimal CloudFormation template that only sets required "
        "properties; optional defaults were applied outside the stack and now drift from the template. "
        "They want stack updates to realign resources and a low-effort way to catch manual changes. "
        "Which approach meets the goal with the LEAST custom engineering?",
        [
            ("a", "Publish a Lambda function that calls DetectStackDrift on a schedule via EventBridge and "
             "re-executes the current template when drift is found"),
            ("b", "Rely on stack exports only; ignore drift until the next full stack delete"),
            ("c", "Encode every property (including former defaults) in the template and use an AWS Config "
             "managed rule with automatic remediation via the AWS-UpdateCloudFormationStack SSM runbook"),
            ("d", "Manually compare the console with the template each week"),
        ],
        ["a"],
        "Scheduled drift detection plus redeploying the known template is a small, focused automation "
        "pattern. Full template enumeration plus Config remediation is powerful but heavier to roll out.",
        [
            ("CloudFormation drift", "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html"),
            ("DetectStackDrift", "https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DetectStackDrift.html"),
        ],
    ),
    (
        "resilient-cloud-solutions",
        "multiple-choice",
        "Workers on EC2 consume an SQS queue. During spikes the fleet scales on average CPU, but messages "
        "still backlog because CPU stays low while queue depth grows. Which scaling approach is MOST reliable?",
        [
            ("a", "Publish a custom CloudWatch metric (visible messages ÷ in-service instances) and scale "
             "the Auto Scaling group on that metric"),
            ("b", "Attach an ALB and scale on ALBRequestCountPerTarget even though traffic is queue-driven"),
            ("c", "Change the target tracking policy to NumberOfMessagesReceived on the queue"),
            ("d", "Lower the CPU target and shorten the warm-up period only"),
        ],
        ["a"],
        "Queue depth per instance directly reflects backlog pressure; CPU is a poor proxy for worker pools "
        "pulling from SQS.",
        [
            ("SQS with Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"),
            ("Custom metrics", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html"),
        ],
    ),
    (
        "monitoring-logging",
        "multiple-choice",
        "An organization with AWS Organizations must watch service quota utilization across all member "
        "accounts daily and email owners when usage crosses 80% of a quota. What should they implement?",
        [
            ("a", "Enable Service Quotas integration with Organizations, create per-service CloudWatch alarms "
             "at 80% utilization, and notify an SNS topic in ALARM state"),
            ("b", "Run Trusted Advisor quota checks weekly from a single Lambda in the management account"),
            ("c", "Use the same alarms but route ALARM transitions through EventBridge instead of SNS"),
            ("d", "Refresh Trusted Advisor checks daily and open support cases for WARN results"),
        ],
        ["a"],
        "Service Quotas exposes utilization metrics suitable for CloudWatch alarms; SNS is the standard "
        "notification path when alarms fire.",
        [
            ("Service Quotas and Organizations", "https://docs.aws.amazon.com/servicequotas/latest/userguide/organizations.html"),
            ("CloudWatch alarms", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-response",
        "CodeDeploy performs blue/green releases behind an ALB. Operators today read application logs on "
        "instances and manually roll back when errors spike. Which TWO steps automate rollback with minimal "
        "delay? (Select TWO.)",
        [
            ("a", "Alarm on ALB HTTPCode_Target_4XX_Count only"),
            ("b", "Configure the deployment group to fail and roll back when a linked CloudWatch alarm enters ALARM"),
            ("c", "Schedule a Lambda hourly to call ContinueDeployment"),
            ("d", "Subscribe CodeDeploy directly to an SNS topic (unsupported target)"),
            ("e", "Ship logs to CloudWatch Logs, metric-filter error lines, and alarm on the error rate"),
        ],
        ["b", "e"],
        "CodeDeploy can watch deployment alarms; log metric filters catch application errors described in "
        "files rather than ALB HTTP codes alone.",
        [
            ("CodeDeploy alarms", "https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-sns-event-notifications.html"),
            ("Log metric filters", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html"),
        ],
    ),
    (
        "config-management-iac",
        "multiple-choice",
        "Elastic Beanstalk was launched via the EB CLI with an .ebextensions file that sets instance type "
        "to t3.medium, but new environments still launch t3.small. What most likely explains the behavior?",
        [
            ("a", "Default service values always override .ebextensions"),
            ("b", "CLI/API parameters and recommended values take precedence over .ebextensions for settings "
             "such as instance type"),
            ("c", "Instance type cannot be set in .ebextensions"),
            ("d", "The IAM user lacks permission for t3.medium"),
        ],
        ["b"],
        "Elastic Beanstalk applies settings in order: direct environment/API changes, saved config, "
        ".ebextensions, then defaults. CLI launches can set recommended values that win over extensions.",
        [
            ("Configuration precedence", "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.EB.Environment.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "API Gateway fronts Lambda for a production API. A new Lambda version is ready; the team needs 10% "
        "of traffic on the new version for one week with no client-side URL changes. What is the MOST "
        "efficient approach?",
        [
            ("a", "Create a second API stage and split traffic with a simple Route 53 record"),
            ("b", "Enable a canary release on the existing production stage (10% to new version, 90% to current)"),
            ("c", "Stand up a second API and weighted Route 53 records to a new hostname"),
            ("d", "Switch the integration to Lambda proxy and route inside the function"),
        ],
        ["b"],
        "API Gateway canary deployments shift traffic on the same stage customers already call.",
        [
            ("Canary release", "https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html"),
        ],
    ),
    (
        "monitoring-logging",
        "multiple-choice",
        "JSON application logs on EC2 include PII. A vendor needs near-real-time access to troubleshoot "
        "errors but must not see PII and cannot receive SSH. What is the MOST cost-effective pattern?",
        [
            ("a", "Central syslog on EC2 with a nightly Batch job copying filtered logs to S3"),
            ("b", "Stream logs with the CloudWatch agent; subscription filter + Lambda writes non-PII events to "
             "OpenSearch always on"),
            ("c", "Agent to Kinesis Data Firehose with Lambda transformation to S3"),
            ("d", "Agent to CloudWatch Logs; subscription filter + Lambda writes filtered events to S3 for vendor access"),
        ],
        ["d"],
        "CloudWatch Logs subscription filters can strip sensitive fields; S3 access is inexpensive for "
        "episodic vendor review without always-on search clusters.",
        [
            ("Subscription filters", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html"),
        ],
    ),
    (
        "incident-event-response",
        "multiple-choice",
        "Across an AWS Organization, any S3 bucket that becomes public (ACL or policy) must be auto-remediated "
        "in every Region and account, including buckets created later. Which design fits?",
        [
            ("a", "EventBridge global endpoints replicate S3 events to a security account"),
            ("b", "Organization CloudTrail bucket triggers EventBridge in one account for all API calls"),
            ("c", "Enable S3 EventBridge notifications on each bucket for ACL changes"),
            ("d", "Deploy an AWS Config rule (org-wide) with automated remediation via an SSM Automation runbook"),
        ],
        ["d"],
        "Managed Config rules detect public access; remediation runbooks such as AWS-DisableS3BucketPublicReadWrite "
        "can run automatically per account/Region.",
        [
            ("Config remediation", "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"),
            ("s3-bucket-level-public-access-prohibited", "https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-level-public-access-prohibited.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "Dev and UAT pipelines deploy the same Git branch but UAT shows a defect absent in Dev. How do you "
        "ensure identical artifacts and environments?",
        [
            ("a", "Lambda validates artifacts; separate CodeBuild projects per pipeline"),
            ("b", "One build pipeline publishes artifacts to S3; separate deploy pipelines pull the same object"),
            ("c", "Shared CodeBuild with different buildspec overrides per environment"),
            ("d", "Lambda compares artifact SHA-256 in UAT pipeline; both deploy stages use the same CloudFormation template"),
        ],
        ["d"],
        "A single template provisions equivalent stacks; checksum validation proves both pipelines consumed "
        "the same build output.",
        [
            ("CodePipeline artifacts", "https://docs.aws.amazon.com/codepipeline/latest/userguide/artifacts.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "A SAM HTTP API must validate a proprietary token header via an existing on-premises auth service "
        "(not SAML/OIDC). Which API Gateway mechanism applies?",
        [
            ("a", "Lambda authorizer that calls the legacy service and returns an IAM policy"),
            ("b", "Amazon Cognito user pool"),
            ("c", "Cognito identity pool"),
            ("d", "API key only"),
        ],
        ["a"],
        "Lambda authorizers implement custom token validation logic in one function.",
        [
            ("Lambda authorizers", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "CodeDeploy must target on-premises servers with rotating credentials and tag-based deployment groups. "
        "What is the MOST secure registration pattern?",
        [
            ("a", "Long-lived IAM user access keys in a local file"),
            ("b", "IAM user keys plus instance ID registration lists"),
            ("c", "IAM role with STS AssumeRole, periodic credential refresh, agent install, tag-based groups"),
            ("d", "Same as (c) but register instances by ID list instead of tags"),
        ],
        ["c"],
        "Temporary credentials from AssumeRole avoid static keys; deployment groups target tags, not manual ID lists.",
        [
            ("On-premises instances", "https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-on-premises.html"),
        ],
    ),
    (
        "resilient-cloud-solutions",
        "multiple-choice",
        "New EC2 instances behind an ALB must finish registration with an external audit API before receiving "
        "traffic. Which Auto Scaling integration ensures that?",
        [
            ("a", "Lifecycle hook in Pending:Wait; custom script registers; complete with CONTINUE or ABANDON"),
            ("b", "User data script only; return non-zero on failure"),
            ("c", "EventBridge schedule every 5 minutes to register instances"),
            ("d", "EventBridge on launch invoking Lambda asynchronously without blocking scale-out"),
        ],
        ["a"],
        "Lifecycle hooks pause launch until your script confirms readiness.",
        [
            ("Lifecycle hooks", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html"),
        ],
    ),
    (
        "config-management-iac",
        "multiple-response",
        "Legal documents in S3 may be tagged LegalHold=true. Objects older than 90 days without that tag "
        "must expire automatically; uploads from apps that cannot add tags must still be deletable on schedule. "
        "Which TWO actions? (Select TWO.)",
        [
            ("a", "Deny PutObject unless LegalHold tag is present on upload"),
            ("b", "Lifecycle expiration after 90 days with no tag filter"),
            ("c", "S3 event → Lambda adds LegalHold=false when the tag is missing"),
            ("d", "Bucket policy denying delete when LegalHold=true using ExistingObjectTag"),
            ("e", "Lifecycle rule: age > 90 days AND LegalHold=false"),
        ],
        ["c", "e"],
        "Defaulting the tag enables lifecycle filters; expiration with tag=false skips legal holds.",
        [
            ("Lifecycle filters", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"),
        ],
    ),
    (
        "incident-event-response",
        "multiple-choice",
        "ECS tasks stop with reason Essential container in task exited. Email notification is required with "
        "minimal code. SNS topic already exists. Next step?",
        [
            ("a", "Enable cluster-level ECS notifications UI"),
            ("b", "EventBridge rule on ECS task STOPPED with that stoppedReason → SNS target"),
            ("c", "Lambda polling DescribeTasks on a schedule"),
            ("d", "Set notifications=true on the task definition"),
        ],
        ["b"],
        "EventBridge captures ECS events natively; SNS delivers mail without custom polling.",
        [
            ("ECS events", "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_cwe_events.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "Deploy API Gateway + Lambda + DynamoDB + ElastiCache Redis for a serverless web API with the least "
        "operational overhead. Preferred packaging?",
        [
            ("a", "Single AWS SAM template for all resources"),
            ("b", "CloudFormation only with custom resources for every component"),
            ("c", "CloudFormation for Redis; SAM for the rest"),
            ("d", "CloudFormation template without SAM transform"),
        ],
        ["a"],
        "SAM extends CloudFormation for serverless patterns in one deployable template.",
        [
            ("AWS SAM", "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html"),
        ],
    ),
    (
        "incident-event-response",
        "multiple-choice",
        "Developers launch EC2 from custom AMIs, but some instances use unapproved images. Automatic discovery "
        "and termination is required. What should you deploy?",
        [
            ("a", "Service Catalog products only"),
            ("b", "SCP denying ec2:RunInstances attached to an IAM group"),
            ("c", "AWS Config rule with remediation that terminates noncompliant instances"),
            ("d", "CloudFormation templates developers run manually"),
        ],
        ["c"],
        "Config rules evaluate running instances; remediation can stop noncompliant hosts automatically.",
        [
            ("Config remediation", "https://docs.aws.amazon.com/config/latest/developerguide/remediation.html"),
        ],
    ),
    (
        "config-management-iac",
        "multiple-choice",
        "An Auto Scaling fleet drifts because operators SSH in and change packages. The company wants identical "
        "configuration at launch and over time. Which process?",
        [
            ("a", "New golden AMI per patch; OldestLaunchConfiguration termination; double capacity then scale in; "
             "block console access; use Systems Manager for maintenance"),
            ("b", "Use AWS-provided AMI and yum update in user data only"),
            ("c", "NewestInstance termination policy with Config maintenance"),
            ("d", "OldestLaunchConfiguration policy but mutate instances via SSH"),
        ],
        ["a"],
        "Replacing instances from a fresh AMI and discouraging manual drift aligns with immutable infrastructure.",
        [
            ("AMI immutability", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html"),
            ("Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "A public REST API’s Lambda now requires a language field in the JSON body. One production alias must "
        "serve everyone; legacy clients omit language. How should the team roll out?",
        [
            ("a", "New API only; delete old Lambda immediately"),
            ("b", "Point existing API to new Lambda and delete old function day one"),
            ("c", "New API for new clients; old API unchanged"),
            ("d", "New API for new clients; add mapping template on legacy API integration injecting language=English"),
        ],
        ["d"],
        "Mapping templates let the existing stage add defaults while a new API serves explicit language values.",
        [
            ("Mapping templates", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html"),
        ],
    ),
    (
        "reliability-resilience",
        "multiple-choice",
        "Multi-AZ RDS MySQL needs DR in a second Region with RTO < 2 hours and RPO < 10 minutes, cost-sensitive. "
        "Stateless web tier is on EC2 behind an ALB. Recommended DR pattern?",
        [
            ("a", "Elastic Beanstalk second Region; swap CNAME on disaster"),
            ("b", "Maintain AMIs and a cross-Region RDS read replica; CloudFormation stack in DR; promote replica; "
             "update DNS"),
            ("c", "Hourly Lambda snapshots only"),
            ("d", "Active-active Aurora global DB with cloned web tier always running"),
        ],
        ["b"],
        "Read replicas meet tight RPO; AMIs + IaC enable faster RTO without full dual-site cost.",
        [
            ("Cross-Region read replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html"),
            ("DR whitepaper", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "Python services in CodePipeline need static analysis for defects before compile. Which service integrates "
        "with the Git repo for pull-request feedback?",
        [
            ("a", "CodeGuru Profiler in CodeBuild"),
            ("b", "CodeGuru Profiler prebuild only"),
            ("c", "Associate the repository with CodeGuru Reviewer"),
            ("d", "CodeGuru Reviewer only inside CodeBuild without repo association"),
        ],
        ["c"],
        "CodeGuru Reviewer analyzes PRs for code quality and security issues in Python and Java.",
        [
            ("CodeGuru Reviewer", "https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/welcome.html"),
        ],
    ),
    (
        "config-management-iac",
        "multiple-choice",
        "Operators want every optional CloudFormation property defined in code and drift corrected by re-applying "
        "the full template, using managed governance rather than a custom Lambda scheduler. What should they add?",
        [
            ("a", "DetectStackDrift Lambda on a cron only"),
            ("b", "Stack policy denying updates"),
            ("c", "Explicit properties in the template plus AWS Config drift detection with "
             "AWS-UpdateCloudFormationStack remediation"),
            ("d", "CloudTrail alone"),
        ],
        ["c"],
        "Config’s CloudFormation drift check plus the standard remediation runbook updates stacks to match templates.",
        [
            ("cloudformation-stack-drift-detection-check", "https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-drift-detection-check.html"),
        ],
    ),
    (
        "resilient-cloud-solutions",
        "multiple-choice",
        "A stateless tier must fail over DNS to a warm secondary Region. Database is RDS Multi-AZ in the primary "
        "Region only today. What improves Regional resilience for the app tier first?",
        [
            ("a", "Enable Multi-AZ on the ALB"),
            ("b", "Copy launch templates/AMIs to the DR Region and automate stack creation with Route 53 failover"),
            ("c", "Increase Auto Scaling max size in one Region"),
            ("d", "Use larger instance types"),
        ],
        ["b"],
        "Pre-staged AMIs and IaC in the DR Region shorten recovery; Route 53 health checks shift traffic.",
        [
            ("Route 53 failover", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html"),
        ],
    ),
    (
        "monitoring-logging",
        "multiple-choice",
        "During a blue/green CodeDeploy cutover, target 5xx rates from the load balancer are not rising, but "
        "application log errors are. Which signal should drive automated rollback?",
        [
            ("a", "ALB HTTPCode_Target_5XX_Count alone"),
            ("b", "Deployment group linked to a log-derived error metric alarm"),
            ("c", "Manual SNS email to operators only"),
            ("d", "EC2 CPUUtilization alarm"),
        ],
        ["b"],
        "Application errors may appear only in logs; metric filters surface them to CodeDeploy alarms.",
        [
            ("CodeDeploy monitoring", "https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring.html"),
        ],
    ),
    (
        "incident-event-response",
        "multiple-choice",
        "Security needs daily detection of public S3 buckets across many accounts without writing custom "
        "drift Lambdas per account. Which managed capability applies?",
        [
            ("a", "S3 Inventory only"),
            ("b", "Macie for every object daily"),
            ("c", "Organization-wide AWS Config conformance pack with public access rules and remediation"),
            ("d", "CloudFront in front of all buckets"),
        ],
        ["c"],
        "Conformance packs roll Config rules and remediation to all accounts in the organization.",
        [
            ("Conformance packs", "https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html"),
        ],
    ),
    (
        "sdlc-automation",
        "multiple-choice",
        "A team must shift 10% of Lambda alias traffic for alias `live` without changing the API invoke URL. "
        "Which feature applies?",
        [
            ("a", "CodeDeploy linear traffic shifting on the Lambda alias"),
            ("b", "New API Gateway custom domain"),
            ("c", "Weighted target groups on an ALB in front of Lambda"),
            ("d", "Step Functions choice state"),
        ],
        ["a"],
        "CodeDeploy supports canary and linear deployments for Lambda aliases behind the same integration.",
        [
            ("Lambda deployments", "https://docs.aws.amazon.com/lambda/latest/dg/configuring-alias-routing.html"),
        ],
    ),
    (
        "reliability-resilience",
        "multiple-choice",
        "Chaos testing should inject EC2 stop failures in a non-production environment with guardrails. Which "
        "AWS service is purpose-built?",
        [
            ("a", "AWS Fault Injection Simulator experiment templates"),
            ("b", "Random SSH reboot scripts"),
            ("c", "Disable Auto Scaling"),
            ("d", "Delete the VPC"),
        ],
        ["a"],
        "FIS provides controlled fault injection experiments with safety controls.",
        [
            ("FIS", "https://docs.aws.amazon.com/fis/latest/userguide/fis-intro.html"),
        ],
    ),
]
