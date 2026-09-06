"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StarIcon, CopyIcon, Trash2Icon, GlobeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  deleteProject,
  duplicateProject,
  setProjectFeatured,
  setProjectPublished,
} from "@/lib/actions/projects";

export function ProjectRowActions({
  id,
  published,
  featured,
}: {
  id: string;
  published: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  function togglePublished() {
    startTransition(async () => {
      const result = await setProjectPublished(id, !published);
      if (!result.success) toast.error(result.error);
      else {
        toast.success(published ? "Unpublished." : "Published.");
        router.refresh();
      }
    });
  }

  function toggleFeatured() {
    startTransition(async () => {
      const result = await setProjectFeatured(id, !featured);
      if (!result.success) toast.error(result.error);
      else {
        toast.success(featured ? "Removed from featured." : "Marked as featured.");
        router.refresh();
      }
    });
  }

  async function handleDuplicate() {
    setLoading(true);
    const result = await duplicateProject(id);
    setLoading(false);
    if (!result.success) toast.error(result.error);
    else {
      toast.success("Project duplicated.");
      router.push(`/admin/projects/${result.data.id}/edit`);
    }
  }

  async function handleDelete() {
    const result = await deleteProject(id);
    if (!result.success) toast.error(result.error);
    else {
      toast.success("Project deleted.");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={toggleFeatured}
        aria-label={featured ? "Unfeature" : "Feature"}
        title={featured ? "Unfeature" : "Feature"}
      >
        <StarIcon className={featured ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4"} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={togglePublished}
        aria-label={published ? "Unpublish" : "Publish"}
        title={published ? "Unpublish" : "Publish"}
      >
        {published ? <EyeOffIcon className="h-4 w-4" /> : <GlobeIcon className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        onClick={handleDuplicate}
        aria-label="Duplicate"
        title="Duplicate"
      >
        <CopyIcon className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        title="Delete project?"
        description="This permanently deletes the project and its media, resources, and results. This cannot be undone."
        onConfirm={handleDelete}
        trigger={
          <Button variant="ghost" size="sm" aria-label="Delete" title="Delete">
            <Trash2Icon className="h-4 w-4 text-red-500" />
          </Button>
        }
      />
    </div>
  );
}
