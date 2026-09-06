"use client";

import { XIcon, ArrowDownIcon } from "lucide-react";
import type { Philosopher } from "@/data/philosophers";
import { formatPhilosopherLifespan } from "@/lib/philosophy-format";
import { cn } from "@/lib/utils";
import { PhilosophyProjectCard, type PhilosophyProjectSummary } from "@/components/Philosophy/PhilosophyProjectCard";

export function PhilosopherPanel({
  philosopher,
  project,
  open,
  onClose,
}: {
  philosopher: Philosopher;
  project?: PhilosophyProjectSummary;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={philosopher.fullName}
      className={cn(
        "fixed z-10 flex flex-col overflow-y-auto border-white/10 bg-black/75 text-white backdrop-blur-2xl transition-transform duration-500 ease-out",
        "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t",
        open ? "translate-y-0" : "translate-y-full",
        "sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto sm:h-full sm:max-h-none sm:w-full sm:max-w-md sm:translate-y-0 sm:rounded-none sm:border-t-0 sm:border-l",
        open ? "sm:translate-x-0" : "sm:translate-x-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
        <span className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
          {philosopher.era}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-ring rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 px-6 py-8 sm:px-8 sm:py-10">
        <h2 className="font-serif-display text-3xl leading-tight sm:text-4xl">
          {philosopher.fullName}
        </h2>
        <p className="mt-2 font-mono text-sm text-white/50">
          {formatPhilosopherLifespan(philosopher.birth, philosopher.death)}
        </p>

        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
            Core Question
          </p>
          <p className="font-serif-display mt-3 text-xl leading-snug italic sm:text-2xl">
            &ldquo;{philosopher.coreQuestion}&rdquo;
          </p>
        </div>

        <div className="my-6 flex justify-center text-white/25">
          <ArrowDownIcon className="h-4 w-4" />
        </div>

        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
            My Interpretation
          </p>
          <p className="mt-3 text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
            {philosopher.keyIdea}
          </p>
          <p className="mt-3 leading-relaxed text-white/80">{philosopher.interpretation}</p>
        </div>

        {project && (
          <>
            <div className="my-6 flex justify-center text-white/25">
              <ArrowDownIcon className="h-4 w-4" />
            </div>
            <PhilosophyProjectCard project={project} />
          </>
        )}
      </div>
    </div>
  );
}
