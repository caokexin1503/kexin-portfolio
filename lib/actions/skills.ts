"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { skillSchema, type SkillInput } from "@/lib/validation";
import type { ActionResult } from "@/lib/actions/projects";

function revalidateSkillPaths() {
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function createSkill(rawInput: SkillInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const skill = await prisma.skill.create({
    data: { ...parsed.data, icon: parsed.data.icon || null },
  });
  revalidateSkillPaths();
  return { success: true, data: { id: skill.id } };
}

export async function updateSkill(id: string, rawInput: SkillInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(rawInput);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const skill = await prisma.skill.update({
    where: { id },
    data: { ...parsed.data, icon: parsed.data.icon || null },
  });
  revalidateSkillPaths();
  return { success: true, data: { id: skill.id } };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidateSkillPaths();
  return { success: true, data: undefined };
}
