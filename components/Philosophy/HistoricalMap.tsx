"use client";

import { motion } from "framer-motion";
import type { Era, MapRegion } from "@/data/philosophers";
import { REGION_COORDS, ERA_TINT } from "@/lib/philosophy-visuals";

/**
 * A deliberately non-literal "map" — a soft coastline silhouette shared by
 * every region, with a labeled pin placed at an approximate position and an
 * era-appropriate color wash. This avoids depending on any map tile service
 * (offline-safe, no rate limits, no loading jank) while still giving each
 * philosopher a sense of place. See lib/philosophy-visuals.ts for the
 * coordinate/color presets.
 */
export function HistoricalMap({
  region,
  era,
  location,
}: {
  region: MapRegion;
  era: Era;
  location: string;
}) {
  const coords = REGION_COORDS[region];
  const tint = ERA_TINT[era];

  return (
    <div
      className="absolute inset-0 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: tint.wash }}
    >
      {/* Abstract coastline / contour texture — not a real map, just a sense of terrain */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        aria-hidden
      >
        <path
          d="M -10 55 Q 20 40 35 52 T 70 48 Q 85 45 110 60 L 110 110 L -10 110 Z"
          fill="none"
          stroke={tint.accent}
          strokeWidth="0.4"
        />
        <path
          d="M -10 70 Q 25 60 45 68 T 90 62 Q 100 60 110 68"
          fill="none"
          stroke={tint.accent}
          strokeWidth="0.3"
          opacity="0.7"
        />
        <path
          d="M -10 40 Q 30 30 50 38 T 110 34"
          fill="none"
          stroke={tint.accent}
          strokeWidth="0.25"
          opacity="0.5"
        />
      </svg>

      {/* Pin + label */}
      <motion.div
        key={region}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
      >
        <span
          className="mb-2 h-2.5 w-2.5 rounded-full ring-4"
          style={{
            backgroundColor: tint.accent,
            boxShadow: `0 0 0 4px ${tint.accent}22`,
          }}
        />
        <span
          className="font-mono text-[11px] tracking-wide whitespace-nowrap uppercase"
          style={{ color: tint.accent }}
        >
          {location}
        </span>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/40" />
    </div>
  );
}
