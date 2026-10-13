"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { mountain } from "@/components/ink/mountain";
import {
  AboutScene,
  ContactScene,
  ExperienceScene,
  IntroScene,
  ProjectsScene,
  type InkScrollData,
} from "@/components/home/InkScenes";

const SERIF_CJK = '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif';

// The journey, in order. Each chapter gets one viewport of scrolling.
const CHAPTERS = [
  { cjk: "始", label: "Kexin" },
  { cjk: "作", label: "Projects" },
  { cjk: "历", label: "Experience" },
  { cjk: "述", label: "About" },
  { cjk: "书", label: "Contact" },
] as const;
const N = CHAPTERS.length;
const STEP = 1 / (N - 1);

/**
 * 山水行旅长卷 — the home page opens as a handscroll. A sticky stage holds
 * one chapter at a time; scrolling cross-fades to the next while an ink line
 * on the left fills in like a brush stroke, marking where you are. After the
 * last chapter the page continues normally (Featured Projects, etc.).
 */
export function InkScroll(data: InkScrollData) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (N - 1))));

  const goTo = (index: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * index * STEP, behavior: "smooth" });
  };

  const scenes: ReactNode[] = [
    <IntroScene key="intro" {...data} />,
    <ProjectsScene key="projects" projects={data.projects} />,
    <ExperienceScene key="experience" experiences={data.experiences} />,
    <AboutScene key="about" bio={data.bio} education={data.education} />,
    <ContactScene key="contact" email={data.email} />,
  ];

  return (
    <section ref={ref} aria-label="Introduction" className="ink-paper relative" style={{ height: `${N * 100}svh` }}>
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <DistantRange />
        {scenes.map((scene, i) => (
          <Chapter key={i} index={i} progress={scrollYProgress}>
            {scene}
          </Chapter>
        ))}
        <InkLine progress={scrollYProgress} active={active} onSelect={goTo} />
      </div>
    </section>
  );
}

// Piecewise-linear interpolation, clamped at both ends.
function interpolate(v: number, input: number[], output: number[]) {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + t * (output[i] - output[i - 1]);
    }
  }
  return output[output.length - 1];
}

/**
 * One chapter: fades/drifts in as its turn approaches and out as it passes.
 * Uses function transforms on purpose — framer's array form can hand opacity
 * to a native scroll timeline, which drifted out of sync with this sticky
 * layout.
 */
function Chapter({ index, progress, children }: { index: number; progress: MotionValue<number>; children: ReactNode }) {
  const c = index * STEP;
  // Each chapter holds fully visible for the middle ~60% of its scroll, and
  // the hand-off windows of neighbours overlap (cross-fade), so there is
  // never a stretch where the stage is blank.
  const [inStart, inEnd, outStart, outEnd] = [c - 0.6 * STEP, c - 0.3 * STEP, c + 0.3 * STEP, c + 0.6 * STEP];
  const first = index === 0;
  const last = index === N - 1;

  const opacity = useTransform(progress, (v) =>
    first
      ? interpolate(v, [outStart, outEnd], [1, 0])
      : last
        ? interpolate(v, [inStart, inEnd], [0, 1])
        : interpolate(v, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]),
  );
  const y = useTransform(progress, (v) =>
    first
      ? interpolate(v, [outStart, outEnd], [0, -40])
      : last
        ? interpolate(v, [inStart, inEnd], [40, 0])
        : interpolate(v, [inStart, inEnd, outStart, outEnd], [40, 0, 0, -40]),
  );
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <motion.div className="absolute inset-0" style={{ opacity, y, pointerEvents }}>
      {children}
    </motion.div>
  );
}

/** The brush line on the left: a faint track, an ink fill that follows the scroll, and chapter marks. */
function InkLine({
  progress,
  active,
  onSelect,
}: {
  progress: MotionValue<number>;
  active: number;
  onSelect: (index: number) => void;
}) {
  const tip = useTransform(progress, (v) => `${v * 100}%`);
  const fill = useTransform(progress, (v) => v);

  return (
    <nav aria-label="Chapters" className="absolute top-[10%] bottom-[10%] left-5 z-10 sm:left-10">
      <div className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-[var(--ink)] opacity-15" />
      <motion.div
        className="absolute top-0 left-0 h-full w-[3px] origin-top -translate-x-1/2 rounded-full bg-[var(--ink)] opacity-80"
        style={{ scaleY: fill }}
      />
      {/* Ink pooling at the brush tip */}
      <motion.div
        className="absolute left-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ink)] opacity-80 blur-[1px]"
        style={{ top: tip }}
      />

      {CHAPTERS.map((chapter, i) => {
        const isActive = i === active;
        return (
          <button
            key={chapter.cjk}
            type="button"
            onClick={() => onSelect(i)}
            aria-current={isActive ? "step" : undefined}
            className="focus-ring group absolute left-0 flex -translate-y-1/2 items-center gap-3 rounded-sm"
            style={{ top: `${i * STEP * 100}%` }}
          >
            <span
              className={`h-2.5 w-2.5 -translate-x-1/2 rounded-full border transition-colors ${
                isActive ? "border-[var(--seal)] bg-[var(--seal)]" : "border-[var(--ink)]/40 bg-[var(--paper)]"
              }`}
            />
            <span
              className={`-ml-2 hidden font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity sm:inline ${
                isActive ? "text-[var(--seal)] opacity-100" : "text-[var(--ink)] opacity-45 group-hover:opacity-80"
              }`}
            >
              {chapter.label}
            </span>
            <span
              className={`hidden text-[11px] transition-opacity lg:inline ${
                isActive ? "text-[var(--ink)] opacity-60" : "text-[var(--ink)] opacity-0 group-hover:opacity-50"
              }`}
              style={{ fontFamily: SERIF_CJK }}
            >
              {chapter.cjk}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** A faint far range + mist that stays put across chapters, so the scroll reads as one painting. */
function DistantRange() {
  const peaks: [number, number, number][] = [
    [80, 260, 150],
    [300, 220, 210],
    [520, 300, 170],
    [780, 240, 230],
    [1020, 280, 160],
    [1250, 240, 220],
    [1480, 280, 180],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ink-far-range" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {peaks.map((peak, i) => (
          <path key={peak[0]} d={mountain(peak, 300, 400 + i * 11).d} fill="url(#ink-far-range)" />
        ))}
      </svg>
      {/* Fade into the page background so the scroll hands off cleanly to the sections below */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
