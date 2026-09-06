"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { educationSchema, type EducationInput } from "@/lib/validation";
import type { ActionResult } from "@/lib/actions/projects";

function revalidateEducationPaths() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/education");
}

function toData(input: EducationInput) {
  return {
    institution: input.institution,
    degree: input.degree,
    program: input.program || null,
    location: input.location || null,
    startDate: new Date(input.startDate),
    endDate: input.endDate ? new Date(input.endDate) : null,
    expectedGraduation: input.expectedGraduation ? new Date(input.expectedGraduation) : null,
    description: input.description || null,
    courses: input.courses,
    displayOrder: input.displayOrder,
  };
}

export async function createEducation(rawInput: EducationInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const education = await prisma.education.create({ data: toData(parsed.data) });
  revalidateEducationPaths();
  return { success: true, data: { id: education.id } };
}

export async function updateEducation(
  id: string,
  rawInput: EducationInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const education = await prisma.education.update({ where: { id }, data: toData(parsed.data) });
  revalidateEducationPaths();
  return { success: true, data: { id: education.id } };
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  revalidateEducationPaths();
  return { success: true, data: undefined };
}
