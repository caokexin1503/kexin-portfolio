"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { experienceSchema, type ExperienceInput } from "@/lib/validation";
import type { ActionResult } from "@/lib/actions/projects";

function revalidateExperiencePaths() {
  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/experience");
}

function toData(input: ExperienceInput) {
  return {
    company: input.company,
    position: input.position,
    location: input.location || null,
    startDate: new Date(input.startDate),
    endDate: input.current ? null : input.endDate ? new Date(input.endDate) : null,
    current: input.current,
    description: input.description,
    technologies: input.technologies,
    achievements: input.achievements,
    displayOrder: input.displayOrder,
  };
}

export async function createExperience(rawInput: ExperienceInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const experience = await prisma.experience.create({ data: toData(parsed.data) });
  revalidateExperiencePaths();
  return { success: true, data: { id: experience.id } };
}

export async function updateExperience(
  id: string,
  rawInput: ExperienceInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const experience = await prisma.experience.update({ where: { id }, data: toData(parsed.data) });
  revalidateExperiencePaths();
  return { success: true, data: { id: experience.id } };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidateExperiencePaths();
  return { success: true, data: undefined };
}
