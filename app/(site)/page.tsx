import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { InkScroll } from "@/components/home/InkScroll";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SkillList } from "@/components/skills/SkillList";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSiteSettings();

  const [featuredProjects, skills, allExperiences, education] = await Promise.all([
    prisma.project.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { resources: { select: { type: true, url: true } } },
    }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { displayOrder: "asc" }] }),
    prisma.experience.findMany({ orderBy: { displayOrder: "asc" }, take: 3 }),
    prisma.education.findFirst({ orderBy: { displayOrder: "asc" }, select: { institution: true, degree: true } }),
  ]);
  const experiences = allExperiences.slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    jobTitle: settings.headline,
    description: settings.seoDescription,
    email: settings.email,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [settings.githubUrl, settings.linkedinUrl, settings.twitterUrl, settings.websiteUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <InkScroll
        name={settings.name}
        headline={settings.headline}
        bio={settings.bio}
        email={settings.email}
        githubUrl={settings.githubUrl}
        linkedinUrl={settings.linkedinUrl}
        education={education}
        projects={featuredProjects.map(({ slug, title, category }) => ({ slug, title, category }))}
        experiences={allExperiences.map((exp) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          dates: formatDateRange(exp.startDate, exp.endDate, exp.current),
        }))}
      />

      <Container className="py-20">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured Projects"
          description="A selection of AI, computer vision, and software engineering projects I've built."
          action={
            <ButtonLink href="/projects" variant="secondary">
              View All Projects
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          }
        />
        <div className="mt-10">
          <ProjectGrid
            projects={featuredProjects}
            emptyTitle="Projects coming soon"
            emptyDescription="Featured projects will appear here once published from the admin dashboard."
          />
        </div>
      </Container>

      {skills.length > 0 && (
        <div className="border-t border-border bg-surface/40">
          <Container className="py-20">
            <SectionHeading eyebrow="Toolbox" title="Technical Skills" />
            <div className="mt-10">
              <SkillList skills={skills} compact />
            </div>
          </Container>
        </div>
      )}

      {experiences.length > 0 && (
        <Container className="py-20">
          <SectionHeading
            eyebrow="Career"
            title="Experience"
            action={
              <ButtonLink href="/experience" variant="secondary">
                View Full Experience
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            }
          />
          <div className="mt-10 space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="rounded-lg border border-border bg-surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-foreground">
                    {exp.position} · {exp.company}
                  </h3>
                  <span className="text-sm text-muted">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.location && <p className="mt-1 text-sm text-muted">{exp.location}</p>}
                {exp.description && <p className="mt-3 text-sm text-muted">{exp.description}</p>}
              </div>
            ))}
          </div>
        </Container>
      )}

      <div className="border-t border-border bg-surface/40">
        <Container className="py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow="Background" title="About Me" />
              <p className="mt-6 leading-relaxed text-muted">{settings.bio}</p>
              <ButtonLink href="/about" variant="secondary" className="mt-6">
                Learn More
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="rounded-lg border border-border bg-surface p-8">
              <h3 className="text-lg font-semibold text-foreground">Let&apos;s talk</h3>
              <p className="mt-2 text-sm text-muted">
                Open to internships, research collaborations, and interesting technical problems.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/contact">Get in Touch</ButtonLink>
                <Link
                  href={`mailto:${settings.email}`}
                  className="focus-ring inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
                >
                  {settings.email}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
