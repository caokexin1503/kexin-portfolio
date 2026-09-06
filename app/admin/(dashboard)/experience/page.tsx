import { prisma } from "@/lib/db";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Experience</h1>
      <p className="mt-1 text-sm text-muted">Work experience and extracurricular involvement.</p>
      <div className="mt-8">
        <ExperienceManager experiences={experiences} />
      </div>
    </div>
  );
}
