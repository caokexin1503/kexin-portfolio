import { z } from "zod";

export const projectCategories = [
  "ARTIFICIAL_INTELLIGENCE",
  "MACHINE_LEARNING",
  "COMPUTER_VISION",
  "SOFTWARE_ENGINEERING",
  "WEB_DEVELOPMENT",
  "GAME_DEVELOPMENT",
  "DATA_SCIENCE",
  "RESEARCH",
  "OTHER",
] as const;

export const projectStatuses = ["COMPLETED", "IN_PROGRESS", "ARCHIVED"] as const;

export const resourceTypes = [
  "GITHUB",
  "LIVE_DEMO",
  "VIDEO",
  "DOCUMENTATION",
  "DOWNLOAD",
  "OTHER",
] as const;

export const mediaTypes = ["IMAGE", "VIDEO", "DOCUMENT"] as const;

export const skillCategories = [
  "PROGRAMMING_LANGUAGES",
  "AI_MACHINE_LEARNING",
  "COMPUTER_VISION",
  "WEB_DEVELOPMENT",
  "DEVELOPER_TOOLS",
  "GAME_DEVELOPMENT",
  "OTHER",
] as const;

export const skillLevels = ["LEARNING", "FAMILIAR", "PROFICIENT", "ADVANCED"] as const;

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || z.string().url().safeParse(v).success, {
    message: "Must be a valid URL",
  });

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const projectResultSchema = z.object({
  id: z.string().optional(),
  metric: z.string().trim().min(1, "Metric is required"),
  value: z.string().trim().min(1, "Value is required"),
  note: z.string().trim().optional(),
  displayOrder: z.number().int().default(0),
});

export const projectResourceSchema = z.object({
  id: z.string().optional(),
  type: z.enum(resourceTypes),
  title: z.string().trim().min(1, "Title is required"),
  url: z.string().trim().url("Must be a valid URL"),
  displayOrder: z.number().int().default(0),
});

export const projectMediaSchema = z.object({
  id: z.string().optional(),
  type: z.enum(mediaTypes),
  url: z.string().trim().min(1),
  title: z.string().trim().optional(),
  altText: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  displayOrder: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  shortDescription: z.string().trim().min(1, "Short description is required").max(280),
  content: z.string().default(""),
  category: z.enum(projectCategories),
  status: z.enum(projectStatuses).default("IN_PROGRESS"),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  technologies: z.array(z.string().trim().min(1)).default([]),
  startDate: optionalDate,
  endDate: optionalDate,
  coverImage: z.string().trim().optional().or(z.literal("")),
  results: z.array(projectResultSchema).default([]),
  resources: z.array(projectResourceSchema).default([]),
  media: z.array(projectMediaSchema).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  position: z.string().trim().min(1, "Position is required"),
  location: z.string().trim().optional(),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: optionalDate,
  current: z.boolean().default(false),
  description: z.string().default(""),
  technologies: z.array(z.string().trim().min(1)).default([]),
  achievements: z.array(z.string().trim().min(1)).default([]),
  displayOrder: z.number().int().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required"),
  degree: z.string().trim().min(1, "Degree is required"),
  program: z.string().trim().optional(),
  location: z.string().trim().optional(),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: optionalDate,
  expectedGraduation: optionalDate,
  description: z.string().trim().optional(),
  courses: z.array(z.string().trim().min(1)).default([]),
  displayOrder: z.number().int().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.enum(skillCategories),
  level: z.enum(skillLevels).default("FAMILIAR"),
  icon: z.string().trim().optional(),
  displayOrder: z.number().int().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;

export const settingsSchema = z.object({
  name: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  bio: z.string().default(""),
  email: z.string().trim().email(),
  githubUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
  twitterUrl: urlOrEmpty,
  websiteUrl: urlOrEmpty,
  profilePhoto: z.string().trim().optional().or(z.literal("")),
  seoTitle: z.string().trim().min(1),
  seoDescription: z.string().trim().min(1),
  favicon: z.string().trim().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
  // Honeypot field — real users never fill this in; bots that fill every field will.
  company: z.string().max(0, "").optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
