"use client";

import { motion } from "framer-motion";
import type { Philosopher, Era } from "@/data/philosophers";
import { TimelineNode } from "@/components/Philosophy/TimelineNode";

const ERA_ORDER: Era[] = ["Ancient", "Medieval", "Early Modern", "Existential / Modern"];

export function PhilosophyTimeline({
  philosophers,
  selectedId,
  onSelect,
}: {
  philosophers: Philosopher[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const grouped = ERA_ORDER.map((era) => ({
    era,
    items: philosophers.filter((p) => p.era === era),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 sm:py-32">
      {grouped.map((group) => (
        <div key={group.era} className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="mb-4 font-mono text-[11px] tracking-[0.25em] text-[#7a7a7d] uppercase"
          >
            {group.era}
          </motion.p>
          <div>
            {group.items.map((philosopher) => (
              <TimelineNode
                key={philosopher.id}
                philosopher={philosopher}
                active={selectedId === philosopher.id}
                onSelect={() => onSelect(philosopher.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="mt-20 flex flex-col items-center border-t border-[#2a2a2c] pt-16 text-center"
      >
        <span className="mb-4 h-2.5 w-2.5 rounded-full bg-[#5b9bff]" />
        <p className="font-mono text-xs tracking-[0.25em] text-[#7a7a7d] uppercase">2026</p>
        <p className="font-serif-display mt-2 text-3xl text-[#f3f1ea] sm:text-4xl">You</p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#9a9a9d]">
          After 2,500 years of answers, the question is still yours.
        </p>
        <p className="mt-4 font-mono text-xs tracking-[0.2em] text-[#5b9bff] uppercase">
          What is your answer?
        </p>
      </motion.div>
    </div>
  );
}
