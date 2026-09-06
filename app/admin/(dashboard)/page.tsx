import Link from "next/link";
import { FolderIcon, StarIcon, GlobeIcon, FileEditIcon, PlusIcon, MailIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatCard } from "@/components/admin/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [total, featured, published, drafts, recent, unreadMessages] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of your portfolio content.</p>
        </div>
        <ButtonLink href="/admin/projects/new">
          <PlusIcon className="h-4 w-4" />
          New Project
        </ButtonLink>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Projects" value={total} icon={FolderIcon} />
        <StatCard label="Featured" value={featured} icon={StarIcon} />
        <StatCard label="Published" value={published} icon={GlobeIcon} />
        <StatCard label="Drafts" value={drafts} icon={FileEditIcon} />
        <StatCard label="Unread Messages" value={unreadMessages} icon={MailIcon} />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
          <Link href="/admin/projects" className="focus-ring text-sm font-medium text-accent hover:underline">
            View All
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-muted">No projects yet. Create your first project to get started.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {recent.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="focus-ring font-medium text-foreground hover:text-accent"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{categoryLabel(project.category)}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={project.published ? "success" : "warning"}>
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted">
                      {formatShortDate(project.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
