import { resolveVideoEmbed } from "@/lib/video";

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = resolveVideoEmbed(url);

  if (embed.kind === "youtube" || embed.kind === "vimeo") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
        <iframe
          src={embed.embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video controls className="aspect-video w-full rounded-lg border border-border bg-black" preload="metadata">
      <source src={embed.url} />
      Your browser does not support embedded video.
    </video>
  );
}
