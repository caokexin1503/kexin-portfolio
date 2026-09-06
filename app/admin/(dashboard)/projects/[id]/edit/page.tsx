import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { results: true, resources: true, media: true },
  });

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Edit Project</h1>
      <p className="mt-1 text-sm text-muted">{project.title}</p>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
