import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { philosophers } from "@/data/philosophers";
import { PhilosophyExperience } from "@/components/Philosophy/PhilosophyExperience";
import type { PhilosophyProjectSummary } from "@/components/Philosophy/PhilosophyProjectCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What Is the Meaning of Life?",
  description:
    "A timeline through 2,500 years of philosophy — from Socrates to Camus — and how each idea connects to a project I've built.",
};

export default async function PhilosophyPage() {
  const slugs = philosophers
    .map((p) => p.projectSlug)
    .filter((slug): slug is string => Boolean(slug));

  const projects = await prisma.project.findMany({
    where: { slug: { in: slugs }, published: true },
    select: { slug: true, title: true, shortDescription: true, technologies: true },
  });

  const projectsBySlug: Record<string, PhilosophyProjectSummary> = {};
  for (const project of projects) {
    projectsBySlug[project.slug] = project;
  }

  return (
    <Suspense>
      <PhilosophyExperience projectsBySlug={projectsBySlug} />
    </Suspense>
  );
}
