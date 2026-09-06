import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Identity, social links, and SEO defaults — these update everywhere on the site.
      </p>
      <div className="mt-8 max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
