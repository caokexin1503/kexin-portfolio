"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Input, Textarea, Label, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { createExperience, updateExperience, deleteExperience } from "@/lib/actions/experience";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@prisma/client";
import { BriefcaseIcon } from "lucide-react";

type FormValues = {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologiesText: string;
  achievementsText: string;
  displayOrder: number;
};

function toDateInput(date: Date | string | null | undefined) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function defaultsFrom(exp: Experience | null, nextOrder: number): FormValues {
  return {
    company: exp?.company ?? "",
    position: exp?.position ?? "",
    location: exp?.location ?? "",
    startDate: toDateInput(exp?.startDate),
    endDate: toDateInput(exp?.endDate),
    current: exp?.current ?? false,
    description: exp?.description ?? "",
    technologiesText: exp?.technologies.join(", ") ?? "",
    achievementsText: exp?.achievements.join("\n") ?? "",
    displayOrder: exp?.displayOrder ?? nextOrder,
  };
}

function ExperienceFormFields({
  experience,
  nextOrder,
  onCancel,
  onSaved,
}: {
  experience: Experience | null;
  nextOrder: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: defaultsFrom(experience, nextOrder),
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const input = {
      company: values.company,
      position: values.position,
      location: values.location || undefined,
      startDate: values.startDate,
      endDate: values.current ? undefined : values.endDate || undefined,
      current: values.current,
      description: values.description,
      technologies: values.technologiesText.split(",").map((t) => t.trim()).filter(Boolean),
      achievements: values.achievementsText.split("\n").map((a) => a.trim()).filter(Boolean),
      displayOrder: Number(values.displayOrder) || 0,
    };
    const result = experience
      ? await updateExperience(experience.id, input)
      : await createExperience(input);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(experience ? "Experience updated." : "Experience added.");
    onSaved();
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label required>Company</Label>
              <Input {...register("company")} required />
            </div>
            <div>
              <Label required>Position</Label>
              <Input {...register("position")} required />
            </div>
          </div>
          <div>
            <Label>Location</Label>
            <Input {...register("location")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label required>Start Date</Label>
              <Input type="date" {...register("startDate")} required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" {...register("endDate")} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox {...register("current")} />
                Current position
              </label>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
          </div>
          <div>
            <Label>Achievements</Label>
            <Textarea {...register("achievementsText")} rows={4} placeholder="One per line" />
          </div>
          <div>
            <Label>Technologies</Label>
            <Input {...register("technologiesText")} placeholder="Python, PyTorch" />
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" {...register("displayOrder")} className="w-24" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export function ExperienceManager({ experiences }: { experiences: Experience[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteExperience(id);
    if (!result.success) toast.error(result.error);
    else {
      toast.success("Deleted.");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {editingId === null && (
          <Button onClick={() => setEditingId("new")}>
            <PlusIcon className="h-4 w-4" />
            Add Experience
          </Button>
        )}
      </div>

      {editingId === "new" && (
        <ExperienceFormFields
          experience={null}
          nextOrder={experiences.length}
          onCancel={() => setEditingId(null)}
          onSaved={handleSaved}
        />
      )}

      {experiences.length === 0 && editingId === null && (
        <EmptyState icon={BriefcaseIcon} title="No experience yet" description="Add your first entry." />
      )}

      <div className="space-y-4">
        {experiences.map((exp) =>
          editingId === exp.id ? (
            <ExperienceFormFields
              key={exp.id}
              experience={exp}
              nextOrder={exp.displayOrder}
              onCancel={() => setEditingId(null)}
              onSaved={handleSaved}
            />
          ) : (
            <Card key={exp.id}>
              <CardBody className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">
                    {exp.position} · {exp.company}
                  </p>
                  <p className="text-sm text-muted">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    {exp.location ? ` — ${exp.location}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(exp.id)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    title="Delete this experience entry?"
                    description="This cannot be undone."
                    onConfirm={() => handleDelete(exp.id)}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Trash2Icon className="h-4 w-4 text-red-500" />
                      </Button>
                    }
                  />
                </div>
              </CardBody>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
