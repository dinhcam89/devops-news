import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Award,
  ExternalLink,
  CheckCircle,
  FileText,
  Video,
  GraduationCap,
  FlaskConical,
} from "lucide-react";
import { getTopicBySlug, learningTopics } from "@/data/learning-content";
import type { Resource } from "@/data/learning-content";

// Generate static params for all topics
export function generateStaticParams() {
  return learningTopics.map((topic) => ({ slug: topic.slug }));
}

const resourceIcons: Record<Resource["type"], React.ReactNode> = {
  docs: <FileText className="h-4 w-4" />,
  course: <GraduationCap className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  lab: <FlaskConical className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
};

const resourceLabels: Record<Resource["type"], string> = {
  docs: "Documentation",
  course: "Course",
  video: "Video",
  lab: "Hands-on Lab",
  book: "Book",
};

const levelColors: Record<string, string> = {
  Beginner: "from-emerald-500/20 to-teal-500/20 text-emerald-400 ring-emerald-500/30",
  Intermediate: "from-amber-500/20 to-orange-500/20 text-amber-400 ring-amber-500/30",
  Advanced: "from-rose-500/20 to-pink-500/20 text-rose-400 ring-rose-500/30",
};

export default async function LearningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const Icon = topic.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/learning"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roadmap
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {topic.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-0.5 text-xs font-medium ring-1 ring-inset ${levelColors[topic.level]}`}
              >
                {topic.level}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">{topic.tagline}</p>
          </div>
        </div>
      </div>

      {/* Why It Matters */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Why It Matters for DevOps
        </h2>
        <div className="rounded-2xl border border-border/50 bg-indigo-500/5 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {topic.whyItMatters}
          </p>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Key Concepts</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {topic.keyConcepts.map((concept, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border/30 bg-background/50 px-4 py-3"
            >
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              <span className="text-sm">{concept}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Learning Path
        </h2>
        <div className="relative space-y-0">
          {topic.learningPath.map((step, i) => (
            <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Vertical line */}
              {i !== topic.learningPath.length - 1 && (
                <div className="absolute left-[18px] top-10 bottom-0 w-px bg-border/50" />
              )}
              {/* Step number */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                {i + 1}
              </div>
              <div className="pt-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {topic.certifications.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight">
            <Award className="h-5 w-5 text-yellow-500" />
            Certifications
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {topic.certifications.map((cert, i) => (
              <Link
                key={i}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 p-5 transition-all hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5"
              >
                <div>
                  <h3 className="font-semibold group-hover:text-yellow-400 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.provider} · {cert.level}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Curated Resources
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {topic.resources.map((resource, i) => (
            <Link
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-5 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                {resourceIcons[resource.type]}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium group-hover:text-indigo-400 transition-colors truncate">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {resourceLabels[resource.type]}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/learning">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </Button>
        </Link>
      </div>
    </div>
  );
}
