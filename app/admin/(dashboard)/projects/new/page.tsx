import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Project</h1>
      <p className="mt-1 text-sm text-muted">Fill in as much or as little as you have — save as a draft anytime.</p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
