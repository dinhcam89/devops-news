export default function TrackerLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="mb-2 h-10 w-72 animate-pulse rounded-lg bg-border/30" />
        <div className="h-5 w-96 animate-pulse rounded-lg bg-border/20" />
      </div>

      <div className="space-y-12">
        {[1, 2].map((section) => (
          <section key={section}>
            <div className="mb-6 h-7 w-40 animate-pulse rounded-lg bg-border/30" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="rounded-2xl border border-border/50 bg-background/50 p-5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-1 h-5 w-28 animate-pulse rounded bg-border/30" />
                      <div className="h-3 w-20 animate-pulse rounded bg-border/20" />
                    </div>
                    <div className="h-5 w-12 animate-pulse rounded-full bg-border/20" />
                  </div>
                  <div className="mb-4 space-y-1.5">
                    <div className="h-3 w-full animate-pulse rounded bg-border/20" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-border/20" />
                  </div>
                  <div className="mb-3 h-4 w-24 animate-pulse rounded bg-border/20" />
                  <div className="flex gap-4">
                    <div className="h-3 w-16 animate-pulse rounded bg-border/20" />
                    <div className="h-3 w-20 animate-pulse rounded bg-border/20" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
