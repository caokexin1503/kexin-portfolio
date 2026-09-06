import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/">Go Home</ButtonLink>
        <Link
          href="/projects"
          className="focus-ring inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          View Projects
        </Link>
      </div>
    </div>
  );
}
