// Data for the Philosophy / Meaning-of-Life timeline (see components/Philosophy/*).
// Deliberately kept out of the UI layer so new philosophers can be added without
// touching any component. `projectSlug` is optional and, when present, must match
// a real Project.slug in the database — the timeline never duplicates project
// content, it only points at it (see app/(site)/projects/philosophy/page.tsx).
//
// Only philosophers with `clickable: true` open the immersive detail scene;
// the rest render as plain, non-interactive markers on the timeline (by
// design — see PR feedback: most of the timeline is historical scaffolding,
// only a couple of philosophers carry a personal project connection).

export type Era = "Ancient" | "Medieval" | "Early Modern" | "Existential / Modern";

export type MapRegion = "greece" | "italy" | "france" | "germany" | "denmark" | "austria";

export interface Philosopher {
  id: string;
  name: string; // short form used on the timeline node, e.g. "Nietzsche"
  fullName: string; // e.g. "Friedrich Nietzsche"
  birth: number; // negative = BCE
  death?: number;
  era: Era;
  location: string;
  region: MapRegion;
  clickable: boolean;
  coreQuestion: string;
  keyIdea: string; // short label, e.g. "CREATE YOUR OWN VALUES"
  interpretation: string; // personal, first-person framing — never a biography
  projectSlug?: string;
}

export const philosophers: Philosopher[] = [
  {
    id: "socrates",
    name: "Socrates",
    fullName: "Socrates",
    birth: -470,
    death: -399,
    era: "Ancient",
    location: "Athens, Greece",
    region: "greece",
    clickable: true,
    coreQuestion: "Do I actually understand this, or do I just think I do?",
    keyIdea: "QUESTION EVERYTHING",
    interpretation:
      "That's the whole design philosophy behind Chainsilience AI, the supply-chain risk platform I built with a team of four. We didn't want another black-box AI — every alert has to show its evidence, so a decision-maker can ask \"why does this matter?\" and actually get an answer before acting on it.",
    projectSlug: "chainsilience-ai",
  },
  {
    id: "plato",
    name: "Plato",
    fullName: "Plato",
    birth: -428,
    death: -348,
    era: "Ancient",
    location: "Athens, Greece",
    region: "greece",
    clickable: true,
    coreQuestion: "Is the version I'm seeing the real thing, or just a shadow of it?",
    keyIdea: "LOOK PAST THE SURFACE",
    interpretation:
      "A camera frame is just pixels — shadows on a wall — until a model finds the real structure underneath. During my internship at SF Express, that's exactly what I spent a summer doing: teaching YOLOv8 to see past the raw image to the object that's actually there.",
    projectSlug: "yolov8-object-detection-optimization",
  },
  {
    id: "aristotle",
    name: "Aristotle",
    fullName: "Aristotle",
    birth: -384,
    death: -322,
    era: "Ancient",
    location: "Athens & Macedon, Greece",
    region: "greece",
    clickable: false,
    coreQuestion: "What does it mean to actually flourish — not just succeed once, but get better?",
    keyIdea: "FLOURISH",
    interpretation:
      "Eudaimonia isn't a single win, it's a practice. Every experiment I run, tune, and re-run is that same idea: improvement as a habit, not an event.",
  },
  {
    id: "epicurus",
    name: "Epicurus",
    fullName: "Epicurus",
    birth: -341,
    death: -270,
    era: "Ancient",
    location: "Samos & Athens, Greece",
    region: "greece",
    clickable: false,
    coreQuestion: "What actually matters — the noise, or the people and ideas worth paying attention to?",
    keyIdea: "VALUE WHAT CONNECTS US",
    interpretation:
      "Epicurus put friendship above almost everything else. Studying how influence and connection actually move through a network felt like a technical version of the same question.",
  },
  {
    id: "aquinas",
    name: "Aquinas",
    fullName: "Thomas Aquinas",
    birth: 1225,
    death: 1274,
    era: "Medieval",
    location: "Roccasecca, Italy",
    region: "italy",
    clickable: false,
    coreQuestion: "Can reason and belief actually work together, or do they have to fight?",
    keyIdea: "RECONCILE",
    interpretation:
      "A lot of engineering is reconciling two things that seem opposed — rigor and intuition, structure and flexibility. Aquinas built a career out of exactly that kind of synthesis.",
  },
  {
    id: "descartes",
    name: "Descartes",
    fullName: "René Descartes",
    birth: 1596,
    death: 1650,
    era: "Early Modern",
    location: "La Haye & Amsterdam",
    region: "france",
    clickable: false,
    coreQuestion: "If I doubt everything, what's actually left standing?",
    keyIdea: "BUILD FROM FIRST PRINCIPLES",
    interpretation:
      "Descartes rebuilt certainty from a single foundation upward. Writing a game-playing agent from raw rules and a search tree — no shortcuts, no assumptions — is the same instinct.",
  },
  {
    id: "kant",
    name: "Kant",
    fullName: "Immanuel Kant",
    birth: 1724,
    death: 1804,
    era: "Early Modern",
    location: "Königsberg, Prussia",
    region: "germany",
    clickable: false,
    coreQuestion: "What rule would I want everyone, including me, to have to follow?",
    keyIdea: "ACT ON PRINCIPLE",
    interpretation:
      "Kant's categorical imperative shows up whenever I decide how a system should handle an edge case — would I accept this rule if it applied to every user, every time?",
  },
  {
    id: "kierkegaard",
    name: "Kierkegaard",
    fullName: "Søren Kierkegaard",
    birth: 1813,
    death: 1855,
    era: "Existential / Modern",
    location: "Copenhagen, Denmark",
    region: "denmark",
    clickable: false,
    coreQuestion: "At some point, don't I just have to commit and start, before I feel ready?",
    keyIdea: "LEAP ANYWAY",
    interpretation:
      "No amount of planning removes the leap. Every project I've started began before I felt fully prepared for it — that's just what starting is.",
  },
  {
    id: "nietzsche",
    name: "Nietzsche",
    fullName: "Friedrich Nietzsche",
    birth: 1844,
    death: 1900,
    era: "Existential / Modern",
    location: "Germany & Switzerland",
    region: "germany",
    clickable: false,
    coreQuestion: "What if meaning isn't discovered, but created?",
    keyIdea: "CREATE YOUR OWN VALUES",
    interpretation:
      "Meaning can emerge from the things we choose to build. This is the project I keep coming back to with no deadline and no assignment — just because I want it to exist.",
  },
  {
    id: "sartre",
    name: "Sartre",
    fullName: "Jean-Paul Sartre",
    birth: 1905,
    death: 1980,
    era: "Existential / Modern",
    location: "Paris, France",
    region: "france",
    clickable: false,
    coreQuestion: "If nothing is decided for me in advance, what am I actually responsible for?",
    keyIdea: "YOU ARE YOUR CHOICES",
    interpretation:
      "\"Existence precedes essence\" — nobody hands you a spec for who you are. Every technology I've chosen to learn was a choice nobody made for me.",
  },
  {
    id: "camus",
    name: "Camus",
    fullName: "Albert Camus",
    birth: 1913,
    death: 1960,
    era: "Existential / Modern",
    location: "Algeria & France",
    region: "france",
    clickable: false,
    coreQuestion: "If there's no guaranteed answer, is it still worth building the thing?",
    keyIdea: "EMBRACE THE ABSURD",
    interpretation:
      "Camus imagined Sisyphus happy, pushing the boulder anyway. A lot of software is exactly that: state management, edge cases, merge conflicts — and you keep building because the process is the point.",
  },
  {
    id: "frankl",
    name: "Frankl",
    fullName: "Viktor Frankl",
    birth: 1905,
    death: 1997,
    era: "Existential / Modern",
    location: "Vienna, Austria",
    region: "austria",
    clickable: false,
    coreQuestion: "Even in the hardest conditions, what's still mine to choose?",
    keyIdea: "FIND MEANING IN THE STRUGGLE",
    interpretation:
      "Frankl found meaning even inside suffering he never chose. On a much smaller scale, the hardest bugs and the longest experiments taught me more than the easy ones ever did.",
  },
];
