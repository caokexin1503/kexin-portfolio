import Link from "next/link";
import Image from "next/image";
import { ExternalLinkIcon, ImageOffIcon } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, statusLabel } from "@/lib/utils";
import type { Project, ProjectResource } from "@prisma/client";

type CardProject = Pick<
  Project,
  "slug" | "title" | "shortDescription" | "category" | "status" | "technologies" | "coverImage"
> & {
  resources?: Pick<ProjectResource, "type" | "url">[];
};

export function ProjectCard({ project }: { project: CardProject }) {
  const github = project.resources?.find((r) => r.type === "GITHUB");
  const liveDemo = project.resources?.find((r) => r.type === "LIVE_DEMO");

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent/40">
      <Link href={`/projects/${project.slug}`} className="focus-ring block">
        <div className="relative aspect-video w-full overflow-hidden bg-code-bg">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <ImageOffIcon className="h-8 w-8" strokeWidth={1.5} />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="accent">{categoryLabel(project.category)}</Badge>
          <Badge variant="outline">{statusLabel(project.status)}</Badge>
        </div>

        <Link href={`/projects/${project.slug}`} className="focus-ring rounded-sm">
          <h3 className="text-lg leading-snug font-semibold text-foreground group-hover:text-accent">
            {project.title}
          </h3>
        </Link>

        <p className="line-clamp-2 flex-1 text-sm text-muted">{project.shortDescription}</p>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="rounded-md bg-background px-2 py-0.5 text-xs text-muted">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="rounded-md bg-background px-2 py-0.5 text-xs text-muted">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-1 flex items-center gap-3 border-t border-border pt-3 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="focus-ring font-medium text-accent hover:underline"
          >
            View Project →
          </Link>
          {github && (
            <Link
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="focus-ring ml-auto text-muted hover:text-foreground"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
          )}
          {liveDemo && (
            <Link
              href={liveDemo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              className="focus-ring text-muted hover:text-foreground"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
