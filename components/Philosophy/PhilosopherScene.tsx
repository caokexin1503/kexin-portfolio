"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import type { Philosopher } from "@/data/philosophers";
import { HistoricalMap } from "@/components/Philosophy/HistoricalMap";
import { PhilosopherPanel } from "@/components/Philosophy/PhilosopherPanel";
import type { PhilosophyProjectSummary } from "@/components/Philosophy/PhilosophyProjectCard";

export function PhilosopherScene({
  philosopher,
  project,
  onClose,
}: {
  philosopher: Philosopher | null;
  project?: PhilosophyProjectSummary;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!philosopher) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [philosopher, onClose]);

  return (
    <AnimatePresence>
      {philosopher && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50"
        >
          <button
            type="button"
            aria-label="Close philosopher view"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default"
          >
            <HistoricalMap region={philosopher.region} era={philosopher.era} location={philosopher.location} />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring absolute top-5 left-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm hover:bg-black/60 hover:text-white sm:top-6 sm:left-6"
          >
            <XIcon className="h-4 w-4" />
          </button>

          <PhilosopherPanel philosopher={philosopher} project={project} open={Boolean(philosopher)} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
