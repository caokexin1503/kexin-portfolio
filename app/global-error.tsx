"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center text-black">
        <p className="font-mono text-sm text-red-500">500</p>
        <h1 className="mt-3 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-gray-500">A critical error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="mt-6 rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
