import { skillCategoryLabel } from "@/lib/utils";
import type { Skill } from "@prisma/client";

export function SkillList({ skills, compact = false }: { skills: Skill[]; compact?: boolean }) {
  const grouped = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill);
    grouped.set(skill.category, list);
  }

  return (
    <div className={compact ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"}>
      {Array.from(grouped.entries()).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
            {skillCategoryLabel(category)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {items
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
                >
                  {skill.name}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
