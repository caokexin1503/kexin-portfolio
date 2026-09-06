import { MailIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function Hero({
  name,
  headline,
  bio,
  githubUrl,
  linkedinUrl,
}: {
  name: string;
  headline: string;
  bio: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-dot-grid pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative py-20 sm:py-28">
        <div className="animate-fade-up max-w-3xl">
          <p className="mb-4 font-mono text-sm text-accent">{"> whoami"}</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {name} <span className="text-muted">(Phil)</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-muted sm:text-xl">{headline}</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">{bio}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/projects" size="lg">
              View Projects
            </ButtonLink>
            {githubUrl && (
              <ButtonLink href={githubUrl} variant="outline" size="lg" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-4 w-4" />
                GitHub
              </ButtonLink>
            )}
            {linkedinUrl && (
              <ButtonLink href={linkedinUrl} variant="outline" size="lg" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
              </ButtonLink>
            )}
            <ButtonLink href="/contact" variant="ghost" size="lg">
              <MailIcon className="h-4 w-4" />
              Contact
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
