import { useId } from "react";

// A single tapered feather (leaf shape) from base (bx, by) to tip (tx, ty).
function feather(bx: number, by: number, tx: number, ty: number, width: number) {
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * width;
  const ny = (dx / len) * width;
  const at = (t: number) => [bx + dx * t, by + dy * t];
  const [ax, ay] = at(0.35);
  const [cx, cy] = at(0.78);
  const f = (n: number) => Math.round(n * 10) / 10;
  return (
    `M${bx} ${by} C${f(ax + nx * 0.6)} ${f(ay + ny * 0.6)} ${f(cx + nx * 0.5)} ${f(cy + ny * 0.5)} ${tx} ${ty} ` +
    `C${f(cx - nx * 0.4)} ${f(cy - ny * 0.4)} ${f(ax - nx * 0.5)} ${f(ay - ny * 0.5)} ${bx} ${by} Z`
  );
}

// [baseX, baseY, tipX, tipY] — fanned up and back like the reference painting.
const NEAR_PRIMARIES: [number, number, number, number][] = [
  [104, 58, 44, -4],
  [100, 62, 32, 6],
  [97, 66, 24, 18],
  [94, 70, 20, 32],
  [92, 74, 24, 46],
];
const SECONDARIES: [number, number, number, number][] = [
  [124, 90, 70, 58],
  [130, 92, 80, 70],
  [136, 93, 92, 80],
  [142, 94, 106, 88],
];
const FAR_PRIMARIES: [number, number, number, number][] = [
  [150, 58, 138, 2],
  [153, 56, 150, -4],
  [156, 56, 162, -1],
  [158, 58, 172, 6],
];

/**
 * A greater white-fronted goose (白额雁) in flight, painted in the
 * gongbi-meets-xieyi manner of traditional bird paintings: dark layered wing
 * feathers with pale edges, a barred grey-brown body, white face patch, and
 * orange beak and feet. `wing` rotates both wings about the shoulder (degrees,
 * negative = downstroke); the leader carries a sealed letter in its beak.
 */
export function WildGoose({ wing = 0, letter = false }: { wing?: number; letter?: boolean }) {
  const uid = useId();
  const g = (name: string) => `${uid}-${name}`;

  return (
    <svg viewBox="20 0 250 150" className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id={g("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3c31" />
          <stop offset="55%" stopColor="#7d6c5d" />
          <stop offset="100%" stopColor="#d9cfc2" />
        </linearGradient>
        <linearGradient id={g("covert")} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8a7663" />
          <stop offset="100%" stopColor="#5a4a3d" />
        </linearGradient>
        <linearGradient id={g("primary")} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2a221c" />
          <stop offset="100%" stopColor="#120e0b" />
        </linearGradient>
        <linearGradient id={g("beak")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f08a4b" />
          <stop offset="100%" stopColor="#d9612c" />
        </linearGradient>
        <filter id={g("brush")} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
      </defs>

      <g filter={`url(#${g("brush")})`}>
        {/* Far wing — raised behind the body */}
        <g style={{ transformBox: "view-box", transformOrigin: "152px 88px", transform: `rotate(${wing * 0.7}deg)` }}>
          <path d="M144 90 C138 72 142 58 150 48 C160 54 164 72 162 90 Z" fill="#3a2f27" />
          {FAR_PRIMARIES.map(([bx, by, tx, ty], i) => (
            <path key={i} d={feather(bx, by, tx, ty, 9)} fill="#17120e" />
          ))}
        </g>

        {/* Feet — tucked back under the tail */}
        <path
          d="M92 112 C84 116 74 119 64 120 L54 125 L64 124 L57 130 L68 125 L74 122 C82 121 90 118 96 115 Z"
          fill="#e0662f"
        />
        <path
          d="M100 114 C94 119 86 123 78 126 L70 132 L80 129 L76 135 L85 129 C92 126 98 121 104 117 Z"
          fill="#c95625"
        />

        {/* Tail — dark feathers over white undertail coverts */}
        <path d="M66 100 C58 104 50 109 44 114 C56 115 68 111 78 108 Z" fill="#f2ede4" />
        <path d="M68 99 L44 94 L50 101 L42 104 L70 104 Z" fill="#2e251f" />

        {/* Body */}
        <path
          d="M62 101 C78 87 120 81 160 85 C176 87 186 91 194 95 C186 108 160 117 128 118 C100 119 76 113 62 101 Z"
          fill={`url(#${g("body")})`}
        />
        {/* Belly bars */}
        <g stroke="#2c241e" strokeWidth="2.2" strokeLinecap="round" opacity="0.75">
          <path d="M130 110 L138 112" />
          <path d="M142 108 L150 110" />
          <path d="M136 114 L142 115" />
          <path d="M152 105 L158 107" />
        </g>

        {/* Neck + head */}
        <path d="M184 93 C198 86 210 80 222 76 C224 84 214 94 194 101 Z" fill="#43362c" />
        <ellipse cx="226" cy="76.5" rx="9.5" ry="7" fill="#3a2e26" />
        {/* White front (the "white-fronted" patch) */}
        <path d="M231 71 C236 72 237 78 234 82 C232 79 231 75 231 71 Z" fill="#f4efe6" />
        <circle cx="228" cy="74.5" r="1.3" fill="#120e0b" />
        {/* Beak */}
        <path d="M233 74 C240 74.5 246 76 251 78 C246 80 240 81.5 233 82 Z" fill={`url(#${g("beak")})`} />
        <path d="M235 78 L249 78.2" stroke="#9e4220" strokeWidth="0.6" opacity="0.6" />

        {/* Letter held in the beak */}
        {letter && (
          <g transform="translate(244 76) rotate(14)">
            <rect x="0" y="0" width="26" height="17" rx="1" fill="#fbf6ea" stroke="#3a2e26" strokeWidth="0.9" />
            <path d="M0.8 0.8 L13 9.5 L25.2 0.8" fill="none" stroke="#3a2e26" strokeWidth="0.8" />
            <circle cx="13" cy="10" r="2.8" fill="#b5302a" />
          </g>
        )}

        {/* Near wing — fanned primaries, pale-tipped secondaries, scalloped coverts */}
        <g style={{ transformBox: "view-box", transformOrigin: "128px 90px", transform: `rotate(${wing}deg)` }}>
          {NEAR_PRIMARIES.map(([bx, by, tx, ty], i) => (
            <g key={i}>
              <path d={feather(bx, by, tx, ty, 12)} fill={`url(#${g("primary")})`} />
              <path d={`M${bx} ${by} L${tx} ${ty}`} stroke="#5c4d40" strokeWidth="0.6" opacity="0.7" />
            </g>
          ))}
          {SECONDARIES.map(([bx, by, tx, ty], i) => (
            <path
              key={i}
              d={feather(bx, by, tx, ty, 9)}
              fill="#2b221b"
              stroke="#d8ccbc"
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />
          ))}
          {/* Coverts */}
          <path
            d="M148 90 C140 72 124 58 104 48 C100 62 106 76 118 86 C126 92 138 94 148 90 Z"
            fill={`url(#${g("covert")})`}
          />
          <g fill="none" stroke="#e6dccd" strokeWidth="1.1" strokeLinecap="round" opacity="0.85">
            <path d="M108 54 Q113 59 118 57" />
            <path d="M115 62 Q120 67 125 65" />
            <path d="M122 70 Q127 75 132 73" />
            <path d="M129 78 Q134 83 139 81" />
            <path d="M107 66 Q111 72 117 71" />
            <path d="M115 76 Q119 82 125 81" />
          </g>
        </g>
      </g>
    </svg>
  );
}
