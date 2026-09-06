import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ExternalLinkIcon, PlayCircleIcon, FileTextIcon, DownloadIcon, LinkIcon } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import type { ProjectResource } from "@prisma/client";
import { resourceLabel } from "@/lib/utils";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  GITHUB: GithubIcon,
  LIVE_DEMO: ExternalLinkIcon,
  VIDEO: PlayCircleIcon,
  DOCUMENTATION: FileTextIcon,
  DOWNLOAD: DownloadIcon,
  OTHER: LinkIcon,
};

export function ProjectResources({ resources }: { resources: ProjectResource[] }) {
  if (resources.length === 0) return null;

  const sorted = [...resources].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex flex-wrap gap-3">
      {sorted.map((resource) => {
        const Icon = ICONS[resource.type] ?? LinkIcon;
        return (
          <Link
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Icon className="h-4 w-4" />
            {resource.title || resourceLabel(resource.type)}
          </Link>
        );
      })}
    </div>
  );
}
