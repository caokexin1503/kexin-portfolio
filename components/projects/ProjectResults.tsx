import type { ProjectResult } from "@prisma/client";

export function ProjectResults({ results }: { results: ProjectResult[] }) {
  if (results.length === 0) return null;

  const sorted = [...results].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {sorted.map((result) => (
        <div key={result.id} className="rounded-lg border border-border bg-surface p-5">
          <p className="text-2xl font-bold tracking-tight text-accent">{result.value}</p>
          <p className="mt-1 text-sm font-medium text-foreground">{result.metric}</p>
          {result.note && <p className="mt-1 text-xs text-muted">{result.note}</p>}
        </div>
      ))}
    </div>
  );
}
