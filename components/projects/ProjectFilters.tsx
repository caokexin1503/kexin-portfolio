"use client";

import { useCallback, useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/utils";
import { projectCategories } from "@/lib/validation";
import { Select } from "@/components/ui/Input";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function ProjectFilters({ technologies }: { technologies: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const activeCategory = searchParams.get("category") ?? "all";
  const activeTech = searchParams.get("tech") ?? "";
  const activeSort = searchParams.get("sort") ?? "featured";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      if (query !== (searchParams.get("q") ?? "")) {
        updateParams({ q: query || null });
      }
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hasActiveFilters = activeCategory !== "all" || activeTech || query || activeSort !== "featured";

  return (
    <div className={cn("space-y-4", isPending && "opacity-70")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects (e.g. YOLO, Unity)"
            className="focus-ring w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 text-sm placeholder:text-muted"
            aria-label="Search projects"
          />
        </div>

        <Select
          value={activeSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          aria-label="Sort projects"
          className="sm:w-44"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </Select>

        {technologies.length > 0 && (
          <Select
            value={activeTech}
            onChange={(e) => updateParams({ tech: e.target.value || null })}
            aria-label="Filter by technology"
            className="sm:w-48"
          >
            <option value="">All Technologies</option>
            {technologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </Select>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              router.push(pathname, { scroll: false });
            }}
            className="focus-ring inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted hover:text-foreground"
          >
            <XIcon className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParams({ category: null })}
          className={cn(
            "focus-ring rounded-full border px-3 py-1.5 text-sm transition-colors",
            activeCategory === "all"
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted hover:text-foreground",
          )}
        >
          All
        </button>
        {projectCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => updateParams({ category: cat })}
            className={cn(
              "focus-ring rounded-full border px-3 py-1.5 text-sm transition-colors",
              activeCategory === cat
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>
    </div>
  );
}
