import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDateRange } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "About",
    description: settings.bio || settings.seoDescription,
  };
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const education = await prisma.education.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <Container size="narrow" className="py-16 sm:py-20">
      <SectionHeading eyebrow="Background" title="About Me" />

      <div className="prose-portfolio mt-8">
        <p>{settings.bio}</p>
      </div>

      <section className="mt-10 border-l-2 border-accent bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">On a Team</h2>
        <p className="mt-3 leading-relaxed text-muted">
          I think of myself as the glue on a team. I pay attention to what&apos;s missing —
          whoever&apos;s stuck, whatever task nobody&apos;s picked up, whatever skill the team
          doesn&apos;t have yet — and I go cover it. I&apos;d rather the team succeed as a whole
          than just finish my own piece, so wherever help is needed, that&apos;s where I show up.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-foreground">Education</h2>
        <div className="mt-6 space-y-6">
          {education.length === 0 && <p className="text-sm text-muted">TODO: add education from the admin dashboard.</p>}
          {education.map((edu) => (
            <div key={edu.id} className="rounded-lg border border-border bg-surface p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-foreground">{edu.institution}</h3>
                <span className="text-sm text-muted">
                  {formatDateRange(edu.startDate, edu.expectedGraduation ?? edu.endDate)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{edu.degree}</p>
              {edu.location && <p className="text-sm text-muted">{edu.location}</p>}
              {edu.description && <p className="mt-3 text-sm text-muted">{edu.description}</p>}
              {edu.courses.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {edu.courses.map((course) => (
                    <span key={course} className="rounded-md bg-background px-2.5 py-1 text-xs text-muted">
                      {course}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Technical Interests</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Artificial Intelligence, Computer Vision, Machine Learning systems, and the software
            engineering practices that make research ideas into reliable products.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Current Focus</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Studying Computer Science at the University of Toronto while building projects that
            combine computer vision model development with practical engineering — from model
            architecture experiments to deployment-oriented optimization.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Career Interests</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Software engineering and AI/ML roles — particularly computer vision — plus research
            opportunities that involve hands-on experimentation and measurable results.
          </p>
        </div>
      </section>
    </Container>
  );
}
