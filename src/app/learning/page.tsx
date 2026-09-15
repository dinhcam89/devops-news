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
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const roadmap = [
  {
    level: "Beginner",
    title: "Foundations",
    description: "The core skills every DevOps engineer must master before touching the cloud.",
    items: [
      {
        slug: "linux-scripting",
        name: "Linux & Scripting",
        icon: Terminal,
        desc: "Master the command line, file systems, permissions, and basic Bash/Python scripting.",
      },
      {
        slug: "git",
        name: "Version Control",
        icon: GitBranch,
        desc: "Deep dive into Git branching strategies, rebasing, and collaborating on GitHub/GitLab.",
      },
      {
        slug: "networking",
        name: "Networking Basics",
        icon: Network,
        desc: "Understand OSI model, TCP/IP, DNS, HTTP/S, and basic load balancing concepts.",
      },
    ],
  },
  {
    level: "Intermediate",
    title: "Containerization & CI/CD",
    description: "Packaging applications and automating their delivery pipelines.",
    items: [
      {
        slug: "docker",
        name: "Containers (Docker)",
        icon: Package,
        desc: "Learn how to build efficient Docker images, manage containers, and use Docker Compose.",
      },
      {
        slug: "cicd",
        name: "CI/CD Pipelines",
        icon: Workflow,
        desc: "Automate testing and deployment using GitHub Actions, GitLab CI, or Jenkins.",
      },
      {
        slug: "cloud-providers",
        name: "Cloud Providers",
        icon: Cloud,
        desc: "Get comfortable with core services (Compute, Storage, IAM, VPC) on AWS, Azure, or GCP.",
      },
    ],
  },
  {
    level: "Advanced",
    title: "Orchestration & Observability",
    description: "Managing infrastructure at scale, ensuring reliability, and securing systems.",
    items: [
      {
        slug: "kubernetes",
        name: "Kubernetes (K8s)",
        icon: Layers,
        desc: "Deploy, scale, and manage containerized applications with Kubernetes architecture.",
      },
      {
        slug: "iac",
        name: "Infrastructure as Code",
        icon: BookOpen,
        desc: "Automate infrastructure provisioning using Terraform, OpenTofu, or Pulumi.",
      },
      {
        slug: "observability",
        name: "Observability",
        icon: Activity,
        desc: "Implement logging, metrics, and tracing using Prometheus, Grafana, and OpenTelemetry.",
      },
      {
        slug: "devsecops",
        name: "DevSecOps",
        icon: ShieldCheck,
        desc: "Integrate security scanning (SAST/DAST), secrets management, and compliance into pipelines.",
      },
    ],
  },
];

export default function LearningPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          DevOps Learning Roadmap
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A curated, step-by-step guide to mastering DevOps and Platform Engineering. 
          Click any topic to dive deep into its learning path, key concepts, and resources.
        </p>
      </div>

      <div className="space-y-16">
        {roadmap.map((phase, index) => (
          <section key={phase.level} className="relative">
            {/* Connecting line for visual flow (except last item) */}
            {index !== roadmap.length - 1 && (
              <div className="absolute left-1/2 top-full -bottom-16 w-0.5 -translate-x-1/2 bg-gradient-to-b from-border to-transparent hidden lg:block" />
            )}

            <div className="mb-8 flex flex-col items-center text-center">
              <span className="mb-2 inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                Phase {index + 1}
              </span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {phase.level}: {phase.title}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {phase.description}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {phase.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/learning/${item.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/10"
                >
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 ring-1 ring-inset ring-indigo-500/30 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      
      <div className="mt-24 text-center">
        <div className="inline-flex items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20">
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-2">Want to contribute?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This roadmap is community-driven. If you know a fantastic resource that should be listed here, let us know!
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Submit a Resource
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
