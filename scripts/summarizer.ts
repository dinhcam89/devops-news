/**
 * Phase 1: Rule-based article summarization and tagging.
 *
 * Extracts the lede (first 2-3 sentences), identifies tech keywords,
 * and categorizes articles by topic area.
 */

// ============================================
// SUMMARY GENERATION
// ============================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate a short summary from article content using Gemini API.
 * Extracts the DevOps Impact.
 */
export async function generateSummary(title: string, content: string): Promise<string> {
  if (!content || content.trim().length === 0) {
    return title;
  }

  // Strip HTML tags for token efficiency
  const clean = content
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-zA-Z]+;/g, " ") // HTML entities
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000); // Send at most ~15k chars to LLM to save tokens and avoid limits

  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY is not set. Falling back to rule-based summary.");
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
    const summary = sentences.slice(0, 3).join(" ");
    return summary.length > 400 ? summary.slice(0, 397) + "..." : summary;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are an expert DevOps engineer and SRE. Read the following article title and content.
Provide a short summary (maximum 3 sentences) focusing specifically on the **DevOps Impact**.
Highlight any breaking changes, new features, or implications for operations and reliability.
If the article is not strictly related to DevOps, provide a general summary.

Title: ${title}

Content:
${clean}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summaryText = response.text().trim();
    return summaryText.length > 400 ? summaryText.slice(0, 397) + "..." : summaryText;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return clean.slice(0, 300) + "..."; // Fallback
  }
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
  ai: [
    "agents",
    "aiops",
    "llm",
    "rag",
    "sre-agent",
    "copilot",
    "autonomous remediation",
    "generative ai",
    "openai",
    "gemini",
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
  if (tags.includes("ai")) {
    return "AI in DevOps";
  }
  return "General DevOps";
}
