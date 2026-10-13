import { useId } from "react";
import { mountain, type Peak } from "@/components/ink/mountain";
import { Reeds } from "@/components/ink/Reeds";

/**
 * Full-viewport shan shui (山水) backdrop for the Contact page: layered ink
 * peaks that fade into mist at their base, cloud bands between the layers,
 * water, a small pavilion, a waterfall, and wind-bent reeds in the foreground.
 * Entirely static.
 *
 * Colours come from the `.ink-paper` CSS variables (app/globals.css) so the
 * painting inverts sensibly in dark mode.
 */

// Peaks are kept to the sides in the mid/near layers so the centre of the
// page — where the goose hovers and the form sits — stays open sky.
const LAYERS: { base: number; opacity: number; peaks: Peak[] }[] = [
  {
    base: 570,
    opacity: 0.24,
    peaks: [
      [100, 220, 300],
      [300, 170, 360],
      [480, 230, 420],
      [690, 190, 240],
      [910, 210, 270],
      [1120, 250, 430],
      [1320, 190, 350],
      [1520, 230, 310],
    ],
  },
  {
    base: 730,
    opacity: 0.46,
    peaks: [
      [50, 290, 420],
      [260, 230, 300],
      [1310, 250, 330],
      [1530, 310, 440],
    ],
  },
  {
    base: 905,
    opacity: 0.8,
    peaks: [
      [70, 350, 300],
      [270, 210, 170],
      [1330, 210, 160],
      [1510, 350, 280],
    ],
  },
];

function CloudBand({ className, puffs }: { className: string; puffs: [number, number, number][] }) {
  return (
    <svg className={`absolute left-0 w-full ${className}`} viewBox="0 0 1600 300" preserveAspectRatio="none">
      <g fill="var(--mist)">
        {puffs.map(([cx, rx, ry]) => (
          <ellipse key={cx} cx={cx} cy={150} rx={rx} ry={ry} />
        ))}
      </g>
    </svg>
  );
}

export function InkLandscape() {
  const uid = useId();

  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {LAYERS.map((layer, i) => (
            <linearGradient key={i} id={`${uid}-ink-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ink)" stopOpacity={layer.opacity} />
              <stop offset="55%" stopColor="var(--ink)" stopOpacity={layer.opacity * 0.55} />
              <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
            </linearGradient>
          ))}
          <filter id={`${uid}-brush`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="9" />
          </filter>
        </defs>

        {LAYERS.map((layer, i) => (
          <g key={i} filter={`url(#${uid}-brush)`}>
            {layer.peaks.map((peak, j) => {
              const { d, texture } = mountain(peak, layer.base, (i + 1) * 97 + j * 13);
              return (
                <g key={peak[0]}>
                  <path d={d} fill={`url(#${uid}-ink-${i})`} />
                  <path
                    d={texture}
                    fill="none"
                    stroke="var(--ink)"
                    strokeOpacity={layer.opacity * 0.7}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>
        ))}

        {/* Waterfall on the right-hand mid peak */}
        <path
          d="M1318 420 C1316 480 1322 560 1318 690"
          stroke="var(--mist)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Pavilion on the near-left rock */}
        <g transform="translate(270 742)" fill="var(--ink)" opacity="0.85">
          <path d="M-22 -14 Q0 -30 22 -14 Q10 -16 0 -24 Q-10 -16 -22 -14 Z" />
          <rect x="-13" y="-14" width="2" height="14" />
          <rect x="11" y="-14" width="2" height="14" />
          <rect x="-15" y="-1" width="30" height="2" />
        </g>

        {/* Water ripples */}
        <g fill="none" stroke="var(--ink)" strokeOpacity="0.18" strokeLinecap="round">
          <path d="M560 846 Q620 840 680 846 T800 846" strokeWidth="1.2" />
          <path d="M760 866 Q820 860 880 866 T1000 866" strokeWidth="1" />
          <path d="M620 884 Q660 880 700 884" strokeWidth="0.8" />
        </g>
      </svg>

      {/* Cloud bands that hide each range's foot, the way mist separates the
          layers in a shan shui scroll. */}
      <CloudBand
        className="top-[4%] h-[16vh] opacity-70 blur-xl"
        puffs={[
          [260, 240, 45],
          [820, 300, 55],
          [1380, 220, 40],
        ]}
      />
      <CloudBand
        className="top-[48%] h-[24vh] opacity-95 blur-2xl"
        puffs={[
          [100, 280, 80],
          [480, 340, 90],
          [900, 260, 75],
          [1300, 360, 95],
        ]}
      />
      <CloudBand
        className="top-[64%] h-[24vh] opacity-95 blur-2xl"
        puffs={[
          [250, 320, 85],
          [700, 260, 70],
          [1150, 340, 90],
          [1520, 220, 65],
        ]}
      />
      <CloudBand
        className="top-[84%] h-[18vh] opacity-90 blur-xl"
        puffs={[
          [150, 300, 70],
          [640, 240, 60],
          [1100, 320, 75],
          [1480, 260, 60],
        ]}
      />

      {/* Foreground reeds, after the bird-and-flower painting */}
      <Reeds className="left-0 hidden h-[46vh] sm:block" />
      <Reeds className="right-[-4%] h-[30vh] opacity-80" />
    </>
  );
}
