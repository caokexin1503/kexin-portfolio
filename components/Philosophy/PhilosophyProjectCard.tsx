import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export type PhilosophyProjectSummary = {
  slug: string;
  title: string;
  shortDescription: string;
  technologies: string[];
};

export function PhilosophyProjectCard({ project }: { project: PhilosophyProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="focus-ring group block border border-white/15 bg-white/[0.04] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
    >
      <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">My Project</p>
      <h4 className="mt-2 text-base font-medium text-white">{project.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{project.shortDescription}</p>
      {project.technologies.length > 0 && (
        <p className="mt-3 text-xs text-white/40">{project.technologies.slice(0, 4).join(" · ")}</p>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white group-hover:underline">
        Explore
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
