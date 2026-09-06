import { cache } from "react";
import { prisma } from "@/lib/db";

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;

  // Fallback shape used only if the database hasn't been seeded yet.
  return {
    id: "singleton",
    name: "Kexin Cao",
    headline: "Computer Science Student | Artificial Intelligence | Computer Vision",
    bio: "",
    email: "caokexin5632@gmail.com",
    githubUrl: null as string | null,
    linkedinUrl: null as string | null,
    twitterUrl: null as string | null,
    websiteUrl: null as string | null,
    profilePhoto: null as string | null,
    seoTitle: "Kexin Cao — Portfolio",
    seoDescription: "Computer Science student portfolio.",
    favicon: null as string | null,
    updatedAt: new Date(),
  };
});
