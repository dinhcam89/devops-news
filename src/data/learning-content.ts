import type { LucideIcon } from "lucide-react";
import {
  Terminal,
  GitBranch,
  Network,
  Package,
  Workflow,
  Cloud,
  Layers,
  Activity,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export interface Resource {
  title: string;
  url: string;
  type: "docs" | "course" | "video" | "lab" | "book";
}

export interface Certification {
  name: string;
  provider: string;
  url: string;
  level: string;
}

export interface LearningStep {
  title: string;
  description: string;
}

export interface LearningTopic {
  slug: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  whyItMatters: string;
  keyConcepts: string[];
  learningPath: LearningStep[];
  certifications: Certification[];
  resources: Resource[];
}

export const learningTopics: LearningTopic[] = [
  {
    slug: "linux-scripting",
    name: "Linux & Scripting",
    icon: Terminal,
    tagline: "The operating system that powers 96% of the world's servers.",
    level: "Beginner",
    whyItMatters:
      "Almost every server, container, and cloud VM runs Linux. Understanding the command line, file systems, and shell scripting is the absolute foundation of any DevOps career. Without it, you cannot debug deployments, write automation scripts, or manage infrastructure.",
    keyConcepts: [
      "File system hierarchy (/, /etc, /var, /home)",
      "Permissions & ownership (chmod, chown, umask)",
      "Process management (ps, top, kill, systemd)",
      "Package managers (apt, yum, dnf)",
      "Shell scripting (Bash variables, loops, conditionals)",
      "Text processing (grep, sed, awk, jq)",
      "Networking tools (curl, wget, netstat, ss, dig)",
      "Cron jobs & scheduling",
    ],
    learningPath: [
      { title: "Navigate the file system", description: "Learn cd, ls, pwd, find, and file manipulation commands." },
      { title: "Manage users & permissions", description: "Create users, groups, and understand Linux permission model." },
      { title: "Work with processes", description: "Monitor and manage running processes with systemd and journalctl." },
      { title: "Write Bash scripts", description: "Automate repetitive tasks with variables, loops, functions, and error handling." },
      { title: "Master text processing", description: "Parse logs, extract data, and transform output using grep, awk, and sed." },
    ],
    certifications: [
      { name: "LFCS", provider: "Linux Foundation", url: "https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/", level: "Associate" },
      { name: "RHCSA", provider: "Red Hat", url: "https://www.redhat.com/en/services/certification/rhcsa", level: "Associate" },
    ],
    resources: [
      { title: "Linux Journey", url: "https://linuxjourney.com/", type: "course" },
      { title: "The Missing Semester (MIT)", url: "https://missing.csail.mit.edu/", type: "course" },
      { title: "Linux Command Line Basics", url: "https://www.freecodecamp.org/news/the-linux-command-handbook/", type: "book" },
      { title: "Bash Scripting Tutorial", url: "https://www.gnu.org/software/bash/manual/bash.html", type: "docs" },
    ],
  },
  {
    slug: "git",
    name: "Version Control (Git)",
    icon: GitBranch,
    tagline: "The backbone of modern software collaboration.",
    level: "Beginner",
    whyItMatters:
      "Git is how every team tracks code changes, collaborates on features, and maintains release history. As a DevOps engineer, you will manage branching strategies, resolve merge conflicts, trigger CI/CD pipelines from Git events, and maintain infrastructure-as-code repositories.",
    keyConcepts: [
      "Repository lifecycle (init, clone, remote)",
      "Staging area & commits",
      "Branching strategies (GitFlow, trunk-based)",
      "Merging vs rebasing",
      "Pull requests & code reviews",
      "Tags & releases",
      "Git hooks for automation",
      ".gitignore and secrets management",
    ],
    learningPath: [
      { title: "Set up Git & create your first repo", description: "Install Git, configure your identity, and make your first commit." },
      { title: "Master branching & merging", description: "Create feature branches, merge them, and resolve conflicts." },
      { title: "Learn rebasing & history rewriting", description: "Understand interactive rebase, squashing, and amending commits." },
      { title: "Collaborate with Pull Requests", description: "Fork repos, submit PRs, and conduct code reviews on GitHub." },
      { title: "Automate with Git hooks", description: "Run linters and tests automatically on commit or push." },
    ],
    certifications: [],
    resources: [
      { title: "Pro Git Book", url: "https://git-scm.com/book/en/v2", type: "book" },
      { title: "Learn Git Branching", url: "https://learngitbranching.js.org/", type: "lab" },
      { title: "GitHub Skills", url: "https://skills.github.com/", type: "course" },
      { title: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git/tutorials", type: "course" },
    ],
  },
  {
    slug: "networking",
    name: "Networking Basics",
    icon: Network,
    tagline: "If you can't debug the network, you can't debug the app.",
    level: "Beginner",
    whyItMatters:
      "Networking underpins everything in the cloud — from load balancers to service meshes. Understanding how packets flow, how DNS resolves, and how TLS secures connections is critical for troubleshooting production issues and designing resilient architectures.",
    keyConcepts: [
      "OSI model (7 layers)",
      "TCP/IP protocol suite",
      "DNS resolution & record types (A, CNAME, MX, TXT)",
      "HTTP/HTTPS & TLS certificates",
      "Load balancing (L4 vs L7)",
      "VPCs, subnets, and CIDR notation",
      "Firewalls & security groups",
      "NAT, proxies, and reverse proxies",
    ],
    learningPath: [
      { title: "Understand the OSI model", description: "Learn what happens at each layer from physical to application." },
      { title: "Master DNS", description: "Configure DNS records, understand resolution chains, and debug with dig/nslookup." },
      { title: "Learn TCP/IP & HTTP", description: "Trace packets with tcpdump, understand three-way handshakes." },
      { title: "Set up TLS/SSL", description: "Generate certificates, configure HTTPS, and understand certificate chains." },
      { title: "Design cloud networking", description: "Plan VPCs, subnets, route tables, and security groups." },
    ],
    certifications: [
      { name: "CompTIA Network+", provider: "CompTIA", url: "https://www.comptia.org/certifications/network", level: "Associate" },
    ],
    resources: [
      { title: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/", type: "docs" },
      { title: "Computer Networking (Stanford)", url: "https://www.youtube.com/playlist?list=PLoCMsyE1cvdWKsLVyf6cPwCLDIZnOj0NS", type: "video" },
    ],
  },
  {
    slug: "docker",
    name: "Containers (Docker)",
    icon: Package,
    tagline: "Package once, run anywhere.",
    level: "Intermediate",
    whyItMatters:
      "Containers revolutionized how we build, ship, and run applications. Docker is the standard for containerization, enabling consistent environments from dev to prod. Understanding containers is a prerequisite for Kubernetes, CI/CD, and modern microservices.",
    keyConcepts: [
      "Container vs VM architecture",
      "Docker images & layers",
      "Dockerfile best practices (multi-stage builds)",
      "Container networking (bridge, host, overlay)",
      "Volumes & persistent storage",
      "Docker Compose for multi-container apps",
      "Image registries (Docker Hub, ECR, ACR, GCR)",
      "Container security scanning",
    ],
    learningPath: [
      { title: "Run your first container", description: "Pull an image, run it, explore docker ps, logs, and exec." },
      { title: "Write efficient Dockerfiles", description: "Build custom images with multi-stage builds and layer caching." },
      { title: "Manage data with volumes", description: "Persist data beyond container lifecycle using bind mounts and named volumes." },
      { title: "Orchestrate with Docker Compose", description: "Define multi-service applications with networking and dependencies." },
      { title: "Secure your containers", description: "Scan images for vulnerabilities, use non-root users, and limit capabilities." },
    ],
    certifications: [
      { name: "DCA", provider: "Mirantis", url: "https://training.mirantis.com/certification/dca-certification-exam/", level: "Associate" },
    ],
    resources: [
      { title: "Docker Official Get Started", url: "https://docs.docker.com/get-started/", type: "docs" },
      { title: "Docker Deep Dive (Nigel Poulton)", url: "https://www.amazon.com/Docker-Deep-Dive-Nigel-Poulton/dp/1916585256", type: "book" },
      { title: "Play with Docker", url: "https://labs.play-with-docker.com/", type: "lab" },
    ],
  },
  {
    slug: "cicd",
    name: "CI/CD Pipelines",
    icon: Workflow,
    tagline: "Automate everything from commit to production.",
    level: "Intermediate",
    whyItMatters:
      "CI/CD is the heart of DevOps — the practice of automating code integration, testing, and deployment. Mastering CI/CD pipelines means faster releases, fewer bugs in production, and the ability to deploy with confidence multiple times per day.",
    keyConcepts: [
      "Continuous Integration vs Continuous Delivery vs Continuous Deployment",
      "Pipeline stages (build, test, scan, deploy)",
      "GitHub Actions workflows & reusable actions",
      "GitLab CI/CD (.gitlab-ci.yml)",
      "Jenkins pipelines (Jenkinsfile)",
      "Artifact management",
      "Environment promotion (dev → staging → prod)",
      "Rollback strategies (blue-green, canary)",
    ],
    learningPath: [
      { title: "Understand CI/CD principles", description: "Learn the difference between CI, CD, and continuous deployment." },
      { title: "Build a GitHub Actions pipeline", description: "Create a workflow that builds, tests, and deploys on every push." },
      { title: "Add automated testing", description: "Integrate unit tests, integration tests, and code quality checks." },
      { title: "Implement deployment strategies", description: "Set up blue-green deployments and canary releases." },
      { title: "Secure your pipeline", description: "Manage secrets, add SAST/DAST scanning, and sign artifacts." },
    ],
    certifications: [
      { name: "GitHub Actions Certification", provider: "GitHub", url: "https://resources.github.com/learn/certifications/", level: "Associate" },
    ],
    resources: [
      { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", type: "docs" },
      { title: "GitLab CI/CD Tutorial", url: "https://docs.gitlab.com/ee/ci/", type: "docs" },
    ],
  },
  {
    slug: "cloud-providers",
    name: "Cloud Providers",
    icon: Cloud,
    tagline: "The infrastructure layer of modern software.",
    level: "Intermediate",
    whyItMatters:
      "AWS, Azure, and GCP are the platforms where production workloads live. Understanding core cloud services — compute, storage, networking, IAM — is essential for any DevOps role. Most organizations use at least one cloud provider, and many use multiple.",
    keyConcepts: [
      "Compute (EC2, Azure VMs, GCE)",
      "Storage (S3, Blob Storage, GCS)",
      "Identity & Access Management (IAM)",
      "Virtual networks (VPC, VNet)",
      "Managed databases (RDS, Azure SQL, Cloud SQL)",
      "Serverless (Lambda, Azure Functions, Cloud Functions)",
      "Cost management & billing alerts",
      "Cloud CLI tools (aws cli, az cli, gcloud)",
    ],
    learningPath: [
      { title: "Create a cloud account", description: "Sign up for the free tier on AWS, Azure, or GCP." },
      { title: "Deploy a virtual machine", description: "Launch a VM, SSH into it, and install a web server." },
      { title: "Understand IAM", description: "Create users, roles, and policies. Learn the principle of least privilege." },
      { title: "Work with storage", description: "Upload files to object storage, configure access policies and lifecycle rules." },
      { title: "Build a complete project", description: "Deploy a multi-tier web application using cloud services end to end." },
    ],
    certifications: [
      { name: "AWS Solutions Architect - Associate", provider: "AWS", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", level: "Associate" },
      { name: "AZ-104: Azure Administrator", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/", level: "Associate" },
      { name: "Google Cloud Associate Cloud Engineer", provider: "Google", url: "https://cloud.google.com/learn/certification/cloud-engineer", level: "Associate" },
    ],
    resources: [
      { title: "AWS Free Tier", url: "https://aws.amazon.com/free/", type: "lab" },
      { title: "Microsoft Learn (Azure)", url: "https://learn.microsoft.com/en-us/training/azure/", type: "course" },
      { title: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/", type: "course" },
    ],
  },
  {
    slug: "kubernetes",
    name: "Kubernetes (K8s)",
    icon: Layers,
    tagline: "The operating system for the cloud-native era.",
    level: "Advanced",
    whyItMatters:
      "Kubernetes is the industry standard for orchestrating containerized applications at scale. It handles scheduling, scaling, self-healing, and service discovery. Understanding K8s architecture and operations is one of the most in-demand DevOps skills today.",
    keyConcepts: [
      "Architecture (control plane, nodes, etcd, kubelet)",
      "Pods, Deployments, StatefulSets, DaemonSets",
      "Services & Ingress (ClusterIP, NodePort, LoadBalancer)",
      "ConfigMaps & Secrets",
      "Namespaces & RBAC",
      "Helm charts",
      "Horizontal Pod Autoscaler (HPA)",
      "Persistent Volumes & Storage Classes",
      "Network Policies",
    ],
    learningPath: [
      { title: "Set up a local cluster", description: "Install minikube or kind and deploy your first pod." },
      { title: "Master workload objects", description: "Learn Deployments, ReplicaSets, and rolling updates." },
      { title: "Configure networking", description: "Expose services, set up Ingress controllers, and understand DNS in K8s." },
      { title: "Manage config & secrets", description: "Use ConfigMaps, Secrets, and external secret operators." },
      { title: "Operate production clusters", description: "Monitor with Prometheus, log with Loki, and debug failing pods." },
    ],
    certifications: [
      { name: "CKA", provider: "CNCF", url: "https://www.cncf.io/certification/cka/", level: "Professional" },
      { name: "CKAD", provider: "CNCF", url: "https://www.cncf.io/certification/ckad/", level: "Professional" },
      { name: "CKS", provider: "CNCF", url: "https://www.cncf.io/certification/cks/", level: "Expert" },
    ],
    resources: [
      { title: "Kubernetes Official Tutorials", url: "https://kubernetes.io/docs/tutorials/", type: "docs" },
      { title: "Minikube Quick Start", url: "https://minikube.sigs.k8s.io/docs/start/", type: "lab" },
      { title: "KillerCoda (Interactive Labs)", url: "https://killercoda.com/", type: "lab" },
      { title: "Kubernetes the Hard Way", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way", type: "lab" },
    ],
  },
  {
    slug: "iac",
    name: "Infrastructure as Code",
    icon: BookOpen,
    tagline: "Define infrastructure in version-controlled, repeatable code.",
    level: "Advanced",
    whyItMatters:
      "IaC eliminates manual infrastructure provisioning. Instead of clicking through cloud consoles, you define your entire infrastructure in code that can be versioned, reviewed, tested, and reproduced. Terraform is the most widely adopted multi-cloud IaC tool.",
    keyConcepts: [
      "Declarative vs imperative IaC",
      "Terraform HCL syntax & providers",
      "State management (local vs remote state)",
      "Modules & reusable components",
      "Plan, Apply, Destroy lifecycle",
      "Terraform workspaces & environments",
      "OpenTofu (open-source fork)",
      "Pulumi (programming language-based IaC)",
    ],
    learningPath: [
      { title: "Write your first Terraform config", description: "Provision a simple cloud resource using HCL." },
      { title: "Manage state safely", description: "Set up remote state with S3/Azure Blob and enable state locking." },
      { title: "Build reusable modules", description: "Create parameterized, composable Terraform modules." },
      { title: "Implement CI/CD for IaC", description: "Run terraform plan in PRs and terraform apply on merge." },
      { title: "Test your infrastructure", description: "Use Terratest or native terraform test for validation." },
    ],
    certifications: [
      { name: "HashiCorp Terraform Associate", provider: "HashiCorp", url: "https://www.hashicorp.com/certification/terraform-associate", level: "Associate" },
    ],
    resources: [
      { title: "Terraform Tutorials", url: "https://developer.hashicorp.com/terraform/tutorials", type: "course" },
      { title: "Terraform Registry", url: "https://registry.terraform.io/", type: "docs" },
      { title: "Terraform Up & Running (Book)", url: "https://www.terraformupandrunning.com/", type: "book" },
    ],
  },
  {
    slug: "observability",
    name: "Observability",
    icon: Activity,
    tagline: "You can't fix what you can't see.",
    level: "Advanced",
    whyItMatters:
      "Observability is the practice of understanding your system's internal state through its external outputs. The three pillars — metrics, logs, and traces — give you the visibility needed to detect, diagnose, and resolve production incidents before they impact users.",
    keyConcepts: [
      "Three pillars: Metrics, Logs, Traces",
      "Prometheus for metrics collection",
      "Grafana for dashboards & alerting",
      "OpenTelemetry for instrumentation",
      "Distributed tracing (Jaeger, Tempo)",
      "Log aggregation (Loki, ELK stack)",
      "SLIs, SLOs, and error budgets",
      "Alerting strategies & on-call rotations",
    ],
    learningPath: [
      { title: "Instrument an application", description: "Add Prometheus metrics and OpenTelemetry traces to an app." },
      { title: "Build dashboards in Grafana", description: "Visualize key metrics with panels, variables, and alerts." },
      { title: "Set up log aggregation", description: "Collect and query logs with Loki or the ELK stack." },
      { title: "Implement distributed tracing", description: "Trace requests across microservices to find bottlenecks." },
      { title: "Define SLOs & error budgets", description: "Set measurable reliability targets and build alerting around them." },
    ],
    certifications: [
      { name: "Prometheus Certified Associate", provider: "CNCF", url: "https://www.cncf.io/certification/pca/", level: "Associate" },
    ],
    resources: [
      { title: "Prometheus Docs", url: "https://prometheus.io/docs/introduction/overview/", type: "docs" },
      { title: "Grafana Tutorials", url: "https://grafana.com/tutorials/", type: "course" },
      { title: "OpenTelemetry Docs", url: "https://opentelemetry.io/docs/", type: "docs" },
    ],
  },
  {
    slug: "devsecops",
    name: "DevSecOps",
    icon: ShieldCheck,
    tagline: "Security is everyone's responsibility, not just the security team's.",
    level: "Advanced",
    whyItMatters:
      "DevSecOps integrates security practices into every stage of the software delivery lifecycle. Instead of bolting on security at the end, you bake it into your CI/CD pipeline with automated scanning, secrets management, and compliance-as-code.",
    keyConcepts: [
      "Shift-left security philosophy",
      "SAST (Static Application Security Testing)",
      "DAST (Dynamic Application Security Testing)",
      "Container image scanning (Trivy, Snyk)",
      "Secrets management (Vault, AWS Secrets Manager)",
      "Supply chain security (SBOM, Sigstore)",
      "Policy as Code (OPA, Kyverno)",
      "Compliance automation",
    ],
    learningPath: [
      { title: "Add SAST to your CI pipeline", description: "Integrate static code analysis tools like SonarQube or Semgrep." },
      { title: "Scan container images", description: "Use Trivy to detect vulnerabilities in Docker images automatically." },
      { title: "Manage secrets properly", description: "Replace hardcoded secrets with Vault or cloud-native secret managers." },
      { title: "Implement policy as code", description: "Enforce Kubernetes policies with OPA Gatekeeper or Kyverno." },
      { title: "Generate SBOMs", description: "Create Software Bill of Materials for supply chain transparency." },
    ],
    certifications: [
      { name: "CompTIA Security+", provider: "CompTIA", url: "https://www.comptia.org/certifications/security", level: "Associate" },
    ],
    resources: [
      { title: "OWASP DevSecOps Guideline", url: "https://owasp.org/www-project-devsecops-guideline/", type: "docs" },
      { title: "Trivy (Container Scanning)", url: "https://aquasecurity.github.io/trivy/", type: "docs" },
      { title: "HashiCorp Vault Tutorials", url: "https://developer.hashicorp.com/vault/tutorials", type: "course" },
    ],
  },
];

export function getTopicBySlug(slug: string): LearningTopic | undefined {
  return learningTopics.find((t) => t.slug === slug);
}
