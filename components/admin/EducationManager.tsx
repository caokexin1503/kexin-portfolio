"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, Trash2Icon, GraduationCapIcon } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { createEducation, updateEducation, deleteEducation } from "@/lib/actions/education";
import { formatDateRange } from "@/lib/utils";
import type { Education } from "@prisma/client";

type FormValues = {
  institution: string;
  degree: string;
  program: string;
  location: string;
  startDate: string;
  endDate: string;
  expectedGraduation: string;
  description: string;
  coursesText: string;
  displayOrder: number;
};

function toDateInput(date: Date | string | null | undefined) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function defaultsFrom(edu: Education | null, nextOrder: number): FormValues {
  return {
    institution: edu?.institution ?? "",
    degree: edu?.degree ?? "",
    program: edu?.program ?? "",
    location: edu?.location ?? "",
    startDate: toDateInput(edu?.startDate),
    endDate: toDateInput(edu?.endDate),
    expectedGraduation: toDateInput(edu?.expectedGraduation),
    description: edu?.description ?? "",
    coursesText: edu?.courses.join(", ") ?? "",
    displayOrder: edu?.displayOrder ?? nextOrder,
  };
}

function EducationFormFields({
  education,
  nextOrder,
  onCancel,
  onSaved,
}: {
  education: Education | null;
  nextOrder: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: defaultsFrom(education, nextOrder),
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const input = {
      institution: values.institution,
      degree: values.degree,
      program: values.program || undefined,
      location: values.location || undefined,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      expectedGraduation: values.expectedGraduation || undefined,
      description: values.description || undefined,
      courses: values.coursesText.split(",").map((c) => c.trim()).filter(Boolean),
      displayOrder: Number(values.displayOrder) || 0,
    };
    const result = education ? await updateEducation(education.id, input) : await createEducation(input);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(education ? "Education updated." : "Education added.");
    onSaved();
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label required>Institution</Label>
              <Input {...register("institution")} required />
            </div>
            <div>
              <Label required>Degree</Label>
              <Input {...register("degree")} required />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Program</Label>
              <Input {...register("program")} />
            </div>
            <div>
              <Label>Location</Label>
              <Input {...register("location")} />
            </div>
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
            <div>
              <Label>Expected Graduation</Label>
              <Input type="date" {...register("expectedGraduation")} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} placeholder="GPA, honors, notable achievements..." />
          </div>
          <div>
            <Label>Relevant Courses</Label>
            <Input {...register("coursesText")} placeholder="Data Structures, Algorithm Analysis" />
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

export function EducationManager({ education }: { education: Education[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteEducation(id);
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
            Add Education
          </Button>
        )}
      </div>

      {editingId === "new" && (
        <EducationFormFields
          education={null}
          nextOrder={education.length}
          onCancel={() => setEditingId(null)}
          onSaved={handleSaved}
        />
      )}

      {education.length === 0 && editingId === null && (
        <EmptyState icon={GraduationCapIcon} title="No education yet" description="Add your first entry." />
      )}

      <div className="space-y-4">
        {education.map((edu) =>
          editingId === edu.id ? (
            <EducationFormFields
              key={edu.id}
              education={edu}
              nextOrder={edu.displayOrder}
              onCancel={() => setEditingId(null)}
              onSaved={handleSaved}
            />
          ) : (
            <Card key={edu.id}>
              <CardBody className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted">{edu.degree}</p>
                  <p className="text-sm text-muted">
                    {formatDateRange(edu.startDate, edu.expectedGraduation ?? edu.endDate)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(edu.id)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    title="Delete this education entry?"
                    description="This cannot be undone."
                    onConfirm={() => handleDelete(edu.id)}
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
