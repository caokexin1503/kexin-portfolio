import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { MailIcon, GlobeIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/BrandIcons";
import { getSiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/Container";

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  const socials = [
    settings.githubUrl && { href: settings.githubUrl, label: "GitHub", icon: GithubIcon },
    settings.linkedinUrl && { href: settings.linkedinUrl, label: "LinkedIn", icon: LinkedinIcon },
    settings.twitterUrl && { href: settings.twitterUrl, label: "X / Twitter", icon: TwitterIcon },
    settings.websiteUrl && { href: settings.websiteUrl, label: "Website", icon: GlobeIcon },
    settings.email && { href: `mailto:${settings.email}`, label: "Email", icon: MailIcon },
  ].filter(Boolean) as { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[];

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          © {year} {settings.name}. Built with Next.js.
        </p>

        <div className="flex items-center gap-1">
          {socials.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
