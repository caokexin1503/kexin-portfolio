"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { philosophers } from "@/data/philosophers";
import { PhilosophyTimeline } from "@/components/Philosophy/PhilosophyTimeline";
import { PhilosopherScene } from "@/components/Philosophy/PhilosopherScene";
import type { PhilosophyProjectSummary } from "@/components/Philosophy/PhilosophyProjectCard";

export function PhilosophyExperience({
  projectsBySlug,
}: {
  projectsBySlug: Record<string, PhilosophyProjectSummary>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("philosopher");

  const selected = useMemo(
    () => philosophers.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  const select = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("philosopher", id);
      router.push(`/projects/philosophy?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const close = useCallback(() => {
    router.push("/projects/philosophy", { scroll: false });
  }, [router]);

  return (
    <div className="bg-grain min-h-screen bg-[#0c0c0d] text-[#f3f1ea]">
      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-[#232325] bg-[#0c0c0d]/90 px-6 py-4 backdrop-blur-sm sm:px-10">
        <Link
          href="/projects"
          className="focus-ring inline-flex items-center gap-1.5 text-sm text-[#9a9a9d] hover:text-[#f3f1ea]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>
        <p className="font-mono text-xs tracking-[0.2em] text-[#7a7a7d] uppercase">
          2,500 Years of Answers
        </p>
      </div>

      <PhilosophyTimeline philosophers={philosophers} selectedId={selectedId} onSelect={select} />

      <PhilosopherScene
        philosopher={selected}
        project={selected?.projectSlug ? projectsBySlug[selected.projectSlug] : undefined}
        onClose={close}
      />
    </div>
  );
}
