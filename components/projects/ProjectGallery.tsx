"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayCircleIcon } from "lucide-react";
import type { ProjectMedia } from "@prisma/client";
import { VideoEmbed } from "@/components/projects/VideoEmbed";

export function ProjectGallery({ media, projectTitle }: { media: ProjectMedia[]; projectTitle: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sorted = [...media].sort((a, b) => a.displayOrder - b.displayOrder);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(() => setActiveIndex((i) => (i === null ? null : (i + 1) % sorted.length)), [sorted.length]);
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + sorted.length) % sorted.length)),
    [sorted.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  if (sorted.length === 0) return null;

  const active = activeIndex !== null ? sorted[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sorted.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="focus-ring group relative aspect-video overflow-hidden rounded-lg border border-border bg-code-bg"
            aria-label={item.altText || item.title || `${projectTitle} screenshot ${index + 1}`}
          >
            {item.type === "IMAGE" ? (
              <Image
                src={item.url}
                alt={item.altText || item.title || projectTitle}
                fill
                sizes="(min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : item.type === "VIDEO" ? (
              <div className="flex h-full w-full items-center justify-center text-muted">
                <PlayCircleIcon className="h-8 w-8" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                {item.title || "Document"}
              </div>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title || projectTitle}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="focus-ring absolute top-4 right-4 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <XIcon className="h-6 w-6" />
          </button>

          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white sm:left-4"
              >
                <ChevronLeftIcon className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white sm:right-4"
              >
                <ChevronRightIcon className="h-7 w-7" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[80vh] w-full max-w-4xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {active.type === "IMAGE" && (
              <div className="relative h-[70vh] w-full">
                <Image
                  src={active.url}
                  alt={active.altText || active.title || projectTitle}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}
            {active.type === "VIDEO" && (
              <div className="w-full">
                <VideoEmbed url={active.url} title={active.title || projectTitle} />
              </div>
            )}
            {(active.caption || active.title) && (
              <p className="text-center text-sm text-white/80">{active.caption || active.title}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
