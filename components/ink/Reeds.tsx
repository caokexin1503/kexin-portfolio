// Wind-bent reeds in the bird-and-flower (花鸟) manner. Colours come from the
// --ink / --reed variables set by `.ink-paper` (app/globals.css).

const f1 = (n: number) => Math.round(n * 10) / 10;

// A long reed leaf: tapered blade from (bx, by) to (tx, ty), bowed by `bend`.
function blade(bx: number, by: number, tx: number, ty: number, width: number, bend: number) {
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (bx + tx) / 2 + nx * bend;
  const my = (by + ty) / 2 + ny * bend;
  return `M${bx} ${by} Q${f1(mx + nx * width)} ${f1(my + ny * width)} ${tx} ${ty} Q${f1(mx - nx * width * 0.25)} ${f1(my - ny * width * 0.25)} ${bx} ${by} Z`;
}

// [baseX, topX, topY] in a 400×500 box; every stalk leans right, with the wind.
const STALKS: [number, number, number][] = [
  [40, 150, 90],
  [82, 232, 60],
  [118, 292, 142],
  [28, 92, 172],
  [158, 338, 214],
  [62, 200, 232],
];

export function Reeds({ className }: { className: string }) {
  return (
    <svg className={`absolute bottom-0 ${className}`} viewBox="0 0 400 500" preserveAspectRatio="xMinYMax meet">
      {STALKS.map(([bx, tx, ty], i) => {
        const at = (t: number) => [f1(bx + (tx - bx) * t * t), f1(500 + (ty - 500) * t)] as const;
        const [l1x, l1y] = at(0.45);
        const [l2x, l2y] = at(0.7);
        return (
          <g key={bx}>
            {/* Stalk */}
            <path
              d={`M${bx} 500 Q${f1(bx + (tx - bx) * 0.15)} ${f1((500 + ty) / 2)} ${tx} ${ty}`}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity="0.65"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Leaves — ochre, a couple in ink for depth */}
            <path
              d={blade(l1x, l1y, f1(l1x + 130 + i * 8), f1(l1y + 70 - i * 6), 7, -22)}
              fill={i % 3 === 1 ? "var(--ink)" : "var(--reed)"}
              opacity={i % 3 === 1 ? 0.55 : 0.85}
            />
            {i % 2 === 0 && (
              <path d={blade(l2x, l2y, f1(l2x + 110), f1(l2y + 90), 6, -16)} fill="var(--reed)" opacity="0.75" />
            )}
            {/* Seed plume — a drooping tuft of dry-brush strokes */}
            <g fill="none" stroke="var(--ink)" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round">
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <path
                  key={k}
                  d={`M${tx} ${ty} Q${f1(tx + 10 + k * 3)} ${f1(ty - 4 + k * 3)} ${f1(tx + 16 + k * 5)} ${f1(ty + 8 + k * 7)}`}
                />
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
