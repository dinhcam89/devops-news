"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { addTrackedRepo } from "@/lib/actions";

const CATEGORIES = [
  "Orchestration",
  "Cloud / Azure",
  "Cloud / AWS",
  "Cloud / GCP",
  "CI/CD",
  "CI/CD / GitOps",
  "IaC",
  "Containers",
  "Observability",
  "Package Management",
  "Networking / Security",
  "Other",
];

export function AddRepoForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await addTrackedRepo(formData);
      if (result?.error) {
        setFeedback({ type: "error", message: result.error });
      } else if (result?.success) {
        setFeedback({
          type: "success",
          message: `Successfully added ${result.name}!`,
        });
        // Reset form after brief delay
        setTimeout(() => {
          setIsOpen(false);
          setFeedback(null);
        }, 1500);
      }
    });
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Add Repository
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-background/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Track a GitHub Repository</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(false);
            setFeedback(null);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="repo"
            className="mb-1.5 block text-sm font-medium text-muted-foreground"
          >
            Repository
          </label>
          <input
            id="repo"
            name="repo"
            type="text"
            required
            placeholder="owner/repo or https://github.com/owner/repo"
            className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-muted-foreground"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              feedback.type === "success"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {feedback.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Repository
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
