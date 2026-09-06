import { prisma } from "@/lib/db";
import { SkillManager } from "@/components/admin/SkillManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { displayOrder: "asc" }] });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Skills</h1>
      <p className="mt-1 text-sm text-muted">Keep levels honest — no exaggeration.</p>
      <div className="mt-8">
        <SkillManager skills={skills} />
      </div>
    </div>
  );
}
