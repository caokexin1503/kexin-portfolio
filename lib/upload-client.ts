"use client";

import { createClient } from "@supabase/supabase-js";
import { requestUploadTarget, uploadLocalFile } from "@/lib/actions/upload";
import type { UploadKind } from "@/lib/storage";

const BUCKET = "portfolio-media";

let browserClient: ReturnType<typeof createClient> | null = null;

function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (!browserClient) browserClient = createClient(url, anonKey);
  return browserClient;
}

/**
 * Uploads a file chosen in the admin UI. When Supabase Storage is configured
 * this PUTs the bytes directly from the browser to Supabase via a signed
 * URL (no server body-size limit involved); otherwise it falls back to a
 * server action that writes into public/uploads for local development.
 */
export async function uploadFile(file: File, kind: UploadKind, folder: string): Promise<string> {
  const target = await requestUploadTarget({
    kind,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    folder,
  });

  if (target.mode === "supabase") {
    const client = getBrowserClient();
    if (!client) {
      throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in the browser environment.");
    }
    const { error } = await client.storage
      .from(BUCKET)
      .uploadToSignedUrl(target.path, target.token, file);
    if (error) throw new Error(error.message);
    return target.publicUrl;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);
  formData.append("folder", folder);
  const result = await uploadLocalFile(formData);
  return result.url;
}
