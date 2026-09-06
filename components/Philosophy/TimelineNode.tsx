"use client";

import { motion } from "framer-motion";
import type { Philosopher } from "@/data/philosophers";
import { ERA_TINT } from "@/lib/philosophy-visuals";
import { formatPhilosopherYear } from "@/lib/philosophy-format";

export function TimelineNode({
  philosopher,
  active,
  onSelect,
}: {
  philosopher: Philosopher;
  active: boolean;
  onSelect: () => void;
}) {
  const tint = ERA_TINT[philosopher.era];

  // Most of the timeline is historical scaffolding — only philosophers with a
  // real project connection are explorable. The rest render as plain,
  // non-interactive markers (no hover state, no cursor pointer, no click).
  if (!philosopher.clickable) {
    return (
      <div className="relative flex items-center gap-5 py-3 text-left">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
          <span className="block h-1.5 w-1.5 rounded-full bg-[#4a4a4d]" />
        </span>
        <span className="flex flex-1 items-baseline justify-between gap-4 border-b border-[#202022] pb-3">
          <span className="font-serif-display text-xl text-[#6f6f72] sm:text-2xl">
            {philosopher.name}
          </span>
          <span className="font-mono text-xs text-[#5a5a5d] sm:text-sm">
            {formatPhilosopherYear(philosopher.birth)}
          </span>
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="focus-ring group relative flex items-center gap-5 py-3 text-left"
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <motion.span
          initial={false}
          animate={{ scale: active ? 1.6 : 1 }}
          whileHover={{ scale: 1.6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: active ? tint.accent : "#8a8a8a" }}
        />
      </span>

      <span className="flex flex-1 items-baseline justify-between gap-4 border-b border-[#2a2a2c] pb-3 transition-colors group-hover:border-[#4a4a4d]">
        <span
          className="font-serif-display text-xl transition-colors sm:text-2xl"
          style={{ color: active ? "#f3f1ea" : "#c9c7bf" }}
        >
          {philosopher.name}
        </span>
        <span className="font-mono text-xs text-[#7a7a7d] sm:text-sm">
          {formatPhilosopherYear(philosopher.birth)}
        </span>
      </span>
    </button>
  );
}
