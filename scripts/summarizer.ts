/**
 * Phase 1: Rule-based article summarization and tagging.
 *
 * Extracts the lede (first 2-3 sentences), identifies tech keywords,
 * and categorizes articles by topic area.
 */

// ============================================
// SUMMARY GENERATION
// ============================================

/**
 * Generate a short summary from article content.
 * Extracts the first 2-3 meaningful sentences.
 */
export function generateSummary(title: string, content: string): string {
  if (!content || content.trim().length === 0) {
    return title;
  }

  // Strip HTML tags
  const clean = content
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-zA-Z]+;/g, " ") // HTML entities
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && !s.startsWith("http"));

  if (sentences.length === 0) {
    return clean.slice(0, 300);
  }

  // Take first 3 sentences, cap at 400 chars
  const summary = sentences.slice(0, 3).join(" ");
  return summary.length > 400 ? summary.slice(0, 397) + "..." : summary;
}

// ============================================
// TAG EXTRACTION
// ============================================

const TECH_KEYWORDS: Record<string, string[]> = {
  kubernetes: [
    "kubernetes",
    "k8s",
    "kubectl",
    "helm",
    "kustomize",
    "kube",
    "eks",
    "aks",
    "gke",
  ],
  docker: ["docker", "container", "dockerfile", "containerd", "podman"],
  azure: [
    "azure",
    "microsoft cloud",
    "azure devops",
    "aks",
    "azure functions",
    "bicep",
  ],
  aws: [
    "aws",
    "amazon web services",
    "eks",
    "lambda",
    "cloudformation",
    "cdk",
  ],
  terraform: [
    "terraform",
    "hcl",
    "infrastructure as code",
    "iac",
    "opentofu",
  ],
  cicd: [
    "ci/cd",
    "pipeline",
    "github actions",
    "jenkins",
    "argocd",
    "tekton",
    "gitlab ci",
  ],
  security: [
    "security",
    "vulnerability",
    "cve",
    "zero trust",
    "rbac",
    "supply chain",
    "sbom",
  ],
  observability: [
    "monitoring",
    "observability",
    "prometheus",
    "grafana",
    "opentelemetry",
    "otel",
    "datadog",
    "jaeger",
  ],
  "service-mesh": ["istio", "envoy", "linkerd", "service mesh", "sidecar"],
  gitops: ["gitops", "flux", "argocd", "argo cd", "fluxcd"],
  linux: ["linux", "kernel", "ubuntu", "debian", "centos", "rhel", "systemd"],
  networking: [
    "networking",
    "dns",
    "ingress",
    "load balancer",
    "cni",
    "calico",
    "cilium",
  ],
};

/**
 * Extract technology-related tags from article title and content.
 */
export function extractTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];

  for (const [tag, keywords] of Object.entries(TECH_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      tags.push(tag);
    }
  }

  return tags;
}

// ============================================
// CATEGORIZATION
// ============================================

/**
 * Categorize an article based on its tags.
 */
export function categorize(tags: string[]): string {
  if (
    tags.includes("kubernetes") ||
    tags.includes("docker") ||
    tags.includes("service-mesh")
  ) {
    return "Cloud Native";
  }
  if (tags.includes("azure") || tags.includes("aws")) {
    return "Cloud Platforms";
  }
  if (tags.includes("cicd") || tags.includes("gitops")) {
    return "CI/CD & Automation";
  }
  if (tags.includes("security")) {
    return "Security";
  }
  if (tags.includes("observability")) {
    return "Observability";
  }
  if (tags.includes("terraform")) {
    return "Infrastructure";
  }
  if (tags.includes("networking")) {
    return "Networking";
  }
  return "General DevOps";
}
