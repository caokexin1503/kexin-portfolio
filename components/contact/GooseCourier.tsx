import { InkLandscape } from "@/components/contact/InkLandscape";
import { WildGoose } from "@/components/ink/WildGoose";

const SERIF_CJK = '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif';

// A loose skein trailing down-left behind the leader, smaller (further away)
// toward the back. `wing` poses each bird at a different point of its
// wingbeat so the flock doesn't look stamped out; `fade` is atmospheric
// perspective for the distant ones.
const FLOCK: { left: string; top: string; width: string; wing: number; fade: number; letter?: boolean }[] = [
  { left: "57%", top: "30vh", width: "min(230px, 34vw)", wing: 0, fade: 1, letter: true },
  { left: "43%", top: "38vh", width: "min(170px, 25vw)", wing: -22, fade: 0.92 },
  { left: "31%", top: "32vh", width: "min(135px, 20vw)", wing: 8, fade: 0.82 },
  { left: "21%", top: "40vh", width: "min(105px, 16vw)", wing: -12, fade: 0.7 },
  { left: "12%", top: "34vh", width: "min(80px, 12vw)", wing: -26, fade: 0.58 },
];

/**
 * 鸿雁传书 — a still ink painting behind the Contact page, combining a shan
 * shui landscape (misty peaks, waterfall, pavilion, water) with a skein of
 * white-fronted geese and wind-bent reeds in the bird-and-flower manner. The
 * lead goose carries a sealed letter. Fixed behind the content; no motion.
 */
export function GooseCourier() {
  return (
    <div
      aria-hidden
      className="ink-paper pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <InkLandscape />

      {FLOCK.map(({ left, top, width, wing, fade, letter }) => (
        <div
          key={left}
          className="absolute -translate-x-1/2 -rotate-6"
          style={{ left, top, width, opacity: fade }}
        >
          <WildGoose wing={wing} letter={letter} />
        </div>
      ))}

      {/* Vertical verse + seal, in the right margin on wide screens */}
      <div className="absolute top-[16%] right-[5%] hidden flex-row-reverse items-start gap-4 text-[var(--ink)] xl:flex">
        <p className="text-2xl tracking-[0.5em] opacity-80 [writing-mode:vertical-rl]" style={{ fontFamily: SERIF_CJK }}>
          云中谁寄锦书来
        </p>
        <p
          className="mt-14 text-base tracking-[0.5em] opacity-60 [writing-mode:vertical-rl]"
          style={{ fontFamily: SERIF_CJK }}
        >
          雁字回时　月满西楼
        </p>
        <div
          className="mt-[17rem] flex h-10 w-10 flex-col items-center justify-center rounded-[3px] text-xs leading-none opacity-90"
          style={{ fontFamily: SERIF_CJK, backgroundColor: "var(--seal)", color: "var(--paper)" }}
        >
          <span>鸿</span>
          <span className="mt-0.5">雁</span>
        </div>
      </div>
    </div>
  );
}
