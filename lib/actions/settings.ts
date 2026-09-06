"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { settingsSchema, type SettingsInput } from "@/lib/validation";
import type { ActionResult } from "@/lib/actions/projects";

function revalidateSitewide() {
  revalidatePath("/", "layout");
}

export async function updateSettings(rawInput: SettingsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const data = parsed.data;
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      ...data,
      githubUrl: data.githubUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      twitterUrl: data.twitterUrl || null,
      websiteUrl: data.websiteUrl || null,
      profilePhoto: data.profilePhoto || null,
      favicon: data.favicon || null,
    },
    update: {
      ...data,
      githubUrl: data.githubUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      twitterUrl: data.twitterUrl || null,
      websiteUrl: data.websiteUrl || null,
      profilePhoto: data.profilePhoto || null,
      favicon: data.favicon || null,
    },
  });

  revalidateSitewide();
  return { success: true, data: undefined };
}
