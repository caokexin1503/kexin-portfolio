import type { Metadata } from "next";
import { MailIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { GooseCourier } from "@/components/contact/GooseCourier";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — email, GitHub, and LinkedIn.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <Container size="narrow" className="py-16 sm:py-20">
      {/* 鸿雁传书 — full-page ink-wash backdrop, fixed behind the content */}
      <GooseCourier />

      <SectionHeading eyebrow="Get in touch" title="Contact" />
      <p className="mt-3 text-sm text-muted" style={{ fontFamily: '"Songti SC", "STSong", "Noto Serif SC", serif' }}>
        鸿雁传书 · Send a letter by wild goose
      </p>


      <div className="mt-[40vh] grid grid-cols-1 gap-12 sm:mt-[42vh] lg:grid-cols-2">
        <div>
          <p className="leading-relaxed text-foreground/75">
            The fastest way to reach me is by email. I&apos;m happy to talk about internships,
            research, or anything you&apos;ve seen in my projects.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={`mailto:${settings.email}`}
              className="focus-ring flex items-center gap-3 rounded-md border border-border bg-surface/70 p-4 text-sm backdrop-blur-md hover:border-accent/40"
            >
              <MailIcon className="h-5 w-5 text-accent" />
              {settings.email}
            </a>
            {settings.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center gap-3 rounded-md border border-border bg-surface/70 p-4 text-sm backdrop-blur-md hover:border-accent/40"
              >
                <GithubIcon className="h-5 w-5 text-accent" />
                {settings.githubUrl.replace("https://", "")}
              </a>
            )}
            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center gap-3 rounded-md border border-border bg-surface/70 p-4 text-sm backdrop-blur-md hover:border-accent/40"
              >
                <LinkedinIcon className="h-5 w-5 text-accent" />
                {settings.linkedinUrl.replace("https://", "")}
              </a>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface/75 p-6 backdrop-blur-md sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
