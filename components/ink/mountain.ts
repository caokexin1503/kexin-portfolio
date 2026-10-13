// Shared shan shui (山水) mountain generator — used by the Contact backdrop
// and the home page scroll. Deterministic, so server and client paint the
// same ridges.

export type Peak = [x: number, width: number, height: number];

// Small seeded PRNG so every render paints the same mountains.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Summit = { c: number; a: number; s: number };

// Round coordinates so server and browser produce byte-identical paths
// (Math.exp/pow may differ in the last digits between JS engines).
export const r1 = (n: number) => Math.round(n * 10) / 10;

// Each mountain is a cluster of 1–3 rounded spires (gaussian bumps, taking the
// max so each keeps its own silhouette) with a little jitter on the ridge —
// closer to the clustered rock pillars of shan shui painting than a cone.
export function mountain([x, w, h]: Peak, base: number, seed: number) {
  const rand = seeded(seed);
  const summits: Summit[] = [{ c: 0.38 + rand() * 0.24, a: 1, s: 0.12 + rand() * 0.07 }];
  const extra = Math.floor(rand() * 3);
  for (let i = 0; i < extra; i++) {
    summits.push({ c: 0.12 + rand() * 0.76, a: 0.42 + rand() * 0.38, s: 0.08 + rand() * 0.1 });
  }

  const left = x - w / 2;
  const n = 30;
  const points: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const v = Math.max(...summits.map(({ c, a, s }) => a * Math.exp(-(((t - c) / s) ** 2))));
    const edge = Math.sin(Math.PI * t) ** 0.6;
    const jitter = 1 + (rand() - 0.5) * 0.08;
    points.push([r1(left + t * w), r1(base - h * Math.min(1, v * jitter + 0.06) * edge)]);
  }

  // Catmull-Rom → cubic Bézier for a soft brush edge.
  let d = `M${left} ${base} L${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  d += ` L${left + w} ${base} Z`;

  // Dry-brush texture strokes (皴) running down from each summit.
  const texture = summits
    .map(({ c, a, s }) => {
      const sx = r1(left + c * w);
      const sy = r1(base - h * a + 10);
      const len = r1(h * a * 0.55);
      const spread = r1(s * w);
      return [
        `M${sx - spread * 0.1} ${sy} C${sx - spread * 0.3} ${sy + len * 0.4} ${sx - spread * 0.5} ${sy + len * 0.7} ${sx - spread * 0.8} ${sy + len}`,
        `M${sx + spread * 0.15} ${sy + 6} C${sx + spread * 0.1} ${sy + len * 0.4} ${sx} ${sy + len * 0.6} ${sx - spread * 0.1} ${sy + len * 0.85}`,
        `M${sx + spread * 0.45} ${sy + len * 0.15} C${sx + spread * 0.55} ${sy + len * 0.4} ${sx + spread * 0.7} ${sy + len * 0.6} ${sx + spread * 0.9} ${sy + len * 0.9}`,
      ].join(" ");
    })
    .join(" ");

  return { d, texture };
}
