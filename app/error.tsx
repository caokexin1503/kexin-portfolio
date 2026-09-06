"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-red-500">500</p>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-muted">
        An unexpected error occurred. It has been logged — please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <ButtonLink href="/" variant="secondary">
          Go Home
        </ButtonLink>
      </div>
    </div>
  );
}
