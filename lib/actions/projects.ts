"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { projectSchema, type ProjectInput } from "@/lib/validation";
import { deleteUploadedFile } from "@/lib/actions/upload";
import { slugify } from "@/lib/utils";

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/projects/${slug}`);
}

function stripId<T extends { id?: string }>(item: T): Omit<T, "id"> {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function toProjectData(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    content: input.content,
    category: input.category,
    status: input.status,
    featured: input.featured,
    published: input.published,
    technologies: input.technologies,
    startDate: input.startDate ? new Date(input.startDate) : null,
    endDate: input.endDate ? new Date(input.endDate) : null,
    coverImage: input.coverImage || null,
  };
}

export async function createProject(rawInput: ProjectInput): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const input = parsed.data;

  try {
    const project = await prisma.project.create({
      data: {
        ...toProjectData(input),
        results: { create: input.results.map(stripId) },
        resources: { create: input.resources.map(stripId) },
        media: { create: input.media.map(stripId) },
      },
    });
    revalidateProjectPaths(project.slug);
    return { success: true, data: { id: project.id, slug: project.slug } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "A project with this slug already exists." };
    }
    throw error;
  }
}

export async function updateProject(
  id: string,
  rawInput: ProjectInput,
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const input = parsed.data;

  try {
    const project = await prisma.$transaction(async (tx) => {
      await tx.projectResult.deleteMany({ where: { projectId: id } });
      await tx.projectResource.deleteMany({ where: { projectId: id } });
      await tx.projectMedia.deleteMany({ where: { projectId: id } });

      return tx.project.update({
        where: { id },
        data: {
          ...toProjectData(input),
          results: { create: input.results.map(stripId) },
          resources: { create: input.resources.map(stripId) },
          media: { create: input.media.map(stripId) },
        },
      });
    });
    revalidateProjectPaths(project.slug);
    return { success: true, data: { id: project.id, slug: project.slug } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "A project with this slug already exists." };
    }
    throw error;
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();

  const project = await prisma.project.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!project) return { success: false, error: "Project not found." };

  await prisma.project.delete({ where: { id } });

  // Best-effort cleanup of uploaded files; failures here shouldn't block deletion.
  const urls = [project.coverImage, ...project.media.map((m) => m.url)].filter(
    (u): u is string => Boolean(u),
  );
  await Promise.allSettled(urls.map((url) => deleteUploadedFile(url)));

  revalidateProjectPaths(project.slug);
  return { success: true, data: undefined };
}

export async function duplicateProject(id: string): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();

  const original = await prisma.project.findUnique({
    where: { id },
    include: { results: true, resources: true, media: true },
  });
  if (!original) return { success: false, error: "Project not found." };

  let newSlug = `${original.slug}-copy`;
  let counter = 2;
  while (await prisma.project.findUnique({ where: { slug: newSlug } })) {
    newSlug = `${original.slug}-copy-${counter}`;
    counter += 1;
  }

  const copy = await prisma.project.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      shortDescription: original.shortDescription,
      content: original.content,
      category: original.category,
      status: original.status,
      featured: false,
      published: false,
      technologies: original.technologies,
      startDate: original.startDate,
      endDate: original.endDate,
      coverImage: original.coverImage,
      results: {
        create: original.results.map(({ metric, value, note, displayOrder }) => ({
          metric,
          value,
          note,
          displayOrder,
        })),
      },
      resources: {
        create: original.resources.map(({ type, title, url, displayOrder }) => ({
          type,
          title,
          url,
          displayOrder,
        })),
      },
    },
  });

  revalidateProjectPaths();
  return { success: true, data: { id: copy.id, slug: copy.slug } };
}

export async function setProjectPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  const project = await prisma.project.update({ where: { id }, data: { published } });
  revalidateProjectPaths(project.slug);
  return { success: true, data: undefined };
}

export async function setProjectFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requireAdmin();
  const project = await prisma.project.update({ where: { id }, data: { featured } });
  revalidateProjectPaths(project.slug);
  return { success: true, data: undefined };
}

export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  await requireAdmin();
  const base = slugify(title) || "project";
  let candidate = base;
  let counter = 2;
  while (
    await prisma.project.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}
