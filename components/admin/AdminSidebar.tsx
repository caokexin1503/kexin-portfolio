"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  FolderIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  SparklesIcon,
  ImageIcon,
  MailIcon,
  SettingsIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderIcon },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseIcon },
  { href: "/admin/education", label: "Education", icon: GraduationCapIcon },
  { href: "/admin/skills", label: "Skills", icon: SparklesIcon },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: MailIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-5">
        <p className="text-sm font-semibold text-foreground">Admin Dashboard</p>
        <p className="text-xs text-muted">Portfolio content management</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {LINKS.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-hover hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-border px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="focus-ring flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          View Site
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
