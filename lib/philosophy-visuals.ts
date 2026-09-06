import type { Era, MapRegion } from "@/data/philosophers";

// Approximate on-canvas position (percentages) for each region's pin on the
// stylized HistoricalMap backdrop. Not cartographically precise — the goal is
// a sense of place, not a real map. See components/Philosophy/HistoricalMap.tsx.
export const REGION_COORDS: Record<MapRegion, { x: number; y: number }> = {
  greece: { x: 56, y: 62 },
  italy: { x: 54, y: 56 },
  france: { x: 40, y: 40 },
  germany: { x: 50, y: 28 },
  denmark: { x: 47, y: 14 },
  austria: { x: 55, y: 33 },
};

// A muted, non-gradient color wash per era so the backdrop reads as "a
// different time" without needing a distinct map illustration per region.
export const ERA_TINT: Record<Era, { wash: string; accent: string }> = {
  Ancient: { wash: "#3a2f1f", accent: "#c9a768" },
  Medieval: { wash: "#2b2e33", accent: "#9aa3ad" },
  "Early Modern": { wash: "#1f2733", accent: "#7c93b8" },
  "Existential / Modern": { wash: "#15171c", accent: "#5b9bff" },
};
