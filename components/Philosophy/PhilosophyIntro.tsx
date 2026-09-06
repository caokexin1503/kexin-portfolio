"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";

/**
 * The narrative entry point into the portfolio: sits above the regular
 * project grid on /projects. Deliberately styled independently of the
 * site's light/dark toggle — this is meant to feel like a distinct,
 * museum-like space you step into, not a themed page section.
 */
export function PhilosophyIntro() {
  return (
    <section className="bg-grain relative overflow-hidden bg-[#0c0c0d] py-28 text-[#f3f1ea] sm:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(243,241,234,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 40%, black 30%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 font-mono text-xs tracking-[0.3em] text-[#a3a3a3] uppercase"
        >
          A Philosophy Timeline
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif-display text-4xl leading-[1.1] font-medium text-balance italic sm:text-6xl"
        >
          What is the meaning of life?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 max-w-lg text-base leading-relaxed text-[#b7b5ad] sm:text-lg"
        >
          For thousands of years, humans have asked the same question: why are
          we here? This is a walk through 2,500 years of answers — and where
          my own work fits into it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12"
        >
          <Link
            href="/projects/philosophy"
            className="focus-ring group inline-flex items-center gap-2 border-b border-[#f3f1ea]/30 pb-1 text-sm font-medium tracking-wide text-[#f3f1ea] uppercase transition-colors hover:border-[#f3f1ea]"
          >
            Explore the Timeline
            <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
