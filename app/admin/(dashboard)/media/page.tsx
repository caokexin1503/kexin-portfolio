import { isSupabaseConfigured, listAllObjects } from "@/lib/storage";
import { listLocalMedia } from "@/lib/actions/upload";
import { MediaGrid } from "@/components/admin/MediaGrid";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const files = isSupabaseConfigured ? await listAllObjects() : await listLocalMedia();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Media Library</h1>
      <p className="mt-1 text-sm text-muted">
        {isSupabaseConfigured
          ? "Files stored in Supabase Storage."
          : "Files stored locally in public/uploads (development fallback — configure Supabase for production)."}
      </p>
      <div className="mt-8">
        <MediaGrid files={files} />
      </div>
    </div>
  );
}
