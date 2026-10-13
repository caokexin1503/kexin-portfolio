import { PrismaClient } from "@prisma/client";
import { aisleProjects, CHAINSILIENCE_LIVE_DEMO } from "./resume-projects";

const prisma = new PrismaClient();

// Non-destructive counterpart to `prisma/seed.ts`: adds the projects from
// `prisma/resume-projects.ts` to an existing database without wiping anything
// edited through the admin dashboard. Safe to run more than once.
//   npm run db:sync-projects

async function main() {
  for (const { slug, title, ...rest } of aisleProjects) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Skipped (already exists): ${slug}`);
      continue;
    }
    await prisma.project.create({ data: { slug, title, ...rest } });
    console.log(`Created: ${slug}`);
  }

  const chainsilience = await prisma.project.findUnique({
    where: { slug: "chainsilience-ai" },
    include: { resources: true },
  });
  if (!chainsilience) {
    console.log("Chainsilience AI project not found — skipped live demo link.");
  } else if (chainsilience.resources.some((r) => r.url === CHAINSILIENCE_LIVE_DEMO.url)) {
    console.log("Chainsilience AI live demo link already present.");
  } else {
    await prisma.projectResource.create({
      data: { ...CHAINSILIENCE_LIVE_DEMO, projectId: chainsilience.id },
    });
    console.log("Added Chainsilience AI live demo link.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
