"use server";

import { mkdir, unlink, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/require-admin";
import {
  validateUpload,
  safeFileName,
  createSignedUploadTarget,
  deleteObject,
  isSupabaseConfigured,
  type UploadKind,
} from "@/lib/storage";

const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export type UploadTarget =
  | { mode: "supabase"; signedUrl: string; token: string; path: string; publicUrl: string }
  | { mode: "local-ready" };

/**
 * Step 1 of the Supabase upload flow: mint a short-lived signed URL that the
 * browser will PUT the file bytes to directly, bypassing the server entirely
 * (Vercel Serverless Functions cap request bodies far below what a video or
 * a Unity build needs). Falls back to signalling "local-ready" in dev when
 * Supabase isn't configured — the client then calls uploadLocalFile instead.
 */
export async function requestUploadTarget(input: {
  kind: UploadKind;
  fileName: string;
  fileType: string;
  fileSize: number;
  folder: string;
}): Promise<UploadTarget> {
  await requireAdmin();

  const error = validateUpload(input.kind, { size: input.fileSize, type: input.fileType });
  if (error) throw new Error(error);

  if (!isSupabaseConfigured) {
    return { mode: "local-ready" };
  }

  const objectPath = `${input.folder}/${safeFileName(input.fileName)}`;
  const target = await createSignedUploadTarget(input.kind, objectPath);
  return { mode: "supabase", ...target };
}

/** Dev-only fallback used when Supabase Storage isn't configured. */
export async function uploadLocalFile(formData: FormData): Promise<{ url: string }> {
  await requireAdmin();

  const file = formData.get("file");
  const kind = formData.get("kind") as UploadKind | null;
  const folder = (formData.get("folder") as string | null) ?? "misc";

  if (!(file instanceof File) || !kind) {
    throw new Error("Missing file or upload kind.");
  }

  const error = validateUpload(kind, { size: file.size, type: file.type });
  if (error) throw new Error(error);

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "");
  const dir = path.join(LOCAL_UPLOAD_ROOT, safeFolder);
  await mkdir(dir, { recursive: true });

  const fileName = safeFileName(file.name);
  const filePath = path.join(dir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `/uploads/${safeFolder}/${fileName}` };
}

/** Deletes a previously uploaded file, whether it lives in Supabase or locally. */
export async function deleteUploadedFile(url: string): Promise<void> {
  await requireAdmin();

  if (isSupabaseConfigured && url.includes("/storage/v1/object/public/")) {
    const marker = "/storage/v1/object/public/";
    const idx = url.indexOf(marker);
    const afterBucket = url.slice(idx + marker.length);
    const objectPath = afterBucket.split("/").slice(1).join("/");
    await deleteObject(decodeURIComponent(objectPath));
    return;
  }

  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await unlink(filePath);
    } catch {
      // already gone — nothing to do
    }
  }
}

export type LocalMediaFile = {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
};

/** Lists locally-stored uploads for the admin media library (dev fallback). */
export async function listLocalMedia(): Promise<LocalMediaFile[]> {
  await requireAdmin();

  const files: LocalMediaFile[] = [];

  async function walk(dir: string, urlPrefix: string) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const urlPath = `${urlPrefix}/${entry.name}`;
      if (entry.isDirectory()) {
        await walk(fullPath, urlPath);
      } else {
        const stats = await stat(fullPath);
        files.push({
          name: entry.name,
          url: urlPath,
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        });
      }
    }
  }

  await walk(LOCAL_UPLOAD_ROOT, "/uploads");
  return files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
