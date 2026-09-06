import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateRange } from "@/lib/utils";
import { BriefcaseIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work experience and extracurricular involvement in AI and software engineering.",
};

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <Container size="narrow" className="py-16 sm:py-20">
      <SectionHeading eyebrow="Career" title="Experience" />

      <div className="mt-10">
        {experiences.length === 0 ? (
          <EmptyState
            icon={BriefcaseIcon}
            title="No experience listed yet"
            description="Add experience entries from the admin dashboard."
          />
        ) : (
          <ol className="relative space-y-10 border-l border-border pl-8">
            {experiences.map((exp) => (
              <li key={exp.id} className="relative">
                <span className="absolute top-1.5 -left-[calc(2rem+4.5px)] h-2.5 w-2.5 rounded-full bg-accent" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{exp.position}</h3>
                  <span className="text-sm text-muted">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="mt-1 font-medium text-accent">{exp.company}</p>
                {exp.location && <p className="text-sm text-muted">{exp.location}</p>}
                {exp.description && <p className="mt-3 text-sm leading-relaxed text-muted">{exp.description}</p>}

                {exp.achievements.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}

                {exp.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="rounded-md bg-surface px-2.5 py-1 text-xs text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </Container>
  );
}
