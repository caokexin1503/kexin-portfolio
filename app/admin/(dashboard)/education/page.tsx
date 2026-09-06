import { prisma } from "@/lib/db";
import { EducationManager } from "@/components/admin/EducationManager";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const education = await prisma.education.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Education</h1>
      <p className="mt-1 text-sm text-muted">Degrees, institutions, and coursework.</p>
      <div className="mt-8">
        <EducationManager education={education} />
      </div>
    </div>
  );
}
