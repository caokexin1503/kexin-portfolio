import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { PhilosophyIntro } from "@/components/Philosophy/PhilosophyIntro";
import { categoryLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects in Artificial Intelligence, Computer Vision, software engineering, and game development.",
};

type SearchParams = Promise<{ category?: string; tech?: string; q?: string; sort?: string }>;

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const tech = params.tech ?? "";
  const q = params.q?.trim().toLowerCase() ?? "";
  const sort = params.sort ?? "featured";

  const allProjects = await prisma.project.findMany({
    where: { published: true },
    include: { resources: { select: { type: true, url: true } } },
  });

  const allTechnologies = Array.from(new Set(allProjects.flatMap((p) => p.technologies))).sort();

  let filtered = allProjects.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (tech && !p.technologies.includes(tech)) return false;
    if (q) {
      const haystack = [p.title, p.shortDescription, categoryLabel(p.category), ...p.technologies]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered = filtered.sort((a, b) => {
    if (sort === "oldest") return a.createdAt.getTime() - b.createdAt.getTime();
    if (sort === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
    // featured
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <>
      <PhilosophyIntro />

      <Container className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="Portfolio"
          title="Projects"
          description="AI, computer vision, software engineering, and game development projects — filter or search to find something specific."
        />

        <div className="mt-8">
          <Suspense>
            <ProjectFilters technologies={allTechnologies} />
          </Suspense>
        </div>

        <p className="mt-6 text-sm text-muted">
          {filtered.length} project{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="mt-4">
          <ProjectGrid projects={filtered} />
        </div>
      </Container>
    </>
  );
}
