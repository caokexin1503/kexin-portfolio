"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CopyIcon, Trash2Icon, FileIcon, SearchIcon } from "lucide-react";
import { deleteUploadedFile } from "@/lib/actions/upload";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";

export type MediaItem = { name: string; url: string; size: number; updatedAt: string };

function isImage(name: string) {
  return /\.(png|jpe?g|webp|gif)$/i.test(name);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGrid({ files }: { files: MediaItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())),
    [files, query],
  );

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard.");
  }

  async function handleDelete(url: string) {
    await deleteUploadedFile(url);
    toast.success("File deleted.");
    router.refresh();
  }

  return (
    <div>
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="focus-ring w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No files found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((file) => (
            <div key={file.url} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="flex aspect-square items-center justify-center bg-background">
                {isImage(file.name) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                  <FileIcon className="h-8 w-8 text-muted" strokeWidth={1.5} />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-foreground" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted">{formatSize(file.size)}</p>
                <div className="mt-2 flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(file.url)} title="Copy URL">
                    <CopyIcon className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmDialog
                    title="Delete this file?"
                    description="If it's still used by a project, that reference will break."
                    onConfirm={() => handleDelete(file.url)}
                    trigger={
                      <Button variant="ghost" size="sm" title="Delete">
                        <Trash2Icon className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
