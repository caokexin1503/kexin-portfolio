"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, Trash2Icon, SparklesIcon } from "lucide-react";
import { Input, Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/skills";
import { skillCategories, skillLevels } from "@/lib/validation";
import { skillCategoryLabel, skillLevelLabel } from "@/lib/utils";
import type { Skill } from "@prisma/client";

type FormValues = {
  name: string;
  category: (typeof skillCategories)[number];
  level: (typeof skillLevels)[number];
  displayOrder: number;
};

function defaultsFrom(skill: Skill | null, nextOrder: number): FormValues {
  return {
    name: skill?.name ?? "",
    category: (skill?.category as FormValues["category"]) ?? "PROGRAMMING_LANGUAGES",
    level: (skill?.level as FormValues["level"]) ?? "FAMILIAR",
    displayOrder: skill?.displayOrder ?? nextOrder,
  };
}

function SkillFormFields({
  skill,
  nextOrder,
  onCancel,
  onSaved,
}: {
  skill: Skill | null;
  nextOrder: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: defaultsFrom(skill, nextOrder) });
  const [saving, setSaving] = useState(false);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const input = { ...values, displayOrder: Number(values.displayOrder) || 0 };
    const result = skill ? await updateSkill(skill.id, input) : await createSkill(input);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(skill ? "Skill updated." : "Skill added.");
    onSaved();
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-[1.5fr_1.5fr_1fr_0.8fr_auto] sm:items-end">
          <div>
            <Label required>Name</Label>
            <Input {...register("name")} required />
          </div>
          <div>
            <Label required>Category</Label>
            <Select {...register("category")}>
              {skillCategories.map((c) => (
                <option key={c} value={c}>
                  {skillCategoryLabel(c)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label required>Level</Label>
            <Select {...register("level")}>
              {skillLevels.map((l) => (
                <option key={l} value={l}>
                  {skillLevelLabel(l)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Order</Label>
            <Input type="number" {...register("displayOrder")} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export function SkillManager({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteSkill(id);
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
            Add Skill
          </Button>
        )}
      </div>

      {editingId === "new" && (
        <SkillFormFields skill={null} nextOrder={skills.length} onCancel={() => setEditingId(null)} onSaved={handleSaved} />
      )}

      {skills.length === 0 && editingId === null && (
        <EmptyState icon={SparklesIcon} title="No skills yet" description="Add your first skill." />
      )}

      <div className="space-y-3">
        {skills.map((skill) =>
          editingId === skill.id ? (
            <SkillFormFields
              key={skill.id}
              skill={skill}
              nextOrder={skill.displayOrder}
              onCancel={() => setEditingId(null)}
              onSaved={handleSaved}
            />
          ) : (
            <Card key={skill.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <Badge variant="outline">{skillCategoryLabel(skill.category)}</Badge>
                  <Badge>{skillLevelLabel(skill.level)}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(skill.id)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    title="Delete this skill?"
                    description="This cannot be undone."
                    onConfirm={() => handleDelete(skill.id)}
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
