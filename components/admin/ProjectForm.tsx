"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { Input, Textarea, Select, Label, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UploadButton } from "@/components/admin/UploadButton";
import { MarkdownRenderer } from "@/components/projects/MarkdownRenderer";
import { createProject, updateProject } from "@/lib/actions/projects";
import { slugify } from "@/lib/utils";
import {
  projectCategories,
  projectStatuses,
  resourceTypes,
  mediaTypes,
  type ProjectInput,
} from "@/lib/validation";
import { categoryLabel, statusLabel, resourceLabel } from "@/lib/utils";
import type { Project, ProjectResult, ProjectResource, ProjectMedia } from "@prisma/client";

type FullProject = Project & {
  results: ProjectResult[];
  resources: ProjectResource[];
  media: ProjectMedia[];
};

type FormValues = {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  category: (typeof projectCategories)[number];
  status: (typeof projectStatuses)[number];
  featured: boolean;
  technologiesText: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  results: { metric: string; value: string; note: string }[];
  resources: { type: (typeof resourceTypes)[number]; title: string; url: string }[];
  media: {
    type: (typeof mediaTypes)[number];
    url: string;
    title: string;
    altText: string;
    caption: string;
  }[];
};

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function defaultValuesFromProject(project?: FullProject): FormValues {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    shortDescription: project?.shortDescription ?? "",
    content: project?.content ?? "",
    category: (project?.category as FormValues["category"]) ?? "SOFTWARE_ENGINEERING",
    status: (project?.status as FormValues["status"]) ?? "IN_PROGRESS",
    featured: project?.featured ?? false,
    technologiesText: project?.technologies.join(", ") ?? "",
    startDate: toDateInputValue(project?.startDate),
    endDate: toDateInputValue(project?.endDate),
    coverImage: project?.coverImage ?? "",
    results: project?.results
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((r) => ({ metric: r.metric, value: r.value, note: r.note ?? "" })) ?? [],
    resources: project?.resources
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((r) => ({ type: r.type, title: r.title, url: r.url })) ?? [],
    media: project?.media
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((m) => ({
        type: m.type,
        url: m.url,
        title: m.title ?? "",
        altText: m.altText ?? "",
        caption: m.caption ?? "",
      })) ?? [],
  };
}

export function ProjectForm({ project }: { project?: FullProject }) {
  const router = useRouter();
  const isEditing = Boolean(project);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const slugEditedRef = useRef(isEditing);

  const { register, handleSubmit, watch, setValue, control } = useForm<FormValues>({
    defaultValues: defaultValuesFromProject(project),
  });

  const resultsArray = useFieldArray({ control, name: "results" });
  const resourcesArray = useFieldArray({ control, name: "resources" });
  const mediaArray = useFieldArray({ control, name: "media" });

  const contentValue = watch("content");
  const titleValue = watch("title");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setValue("title", value);
    if (!slugEditedRef.current) {
      setValue("slug", slugify(value));
    }
  }

  async function onSubmit(values: FormValues, publish: boolean) {
    setSaving(publish ? "publish" : "draft");

    const input: ProjectInput = {
      title: values.title,
      slug: values.slug,
      shortDescription: values.shortDescription,
      content: values.content,
      category: values.category,
      status: values.status,
      featured: values.featured,
      published: publish,
      technologies: values.technologiesText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      coverImage: values.coverImage,
      results: values.results.map((r, i) => ({ ...r, displayOrder: i })),
      resources: values.resources.map((r, i) => ({ ...r, displayOrder: i })),
      media: values.media.map((m, i) => ({ ...m, displayOrder: i })),
    };

    const result = isEditing
      ? await updateProject(project!.id, input)
      : await createProject(input);

    setSaving(null);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(publish ? "Project published." : "Draft saved.");
    router.push(`/admin/projects/${result.data.id}/edit`);
    router.refresh();
  }

  async function handlePreview(values: FormValues) {
    await onSubmit(values, project?.published ?? false);
    window.open(`/projects/${values.slug}`, "_blank");
  }

  return (
    <form className="space-y-10 pb-24">
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

        <div>
          <Label htmlFor="title" required>
            Title
          </Label>
          <Input id="title" value={titleValue} onChange={handleTitleChange} required />
        </div>

        <div>
          <Label htmlFor="slug" required>
            Slug
          </Label>
          <Input
            id="slug"
            {...register("slug", { onChange: () => (slugEditedRef.current = true) })}
            required
          />
          <p className="mt-1 text-xs text-muted">URL: /projects/{watch("slug") || "your-slug"}</p>
        </div>

        <div>
          <Label htmlFor="shortDescription" required>
            Short Description
          </Label>
          <Textarea
            id="shortDescription"
            {...register("shortDescription")}
            required
            maxLength={280}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="category" required>
              Category
            </Label>
            <Select id="category" {...register("category")}>
              {projectCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status" required>
              Status
            </Label>
            <Select id="status" {...register("status")}>
              {projectStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
          </div>
        </div>

        <div>
          <Label htmlFor="technologiesText">Technologies</Label>
          <Input id="technologiesText" {...register("technologiesText")} placeholder="Python, PyTorch, YOLOv8" />
          <p className="mt-1 text-xs text-muted">Comma-separated.</p>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <Checkbox {...register("featured")} />
          Featured on homepage
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Cover Image</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input {...register("coverImage")} placeholder="https://... or upload below" className="flex-1" />
          <UploadButton
            kind="image"
            folder="projects/covers"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onUploaded={(url) => setValue("coverImage", url)}
          />
        </div>
        {watch("coverImage") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={watch("coverImage")}
            alt="Cover preview"
            className="mt-2 aspect-video w-full max-w-md rounded-md border border-border object-cover"
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Case Study Content (Markdown)</h2>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreview((v) => !v)}>
            <EyeIcon className="h-3.5 w-3.5" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
        {showPreview ? (
          <div className="rounded-md border border-border bg-surface p-5">
            <MarkdownRenderer content={contentValue} />
          </div>
        ) : (
          <Textarea
            {...register("content")}
            rows={16}
            className="font-mono text-sm"
            placeholder={"## Overview\n\n...\n\n## Motivation\n\n...\n\n## Approach\n\n...\n\n## Results\n\n...\n\n## Challenges\n\n...\n\n## Lessons Learned\n\n...\n\n## Future Improvements\n\n..."}
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Results</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => resultsArray.append({ metric: "", value: "", note: "" })}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add Result
          </Button>
        </div>
        {resultsArray.fields.length === 0 && (
          <p className="text-sm text-muted">No quantitative results yet.</p>
        )}
        <div className="space-y-3">
          {resultsArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-2 rounded-md border border-border p-4 sm:grid-cols-[1fr_1fr_1.5fr_auto]">
              <Input placeholder="Metric (e.g. mAP)" {...register(`results.${index}.metric` as const)} />
              <Input placeholder="Value (e.g. +8 pp)" {...register(`results.${index}.value` as const)} />
              <Input placeholder="Note (optional)" {...register(`results.${index}.note` as const)} />
              <Button type="button" variant="ghost" size="sm" onClick={() => resultsArray.remove(index)}>
                <Trash2Icon className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Resources</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => resourcesArray.append({ type: "GITHUB", title: "", url: "" })}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add Resource
          </Button>
        </div>
        {resourcesArray.fields.length === 0 && (
          <p className="text-sm text-muted">
            No resources yet — not every project has a live demo. Add GitHub, live demo, video, docs, or download links as they exist.
          </p>
        )}
        <div className="space-y-3">
          {resourcesArray.fields.map((field, index) => {
            const type = watch(`resources.${index}.type`);
            const uploadKind = type === "DOWNLOAD" ? "download" : type === "DOCUMENTATION" ? "document" : null;
            return (
              <div key={field.id} className="grid grid-cols-1 gap-2 rounded-md border border-border p-4 sm:grid-cols-[140px_1fr_1.5fr_auto_auto]">
                <Select {...register(`resources.${index}.type` as const)}>
                  {resourceTypes.map((t) => (
                    <option key={t} value={t}>
                      {resourceLabel(t)}
                    </option>
                  ))}
                </Select>
                <Input placeholder="Title" {...register(`resources.${index}.title` as const)} />
                <Input placeholder="https://..." {...register(`resources.${index}.url` as const)} />
                {uploadKind && (
                  <UploadButton
                    kind={uploadKind}
                    folder={`projects/${uploadKind}`}
                    accept={uploadKind === "download" ? ".zip,.exe,.pdf,.rar,.7z" : "application/pdf"}
                    onUploaded={(url) => setValue(`resources.${index}.url`, url)}
                    label=""
                  />
                )}
                <Button type="button" variant="ghost" size="sm" onClick={() => resourcesArray.remove(index)}>
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Gallery / Screenshots</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => mediaArray.append({ type: "IMAGE", url: "", title: "", altText: "", caption: "" })}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add Media
          </Button>
        </div>
        <div className="space-y-3">
          {mediaArray.fields.map((field, index) => {
            const type = watch(`media.${index}.type`);
            return (
              <div key={field.id} className="space-y-2 rounded-md border border-border p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr_auto_auto]">
                  <Select {...register(`media.${index}.type` as const)}>
                    {mediaTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Select>
                  <Input
                    placeholder={type === "VIDEO" ? "YouTube/Vimeo URL or upload" : "URL or upload below"}
                    {...register(`media.${index}.url` as const)}
                  />
                  <UploadButton
                    kind={type === "IMAGE" ? "image" : type === "VIDEO" ? "video" : "document"}
                    folder="projects/gallery"
                    accept={
                      type === "IMAGE"
                        ? "image/png,image/jpeg,image/webp,image/gif"
                        : type === "VIDEO"
                          ? "video/mp4"
                          : "application/pdf"
                    }
                    onUploaded={(url) => setValue(`media.${index}.url`, url)}
                    label=""
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => mediaArray.remove(index)}>
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input placeholder="Title (optional)" {...register(`media.${index}.title` as const)} />
                  <Input placeholder="Alt text" {...register(`media.${index}.altText` as const)} />
                  <Input placeholder="Caption (optional)" {...register(`media.${index}.caption` as const)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-end gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <Button
            type="button"
            variant="ghost"
            disabled={saving !== null}
            onClick={handleSubmit(handlePreview)}
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={saving !== null}
            onClick={handleSubmit((values) => onSubmit(values, false))}
          >
            {saving === "draft" ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            disabled={saving !== null}
            onClick={handleSubmit((values) => onSubmit(values, true))}
          >
            {saving === "publish" ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </form>
  );
}
