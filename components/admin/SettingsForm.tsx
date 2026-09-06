"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { updateSettings } from "@/lib/actions/settings";
import type { SiteSettings } from "@prisma/client";

type FormValues = {
  name: string;
  headline: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  profilePhoto: string;
  seoTitle: string;
  seoDescription: string;
  favicon: string;
};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      name: settings.name,
      headline: settings.headline,
      bio: settings.bio,
      email: settings.email,
      githubUrl: settings.githubUrl ?? "",
      linkedinUrl: settings.linkedinUrl ?? "",
      twitterUrl: settings.twitterUrl ?? "",
      websiteUrl: settings.websiteUrl ?? "",
      profilePhoto: settings.profilePhoto ?? "",
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      favicon: settings.favicon ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const result = await updateSettings(values);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Settings saved.");
    router.refresh();
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-foreground">Identity</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label required>Name</Label>
              <Input {...register("name")} required />
            </div>
            <div>
              <Label required>Headline</Label>
              <Input {...register("headline")} required />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea {...register("bio")} rows={4} />
            </div>
            <div>
              <Label>Profile Photo URL</Label>
              <div className="flex gap-3">
                <Input {...register("profilePhoto")} className="flex-1" />
                <UploadButton
                  kind="image"
                  folder="settings"
                  accept="image/png,image/jpeg,image/webp"
                  onUploaded={(url) => setValue("profilePhoto", url)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-foreground">Contact & Social</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label required>Email</Label>
              <Input type="email" {...register("email")} required />
            </div>
            <div>
              <Label>GitHub URL</Label>
              <Input {...register("githubUrl")} placeholder="https://github.com/username" />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <Label>X / Twitter URL</Label>
              <Input {...register("twitterUrl")} placeholder="https://x.com/username" />
            </div>
            <div>
              <Label>Other Website URL</Label>
              <Input {...register("websiteUrl")} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-foreground">SEO & Branding</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label required>SEO Title</Label>
              <Input {...register("seoTitle")} required />
            </div>
            <div>
              <Label required>SEO Description</Label>
              <Textarea {...register("seoDescription")} rows={2} required />
            </div>
            <div>
              <Label>Favicon URL</Label>
              <div className="flex gap-3">
                <Input {...register("favicon")} className="flex-1" />
                <UploadButton
                  kind="image"
                  folder="settings"
                  accept="image/png,image/x-icon"
                  onUploaded={(url) => setValue("favicon", url)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
  );
}
