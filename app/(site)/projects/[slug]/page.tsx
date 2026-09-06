import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { MarkdownRenderer } from "@/components/projects/MarkdownRenderer";
import { ProjectResults } from "@/components/projects/ProjectResults";
import { ProjectResources } from "@/components/projects/ProjectResources";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { VideoEmbed } from "@/components/projects/VideoEmbed";
import { categoryLabel, statusLabel, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      results: { orderBy: { displayOrder: "asc" } },
      resources: { orderBy: { displayOrder: "asc" } },
      media: { orderBy: { displayOrder: "asc" } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  if (!project.published) {
    const session = await auth();
    if (!session?.user) return {};
  }

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: "article",
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
    },
    robots: project.published ? undefined : { index: false, follow: false },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  if (!project.published) {
    const session = await auth();
    if (!session?.user) notFound();
  }

  const videoResource = project.resources.find((r) => r.type === "VIDEO");
  const buttonResources = project.resources.filter((r) => r.type !== "VIDEO");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    dateCreated: project.startDate?.toISOString(),
    keywords: project.technologies.join(", "),
  };

  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/projects"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All Projects
      </Link>

      {!project.published && (
        <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400">
          This project is unpublished — it&apos;s only visible to you as the site owner.
        </div>
      )}

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{categoryLabel(project.category)}</Badge>
          <Badge variant="outline">{statusLabel(project.status)}</Badge>
          {(project.startDate || project.endDate) && (
            <span className="text-sm text-muted">
              {formatDateRange(project.startDate, project.endDate, project.status === "IN_PROGRESS")}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{project.shortDescription}</p>

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-md bg-surface px-2.5 py-1 text-xs text-muted">
                {tech}
              </span>
            ))}
          </div>
        )}
      </header>

      {project.coverImage && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {videoResource && (
        <div className="mt-8">
          <VideoEmbed url={videoResource.url} title={project.title} />
        </div>
      )}

      {project.content && (
        <div className="mt-10">
          <MarkdownRenderer content={project.content} />
        </div>
      )}

      {project.results.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">Results</h2>
          <div className="mt-5">
            <ProjectResults results={project.results} />
          </div>
        </section>
      )}

      {project.media.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">Screenshots</h2>
          <div className="mt-5">
            <ProjectGallery media={project.media} projectTitle={project.title} />
          </div>
        </section>
      )}

      {buttonResources.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Resources</h2>
          <ProjectResources resources={buttonResources} />
        </section>
      )}
    </Container>
  );
}
