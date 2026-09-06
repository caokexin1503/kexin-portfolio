import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { categoryLabel, formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted">{projects.length} total</p>
        </div>
        <ButtonLink href="/admin/projects/new">
          <PlusIcon className="h-4 w-4" />
          New Project
        </ButtonLink>
      </div>

      <div className="mt-6">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start populating your portfolio."
            action={
              <ButtonLink href="/admin/projects/new">
                <PlusIcon className="h-4 w-4" />
                New Project
              </ButtonLink>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs font-medium tracking-wide text-muted uppercase">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Updated</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="focus-ring font-medium text-foreground hover:text-accent"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{categoryLabel(project.category)}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={project.published ? "success" : "warning"}>
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{formatShortDate(project.updatedAt)}</td>
                    <td className="px-5 py-3.5">
                      <ProjectRowActions id={project.id} published={project.published} featured={project.featured} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
