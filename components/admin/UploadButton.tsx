"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { UploadCloudIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload-client";
import type { UploadKind } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function UploadButton({
  kind,
  folder,
  accept,
  onUploaded,
  label = "Upload",
  className,
}: {
  kind: UploadKind;
  folder: string;
  accept: string;
  onUploaded: (url: string, fileName: string) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, kind, folder);
      onUploaded(url, file.name);
      toast.success("File uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className={cn(className)}
      >
        {loading ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : <UploadCloudIcon className="h-3.5 w-3.5" />}
        {loading ? "Uploading..." : label}
      </Button>
    </>
  );
}
