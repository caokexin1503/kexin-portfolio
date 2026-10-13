"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Artwork } from "@/data/philosophers";

/**
 * Gallery-style backdrop for a philosopher scene: the painting is shown whole
 * (object-contain) in the space left of the detail panel, over a blurred,
 * darkened copy of itself so the frame never feels letterboxed. On mobile the
 * panel is a bottom sheet, so the painting sits in the top third instead.
 *
 * `unoptimized`: the browser loads Wikimedia's own pre-sized thumbnail
 * directly — routing it through Next's image optimizer gets rate-limited (429)
 * by Wikimedia's servers.
 */
export function ArtworkBackdrop({ artwork }: { artwork: Artwork }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0b08]">
      <Image
        src={artwork.src}
        alt=""
        fill
        unoptimized
        className="scale-110 object-cover opacity-35 blur-2xl"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/60" />

      <motion.div
        key={artwork.src}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-x-5 top-16 h-[30vh] sm:inset-x-auto sm:top-20 sm:bottom-32 sm:left-10 sm:h-auto sm:right-[calc(28rem+2.5rem)]"
      >
        <Image
          src={artwork.src}
          alt={`${artwork.title} by ${artwork.artist}`}
          fill
          priority
          unoptimized
          className="object-contain [filter:drop-shadow(0_24px_48px_rgba(0,0,0,0.6))]"
        />
      </motion.div>
    </div>
  );
}

export function ArtworkCaption({ artwork }: { artwork: Artwork }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="pointer-events-auto absolute top-6 right-5 left-16 z-10 text-white/80 sm:top-auto sm:right-auto sm:bottom-10 sm:left-10 sm:max-w-[calc(100vw-33rem)]"
    >
      <p className="font-serif-display truncate text-base italic sm:text-xl">{artwork.title}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-white/50 uppercase">
        {artwork.artist} · {artwork.year} ·{" "}
        <a
          href={artwork.source}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring underline decoration-white/20 underline-offset-2 hover:text-white/80"
        >
          Public domain
        </a>
      </p>
    </motion.div>
  );
}
