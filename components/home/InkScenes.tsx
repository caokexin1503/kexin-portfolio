import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { mountain, r1, type Peak } from "@/components/ink/mountain";
import { Reeds } from "@/components/ink/Reeds";
import { WildGoose } from "@/components/ink/WildGoose";
import { categoryLabel } from "@/lib/utils";

const SERIF_CJK = '"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif';

export type InkScrollData = {
  name: string;
  headline: string;
  bio: string;
  email: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  education: { institution: string; degree: string } | null;
  projects: { slug: string; title: string; category: string }[];
  experiences: { id: string; company: string; position: string; dates: string }[];
};

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

const sealButton =
  "focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[var(--seal)] px-5 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90";
const outlineButton =
  "focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-[var(--ink)]/25 px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--ink)]/5";

/** Two-column chapter layout: text on the left (clear of the ink line), painting on the right. */
function ChapterLayout({
  cjk,
  label,
  title,
  zh,
  children,
  art,
}: {
  cjk: string;
  label: string;
  title: string; // English, set large
  zh: string; // the Chinese source, set small beneath it
  children: ReactNode;
  art: ReactNode;
}) {
  return (
    <div className="mx-auto grid h-full max-w-6xl grid-cols-1 content-center gap-6 py-8 pr-5 pl-14 sm:pr-8 sm:pl-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-12 lg:pl-48">
      <div className="text-[var(--ink)]">
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase opacity-60">
          <span className="text-[var(--seal)]" style={{ fontFamily: SERIF_CJK }}>
            {cjk}
          </span>{" "}
          · {label}
        </p>
        <h2 className="font-serif-display mt-3 text-4xl leading-[1.1] tracking-tight sm:text-5xl">{title}</h2>
        <p className="mt-3 text-sm tracking-[0.3em] opacity-60" style={{ fontFamily: SERIF_CJK }}>
          {zh}
        </p>
        <div className="mt-5 space-y-5 text-sm leading-relaxed sm:text-base">{children}</div>
      </div>
      <div className="relative mx-auto aspect-[3/2] max-h-[38svh] w-full max-w-[640px] [mask-image:linear-gradient(to_bottom,black_75%,transparent)] lg:max-h-none">
        {art}
      </div>
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring group inline-flex items-center gap-1.5 font-medium text-[var(--ink)] underline decoration-[var(--seal)] decoration-2 underline-offset-4"
    >
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Inked mountains inside a 600×400 painting box, fading into mist at their foot. */
function Range({ id, peaks, base, opacity, seed }: { id: string; peaks: Peak[]; base: number; opacity: number; seed: number }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ink)" stopOpacity={opacity} />
          <stop offset="60%" stopColor="var(--ink)" stopOpacity={opacity * 0.5} />
          <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {peaks.map((peak, i) => {
        const { d, texture } = mountain(peak, base, seed + i * 7);
        return (
          <g key={peak[0]}>
            <path d={d} fill={`url(#${id})`} />
            <path
              d={texture}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity={opacity * 0.7}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </>
  );
}

function Mist({ y, opacity = 0.9 }: { y: number; opacity?: number }) {
  // Painted in the paper's own tone (not pure white) so it reads as haze, not a band.
  return <ellipse cx="300" cy={y} rx="250" ry="30" fill="var(--wash)" opacity={opacity} filter="url(#ink-soft)" />;
}

function SoftFilter() {
  return (
    <defs>
      <filter id="ink-soft" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  );
}

// ---------------------------------------------------------------------------
// 始 · Intro — modelled on the Chainsilience landing: badge, name, a central
// visual (a moon instead of a globe), one line, two actions.
// ---------------------------------------------------------------------------

export function IntroScene({ name, headline, bio, githubUrl, linkedinUrl, education }: InkScrollData) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-14 text-center text-[var(--ink)] sm:px-24">
      <p className="inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/20 bg-[var(--wash)]/70 px-3 py-1 text-xs backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--seal)]" />
        {education ? `${education.institution} · Computer Science` : "Computer Science"}
      </p>

      <h1 className="font-serif-display mt-5 text-5xl tracking-tight sm:text-7xl">{name}</h1>

      <MoonVista />

      <p className="text-base font-medium sm:text-lg">{headline}</p>
      <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed opacity-70">{bio}</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/projects" className={sealButton}>
          View Projects
        </Link>
        <Link href="/contact" className={outlineButton}>
          Get in Touch
        </Link>
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${outlineButton} px-3`}>
            <GithubIcon className="h-4 w-4" />
          </a>
        )}
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${outlineButton} px-3`}>
            <LinkedinIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      <p className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">
        <span style={{ fontFamily: SERIF_CJK }} className="text-xs tracking-[0.4em]">
          展卷
        </span>
        Scroll
        <ArrowDownIcon className="h-3 w-3" />
      </p>
    </div>
  );
}

/** The moon over misty peaks, with a skein of geese crossing it. */
function MoonVista() {
  return (
    <div
      aria-hidden
      className="relative my-5 aspect-[5/2] w-[min(560px,80vw)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 240">
        <SoftFilter />
        <circle cx="300" cy="118" r="92" fill="#f2e3bd" opacity="0.18" filter="url(#ink-soft)" />
        <circle cx="300" cy="118" r="78" fill="#f4e7c6" opacity="0.85" />
        <Range
          id="moon-range"
          base={240}
          opacity={0.55}
          seed={210}
          peaks={[
            [70, 160, 120],
            [190, 150, 150],
            [330, 170, 110],
            [450, 160, 160],
            [560, 150, 100],
          ]}
        />
      </svg>
      {[
        { left: "62%", top: "18%", width: "13%", wing: 0, letter: true },
        { left: "50%", top: "30%", width: "10%", wing: -20 },
        { left: "40%", top: "21%", width: "8%", wing: 10 },
      ].map(({ left, top, width, wing, letter }) => (
        <div key={left} className="absolute -translate-x-1/2 -rotate-6" style={{ left, top, width }}>
          <WildGoose wing={wing} letter={letter} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 作 · Projects — 积土成山: each featured project is a peak.
// ---------------------------------------------------------------------------

const PROJECT_PEAKS: Peak[] = [
  [110, 170, 230],
  [250, 190, 300],
  [400, 180, 260],
  [525, 150, 200],
];

export function ProjectsScene({ projects }: { projects: InkScrollData["projects"] }) {
  const shown = projects.slice(0, PROJECT_PEAKS.length);
  return (
    <ChapterLayout
      cjk="作"
      label="Projects"
      title="Earth, Piled into Mountains"
      zh="积土成山"
      art={
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400">
            <SoftFilter />
            <Range
              id="proj-far"
              base={330}
              opacity={0.2}
              seed={300}
              peaks={[
                [60, 160, 180],
                [330, 200, 220],
                [570, 150, 170],
              ]}
            />
            <Range id="proj-near" base={390} opacity={0.62} seed={330} peaks={PROJECT_PEAKS.slice(0, Math.max(shown.length, 1))} />
          </svg>
          {shown.map((project, i) => {
            const [x, , h] = PROJECT_PEAKS[i];
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="focus-ring group absolute flex -translate-x-1/2 flex-col items-center text-center"
                style={{ left: `${(x / 600) * 100}%`, bottom: `${((400 - 390 + h) / 400) * 100}%` }}
              >
                <span className="mb-1 line-clamp-2 max-w-[8.5rem] rounded-sm bg-[var(--wash)]/80 px-1.5 py-0.5 text-[11px] leading-tight font-medium text-[var(--ink)] backdrop-blur-sm group-hover:text-[var(--seal)] sm:text-xs">
                  {project.title}
                </span>
                <span className="font-mono text-[9px] tracking-wider text-[var(--ink)] uppercase opacity-50">
                  {categoryLabel(project.category)}
                </span>
                <span className="mt-1 h-5 w-px bg-[var(--ink)] opacity-40" />
              </Link>
            );
          })}
        </>
      }
    >
      <p className="opacity-75">
        Every project is one handful of earth — a model tuned, an agent shipped, a platform built with a team.
        These are the peaks so far.
      </p>
      <TextLink href="/projects">View all projects</TextLink>
    </ChapterLayout>
  );
}

// ---------------------------------------------------------------------------
// 历 · Experience — 千里之行: a mountain road with post stations.
// ---------------------------------------------------------------------------

// Path waypoints (600×400 box), climbing from bottom-left to top-right.
const ROAD: [number, number][] = [
  [30, 395],
  [150, 330],
  [210, 300],
  [330, 260],
  [380, 210],
  [470, 150],
  [520, 95],
  [585, 40],
];
// Indices into ROAD where stations sit, earliest role first.
const STATION_POINTS = [2, 4, 6];

function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function ExperienceScene({ experiences }: { experiences: InkScrollData["experiences"] }) {
  // Earliest role at the foot of the road, most recent at the top.
  const stations = experiences.slice(0, STATION_POINTS.length).reverse();
  return (
    <ChapterLayout
      cjk="历"
      label="Experience"
      title="A Journey of a Thousand Li"
      zh="千里之行 · 始于足下"
      art={
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400">
            <SoftFilter />
            <Range
              id="road-far"
              base={300}
              opacity={0.18}
              seed={500}
              peaks={[
                [120, 200, 200],
                [380, 220, 240],
                [560, 160, 180],
              ]}
            />
            <Range
              id="road-near"
              base={400}
              opacity={0.5}
              seed={540}
              peaks={[
                [40, 200, 190],
                [560, 180, 150],
              ]}
            />
            <Mist y={300} opacity={0.75} />
            <path
              d={smoothPath(ROAD)}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            {stations.map((exp, i) => {
              const [x, y] = ROAD[STATION_POINTS[i]];
              const latest = i === stations.length - 1;
              return (
                <g key={exp.id} transform={`translate(${x} ${y})`}>
                  {/* A tiny post-station roof */}
                  <path d="M-9 -4 Q0 -12 9 -4 Q4 -5 0 -9 Q-4 -5 -9 -4 Z" fill={latest ? "var(--seal)" : "var(--ink)"} />
                  <rect x="-6" y="-4" width="12" height="7" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1" />
                </g>
              );
            })}
          </svg>
          {stations.map((exp, i) => {
            const [x, y] = ROAD[STATION_POINTS[i]];
            const onLeft = x / 600 > 0.55;
            return (
              <div
                key={exp.id}
                className={`absolute -translate-y-1/2 text-[var(--ink)] ${onLeft ? "text-right" : "text-left"}`}
                style={{
                  top: `${(y / 400) * 100}%`,
                  ...(onLeft ? { right: `${(1 - x / 600) * 100 + 3}%` } : { left: `${(x / 600) * 100 + 3}%` }),
                }}
              >
                <p className="text-xs font-semibold sm:text-sm">{exp.company}</p>
                <p className="max-w-[11rem] text-[11px] leading-snug opacity-70 sm:text-xs">{exp.position}</p>
                <p className="font-mono text-[9px] tracking-wider uppercase opacity-50">{exp.dates}</p>
              </div>
            );
          })}
        </>
      }
    >
      <p className="opacity-75">
        Each role is a post station on the road — somewhere I stopped, learned the terrain, and kept walking.
      </p>
      <TextLink href="/experience">View full experience</TextLink>
    </ChapterLayout>
  );
}

// ---------------------------------------------------------------------------
// 述 · About — 亭中观山: a pavilion on a cliff, mostly empty space.
// ---------------------------------------------------------------------------

export function AboutScene({ bio, education }: { bio: string; education: InkScrollData["education"] }) {
  return (
    <ChapterLayout
      cjk="述"
      label="About"
      title="From the Pavilion"
      zh="亭中观山"
      art={
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400">
          <SoftFilter />
          <Range
            id="about-far"
            base={320}
            opacity={0.16}
            seed={700}
            peaks={[
              [90, 180, 170],
              [250, 160, 120],
            ]}
          />
          <Mist y={318} opacity={0.8} />
          {/* The cliff */}
          <Range id="about-cliff" base={420} opacity={0.75} seed={740} peaks={[[470, 300, 300]]} />
          {/* Pine reaching out from the cliff */}
          <g stroke="var(--ink)" strokeLinecap="round" fill="none" opacity="0.8">
            <path d="M430 150 C400 140 370 146 340 132" strokeWidth="5" />
            <path d="M372 142 C360 128 352 124 340 122" strokeWidth="2.5" />
          </g>
          <g fill="var(--ink)" opacity="0.7">
            {[
              [338, 128],
              [356, 120],
              [372, 134],
              [392, 140],
            ].map(([cx, cy]) => (
              <ellipse key={cx} cx={cx} cy={cy} rx="18" ry="6" />
            ))}
          </g>
          {/* Pavilion with a seated figure */}
          <g transform="translate(470 136)" fill="var(--ink)">
            <path d="M-34 -22 Q-20 -24 0 -42 Q20 -24 34 -22 Q16 -20 0 -32 Q-16 -20 -34 -22 Z" />
            <rect x="-2" y="-48" width="4" height="8" />
            <rect x="-24" y="-22" width="3" height="24" />
            <rect x="21" y="-22" width="3" height="24" />
            <rect x="-28" y="1" width="56" height="3" />
            {/* figure */}
            <circle cx="-4" cy="-10" r="3.2" fill="var(--seal)" />
            <path d="M-9 1 Q-4 -10 1 1 Z" fill="var(--seal)" opacity="0.85" />
          </g>
        </svg>
      }
    >
      <p className="opacity-75">{bio}</p>
      {education && (
        <p className="font-mono text-[11px] tracking-wider uppercase opacity-60">
          {education.institution} · {education.degree}
        </p>
      )}
      <TextLink href="/about">More about me</TextLink>
    </ChapterLayout>
  );
}

// ---------------------------------------------------------------------------
// 书 · Contact — 鸿雁传书.
// ---------------------------------------------------------------------------

export function ContactScene({ email }: { email: string }) {
  return (
    <ChapterLayout
      cjk="书"
      label="Contact"
      title="A Letter by Wild Goose"
      zh="鸿雁传书 · 云中谁寄锦书来"
      art={
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 400">
            <SoftFilter />
            <circle cx="480" cy="92" r="58" fill="#f4e7c6" opacity="0.8" />
            <Range
              id="contact-far"
              base={360}
              opacity={0.22}
              seed={900}
              peaks={[
                [380, 200, 170],
                [540, 180, 210],
              ]}
            />
          </svg>
          {[
            { left: "52%", top: "16%", width: "30%", wing: 0, letter: true },
            { left: "30%", top: "32%", width: "22%", wing: -22 },
            { left: "13%", top: "20%", width: "15%", wing: 10 },
          ].map(({ left, top, width, wing, letter }) => (
            <div key={left} className="absolute -translate-x-1/2 -rotate-6" style={{ left, top, width }}>
              <WildGoose wing={wing} letter={letter} />
            </div>
          ))}
          <Reeds className="right-[-6%] h-[62%] opacity-90" />
        </>
      }
    >
      <p className="opacity-75">
        Open to internships, research collaborations, and interesting technical problems. Write to me — a goose
        will carry it.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/contact" className={sealButton}>
          Get in Touch
        </Link>
        <a href={`mailto:${email}`} className="focus-ring text-sm underline decoration-[var(--ink)]/30 underline-offset-4">
          {email}
        </a>
      </div>
    </ChapterLayout>
  );
}
