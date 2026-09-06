import { FolderIcon } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Project, ProjectResource } from "@prisma/client";

type GridProject = Pick<
  Project,
  "slug" | "title" | "shortDescription" | "category" | "status" | "technologies" | "coverImage"
> & {
  resources?: Pick<ProjectResource, "type" | "url">[];
};

export function ProjectGrid({
  projects,
  emptyTitle = "No projects found",
  emptyDescription = "Try a different filter or search term.",
}: {
  projects: GridProject[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (projects.length === 0) {
    return <EmptyState icon={FolderIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
