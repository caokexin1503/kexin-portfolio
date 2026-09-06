import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(date: Date | string | null | undefined): string {
  if (!date) return "";
  return monthYear.format(new Date(date));
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

// For dates the admin dashboard shows (project.updatedAt, etc). Fixed locale
// and timeZone so the server-rendered string always matches what hydrates on
// the client, regardless of the visitor's OS/browser locale.
export function formatShortDate(date: Date | string): string {
  return shortDate.format(new Date(date));
}

const dateTime = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

// Fixed locale AND timeZone: the server (Node, whatever locale/TZ its host
// has) and the client (the viewer's browser) must compute byte-identical
// strings during hydration, or React throws a hydration mismatch. Pinning
// both means this always reads as UTC rather than the viewer's local time —
// an acceptable trade-off for an admin-only timestamp.
export function formatDateTime(date: Date | string): string {
  return `${dateTime.format(new Date(date))} UTC`;
}

export function formatDateRange(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
  current = false,
): string {
  if (!start) return "";
  const startLabel = formatMonthYear(start);
  if (current) return `${startLabel} – Present`;
  if (!end) return startLabel;
  return `${startLabel} – ${formatMonthYear(end)}`;
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  ARTIFICIAL_INTELLIGENCE: "Artificial Intelligence",
  MACHINE_LEARNING: "Machine Learning",
  COMPUTER_VISION: "Computer Vision",
  SOFTWARE_ENGINEERING: "Software Engineering",
  WEB_DEVELOPMENT: "Web Development",
  GAME_DEVELOPMENT: "Game Development",
  DATA_SCIENCE: "Data Science",
  RESEARCH: "Research",
  OTHER: "Other",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  ARCHIVED: "Archived",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

const RESOURCE_LABELS: Record<string, string> = {
  GITHUB: "View on GitHub",
  LIVE_DEMO: "Live Demo",
  VIDEO: "Watch Video",
  DOCUMENTATION: "Documentation",
  DOWNLOAD: "Download",
  OTHER: "Learn More",
};

export function resourceLabel(type: string): string {
  return RESOURCE_LABELS[type] ?? type;
}

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  PROGRAMMING_LANGUAGES: "Programming Languages",
  AI_MACHINE_LEARNING: "AI / Machine Learning",
  COMPUTER_VISION: "Computer Vision",
  WEB_DEVELOPMENT: "Web Development",
  DEVELOPER_TOOLS: "Developer Tools",
  GAME_DEVELOPMENT: "Game Development",
  OTHER: "Other",
};

export function skillCategoryLabel(category: string): string {
  return SKILL_CATEGORY_LABELS[category] ?? category;
}

const SKILL_LEVEL_LABELS: Record<string, string> = {
  LEARNING: "Learning",
  FAMILIAR: "Familiar",
  PROFICIENT: "Proficient",
  ADVANCED: "Advanced",
};

export function skillLevelLabel(level: string): string {
  return SKILL_LEVEL_LABELS[level] ?? level;
}
