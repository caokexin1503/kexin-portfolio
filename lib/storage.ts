import "server-only";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

export const BUCKET = "portfolio-media";

export type UploadKind = "image" | "video" | "document" | "download";

// Vercel Serverless Functions cap request bodies well below what a screen
// recording or a Unity build needs, so anything beyond a small image/PDF is
// uploaded directly from the browser to Supabase Storage via a short-lived
// signed URL (see lib/actions/upload.ts) rather than passing through a
// server action or API route body.
export const MAX_UPLOAD_BYTES: Record<UploadKind, number> = {
  image: 8 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  document: 20 * 1024 * 1024,
  download: 300 * 1024 * 1024,
};

export const ALLOWED_MIME_TYPES: Record<UploadKind, string[]> = {
  image: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  video: ["video/mp4"],
  document: ["application/pdf"],
  download: [
    "application/zip",
    "application/x-zip-compressed",
    "application/pdf",
    "application/octet-stream",
    "application/x-msdownload",
    "application/vnd.rar",
    "application/x-7z-compressed",
  ],
};

export function validateUpload(
  kind: UploadKind,
  file: { size: number; type: string },
): string | null {
  const maxBytes = MAX_UPLOAD_BYTES[kind];
  if (file.size <= 0) return "File is empty.";
  if (file.size > maxBytes) {
    return `File exceeds the ${Math.round(maxBytes / (1024 * 1024))}MB limit for ${kind} uploads.`;
  }
  const allowed = ALLOWED_MIME_TYPES[kind];
  if (!allowed.includes(file.type)) {
    return `File type "${file.type || "unknown"}" is not allowed for ${kind} uploads. Allowed: ${allowed.join(", ")}`;
  }
  return null;
}

export function safeFileName(originalName: string): string {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : "";
  const base = originalName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return ext ? `${base || "file"}-${unique}.${ext}` : `${base || "file"}-${unique}`;
}

function getAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase storage is not configured.");
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function ensureBucketExists() {
  const client = getAdminClient();
  const { data: buckets } = await client.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    await client.storage.createBucket(BUCKET, { public: true });
  }
}

export async function createSignedUploadTarget(kind: UploadKind, path: string) {
  const client = getAdminClient();
  const { data, error } = await client.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create signed upload URL.");
  }
  const { data: publicUrlData } = client.storage.from(BUCKET).getPublicUrl(path);
  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: publicUrlData.publicUrl,
  };
}

export async function deleteObject(path: string) {
  const client = getAdminClient();
  await client.storage.from(BUCKET).remove([path]);
}

export async function listObjects(prefix = "") {
  const client = getAdminClient();
  const { data, error } = await client.storage.from(BUCKET).list(prefix, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export function getPublicUrl(path: string): string {
  const client = getAdminClient();
  return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export type MediaFile = {
  path: string;
  name: string;
  url: string;
  size: number;
  updatedAt: string;
};

/** Recursively lists every file in the bucket for the admin media library. */
export async function listAllObjects(prefix = ""): Promise<MediaFile[]> {
  const client = getAdminClient();
  const files: MediaFile[] = [];

  async function walk(path: string) {
    const { data, error } = await client.storage.from(BUCKET).list(path, {
      limit: 500,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error || !data) return;

    for (const entry of data) {
      const fullPath = path ? `${path}/${entry.name}` : entry.name;
      const isFolder = entry.id === null;
      if (isFolder) {
        await walk(fullPath);
      } else {
        files.push({
          path: fullPath,
          name: entry.name,
          url: client.storage.from(BUCKET).getPublicUrl(fullPath).data.publicUrl,
          size: entry.metadata?.size ?? 0,
          updatedAt: entry.updated_at ?? entry.created_at ?? "",
        });
      }
    }
  }

  await walk(prefix);
  return files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
