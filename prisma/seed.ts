import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { aisleProjects, CHAINSILIENCE_LIVE_DEMO } from "./resume-projects";

const prisma = new PrismaClient();

// All facts below (dates, technologies, metrics, achievements) are taken
// directly from Kexin Cao's résumé. Nothing here is invented — anything not
// yet known is left as a TODO for the admin dashboard rather than guessed.

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment before seeding.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: { email: adminEmail, passwordHash, name: adminName },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Kexin Cao",
      headline: "Computer Science Student | Artificial Intelligence | Computer Vision",
      bio: "Computer Science student interested in Artificial Intelligence, Computer Vision, and software engineering. I enjoy building systems, experimenting with machine learning models, and turning ideas into working products.",
      email: "caokexin5632@gmail.com",
      githubUrl: "https://github.com/caokexin1503",
      linkedinUrl: "https://www.linkedin.com/in/kexin-cao-010905389",
      twitterUrl: null,
      websiteUrl: null,
      seoTitle: "Kexin Cao — AI & Computer Vision Portfolio",
      seoDescription:
        "Computer Science student at the University of Toronto building projects in Artificial Intelligence, Computer Vision, and software engineering.",
    },
  });
  console.log("Site settings ready.");

  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: "University of Toronto",
      degree: "Bachelor of Science, Computer Science Specialist",
      program: "Computer Science Specialist",
      location: "Toronto, Ontario",
      startDate: new Date("2025-09-01"),
      endDate: null,
      expectedGraduation: null, // TODO: set expected graduation date once confirmed
      description:
        "Cumulative GPA 3.86, Dean's List Scholar (Winter 2026). Euclid Mathematics Contest: score of 85, Honours Award.",
      courses: ["Data Structures", "Algorithm Analysis", "Linear Algebra", "Software Design"],
      displayOrder: 0,
    },
  });
  console.log("Education seeded.");

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: "SF Express",
        position: "Artificial Intelligence Intern",
        location: "Qingpu District, Shanghai, China",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-08-31"),
        current: false,
        description:
          "Customized YOLOv8 for object detection and multi-object tracking, running controlled experiments across attention modules, detection heads, and training configurations, then optimized the resulting models for deployment.",
        technologies: [
          "Python",
          "PyTorch",
          "Ultralytics",
          "YOLOv8",
          "ByteTrack",
          "CUDA",
          "Albumentations",
        ],
        achievements: [
          "Customized YOLOv8 with PyTorch/Ultralytics by integrating SE, CBAM, ECA, PSA, DCN, and dynamic convolution into C2f architectures; achieved +8 pp mAP with CBAM on a custom vision dataset.",
          "Evaluated detection heads, label assignment strategies, loss functions, optimizers, and LR schedulers using controlled experiments, identifying performance and convergence trade-offs across model configurations.",
          "Integrated ByteTrack for multi-object tracking and analyzed accuracy–latency trade-offs; identified an 18% inference-time overhead from DCN-based architectures.",
          "Applied structured/unstructured pruning and FP16 quantization, achieving 21% lower GPU memory usage and 59% higher inference throughput with negligible accuracy loss.",
          "Extended YOLOv8 to instance segmentation using YOLOv8n-seg, developed data augmentation pipelines with Albumentations and PyTorch DataLoader, evaluating flipping, rotation, scaling, and other augmentation strategies to improve model generalization.",
        ],
        displayOrder: 0,
      },
      {
        company: "UTMIST AI Squad",
        position: "Machine Learning Trainee",
        location: "Toronto, Ontario",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
        current: false,
        description: "Built a foundation in machine learning through model training, evaluation, and hands-on projects.",
        technologies: ["Python"],
        achievements: [
          "Built a foundation in machine learning through model training, evaluation, and practical hands-on projects.",
          "Collaborated with teammates and independently researched technical documentation to solve implementation challenges.",
        ],
        displayOrder: 1,
      },
      {
        company: "UTMIST Eigen AI",
        position: "Presenter — 2nd Place Team",
        location: "Toronto, Ontario",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-09-30"),
        current: false,
        description: "Presented Zero-Trust security concepts and modern network security principles to a non-technical audience.",
        technologies: [],
        achievements: [
          "Presented Zero-Trust security concepts and modern network security principles to a non-technical audience.",
        ],
        displayOrder: 2,
      },
    ],
  });
  console.log("Experience seeded.");

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { name: "Python", category: "PROGRAMMING_LANGUAGES", level: "PROFICIENT", displayOrder: 0 },
      { name: "C#", category: "PROGRAMMING_LANGUAGES", level: "PROFICIENT", displayOrder: 1 },
      { name: "Java", category: "PROGRAMMING_LANGUAGES", level: "FAMILIAR", displayOrder: 2 },
      { name: "C", category: "PROGRAMMING_LANGUAGES", level: "FAMILIAR", displayOrder: 3 },

      { name: "PyTorch", category: "AI_MACHINE_LEARNING", level: "PROFICIENT", displayOrder: 0 },
      { name: "YOLOv8 / Ultralytics", category: "AI_MACHINE_LEARNING", level: "PROFICIENT", displayOrder: 1 },
      { name: "Machine Learning", category: "AI_MACHINE_LEARNING", level: "PROFICIENT", displayOrder: 2 },

      { name: "Computer Vision", category: "COMPUTER_VISION", level: "PROFICIENT", displayOrder: 0 },

      { name: "Unity", category: "GAME_DEVELOPMENT", level: "FAMILIAR", displayOrder: 0 },

      { name: "GitHub", category: "DEVELOPER_TOOLS", level: "PROFICIENT", displayOrder: 0 },
      { name: "VS Code", category: "DEVELOPER_TOOLS", level: "PROFICIENT", displayOrder: 1 },
      { name: "Anaconda", category: "DEVELOPER_TOOLS", level: "FAMILIAR", displayOrder: 2 },
      { name: "PyCharm", category: "DEVELOPER_TOOLS", level: "FAMILIAR", displayOrder: 3 },
      { name: "IntelliJ", category: "DEVELOPER_TOOLS", level: "FAMILIAR", displayOrder: 4 },

      { name: "Object-Oriented Programming", category: "OTHER", level: "PROFICIENT", displayOrder: 0 },
      { name: "Data Structures & Algorithms", category: "OTHER", level: "PROFICIENT", displayOrder: 1 },
    ],
  });
  console.log("Skills seeded.");

  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      title: "YOLOv8 Object Detection & Multi-Object Tracking Optimization",
      slug: "yolov8-object-detection-optimization",
      shortDescription:
        "Customized YOLOv8 with attention modules and dynamic convolution, then optimized it for deployment with pruning and FP16 quantization.",
      category: "COMPUTER_VISION",
      status: "COMPLETED",
      featured: true,
      published: true,
      technologies: [
        "Python",
        "PyTorch",
        "Ultralytics",
        "YOLOv8",
        "ByteTrack",
        "CUDA",
        "Albumentations",
      ],
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-08-31"),
      content: `## Overview

During an Artificial Intelligence internship at SF Express, I customized the YOLOv8 object detection architecture and optimized it for real-world deployment, working on both accuracy improvements and inference efficiency.

## Motivation

Off-the-shelf YOLOv8 needed to be adapted to a custom vision dataset and deployment environment. The goal was to systematically explore architectural and training changes rather than apply defaults blindly.

## Approach

I integrated several attention and convolution modules — **SE**, **CBAM**, **ECA**, **PSA**, **DCN**, and dynamic convolution — into the C2f blocks of the YOLOv8 backbone, then ran controlled experiments across:

- Detection heads
- Label assignment strategies
- Loss functions
- Optimizers
- Learning rate schedulers

to understand performance and convergence trade-offs across configurations.

For tracking, I integrated **ByteTrack** for multi-object tracking on top of the detector and analyzed the resulting accuracy–latency trade-offs.

To make the model deployment-ready, I applied structured and unstructured **pruning** together with **FP16 quantization**. I also extended the pipeline to instance segmentation using **YOLOv8n-seg**, building a data augmentation pipeline with **Albumentations** and PyTorch's \`DataLoader\` (flipping, rotation, scaling, and other transforms) to improve generalization.

## Results

CBAM attention gave the largest accuracy gain of the attention variants tested, at some latency cost from the DCN-based architectures. Pruning and FP16 quantization substantially reduced memory footprint and increased throughput with negligible accuracy loss (see the Results panel below for exact figures).

## Challenges

Balancing accuracy gains from heavier attention/convolution modules (like DCN) against their inference-time cost was the central trade-off — the most accurate configuration was not the fastest one.

## Lessons Learned

Controlled, isolated experiments (changing one architectural component at a time) were essential to attribute accuracy and latency changes correctly, rather than confounding multiple simultaneous changes.

## Future Improvements

- Explore INT8 quantization on top of the existing FP16 pipeline
- Benchmark on additional edge hardware targets
- Expand the instance segmentation evaluation to a larger custom dataset

## Availability

This project was developed as part of a corporate internship, so the source code and dataset are proprietary and not publicly available.`,
      results: {
        create: [
          { metric: "mAP (CBAM)", value: "+8 pp", note: "On a custom vision dataset", displayOrder: 0 },
          { metric: "Inference Latency (DCN)", value: "+18%", note: "Overhead introduced by DCN-based architectures", displayOrder: 1 },
          { metric: "GPU Memory Usage", value: "-21%", note: "After structured/unstructured pruning + FP16 quantization", displayOrder: 2 },
          { metric: "Inference Throughput", value: "+59%", note: "After FP16 quantization, with negligible accuracy loss", displayOrder: 3 },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Measuring Influence & Information Dissemination in a Fashion Influencer Network",
      slug: "social-network-influence-analysis",
      shortDescription:
        "A team project modeling a fashion-influencer Instagram network as a similarity graph, then simulating how quickly information spreads from different types of influencers.",
      category: "DATA_SCIENCE",
      status: "COMPLETED",
      featured: false,
      published: true,
      technologies: ["Python", "NetworkX", "Matplotlib", "Plotly"],
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-03-31"),
      content: `## Overview

A team project (with Ka Woon Ho, Xia Mo, and Haotian Shi) modeling a network of Instagram fashion influencers as a graph, to study who is actually most "influential" and how quickly information spreads from different starting points in the network.

## Motivation

Influence on social media isn't just follower count — some accounts bridge otherwise-disconnected communities, while others sit inside tightly-connected clusters. We wanted to model a real influencer network and test whether the most popular accounts are actually the fastest way to spread information, or whether structural position in the network matters more.

## Approach

We modeled the network as a bidirectional graph, with each vertex representing an influencer's account (drawn from a public Instagram fashion-influencer dataset, downsampled to the top 500 most-followed accounts for tractable experiments). Rather than modeling explicit follow relationships — which the available dataset didn't capture — we connected influencers by a **similarity score** based on the difference in their follower, followee, and post counts, on the assumption that similarly-sized accounts are more likely to share information with each other directly. Each influencer is connected to its *k* most similar neighbors.

We computed two influence metrics per account — **popularity** (follower count) and **degree** (number of edges) — normalized and ranked with a merge sort. To simulate information spread, we ran a **BFS-based diffusion model** from four different starting points: the highest-popularity influencer, the lowest-popularity influencer, the highest-degree influencer, and a medium-popularity influencer, recording what percentage of the network had been "informed" at each time step.

## Implementation

The graph and its algorithms were built from scratch: a \`data_loader\` module parses the CSV dataset into vertices with follower/followee/post metadata; \`build_influence_edges()\` computes pairwise similarity scores and wires up each vertex's *k* nearest neighbors; \`popularity_scores\`/\`degree_scores\` compute and normalize the two influence metrics; a BFS \`shortest_path()\` method finds shortest paths between any two accounts; and a recursive \`spread_over_time\` simulation models diffusion layer-by-layer until the whole reachable network is informed. Results are visualized with Matplotlib (distributions, diffusion curves) and both static and interactive (Plotly) NetworkX graphs.

## Results

- Starting from the **highest-degree** influencer reached the entire network in 63 steps — fast and steady.
- Starting from the **least popular** influencer was nearly identical (64 steps), since it sat close to the highest-degree hub.
- Starting from the **most popular** influencer was the *slowest* (66 steps): it started almost flat, because highly popular accounts turned out to have very few edges — they aren't similar to many other accounts.
- Starting from a **medium-popularity** influencer was the fastest of all (49 steps) — it began slowly but accelerated sharply once the diffusion reached the network's well-connected core.
- The shortest path between the single least- and most-popular influencer in the 500-node network was 65 steps.

The headline finding: raw popularity is a poor predictor of how fast an account can spread information. Degree (structural connectivity) mattered far more than follower count.

## Limitations

We originally planned to build the graph from real follow relationships, but couldn't obtain a dataset containing them, so edges are based on similarity in account statistics instead. That's a reasonable proxy for "likely to share information," but it doesn't capture actual one-to-many follower dissemination (e.g., an influencer's story being seen and reshared by their followers).

## Ethical Considerations

If popularity isn't what drives fast information spread, the same mechanism that helps information travel quickly can just as easily accelerate misinformation — and a moderately-popular, well-connected account may be a more effective vector for it than a single celebrity account. Combined with engagement-based ranking algorithms on real platforms, this is worth taking seriously.

## Future Improvements

- Model how platform recommendation algorithms (e.g. engagement-based ranking) interact with organic diffusion — a decision tree could approximate that boosting behavior
- TODO: add source code link`,
      results: {
        create: [
          { metric: "Highest-Degree Start", value: "63 steps", note: "To reach 100% of the network", displayOrder: 0 },
          { metric: "Medium-Popularity Start", value: "49 steps", note: "Fastest of all four starting points", displayOrder: 1 },
          { metric: "Highest-Popularity Start", value: "66 steps", note: "Slowest — few edges despite high follower count", displayOrder: 2 },
          { metric: "Least → Most Popular", value: "65 steps", note: "Shortest path across a 500-node network", displayOrder: 3 },
        ],
      },
      resources: {
        create: [
          {
            type: "DOCUMENTATION",
            title: "Technical Report (PDF)",
            url: "/uploads/projects/document/social-network-influence-analysis-report.pdf",
            displayOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Independent Unity Game Project",
      slug: "independent-unity-game-project",
      shortDescription: "A personal Unity game project with original gameplay mechanics, interactive systems, and event-driven C# logic.",
      category: "GAME_DEVELOPMENT",
      status: "IN_PROGRESS",
      featured: true,
      published: true,
      technologies: ["C#", "Unity"],
      startDate: new Date("2026-01-01"),
      endDate: null,
      content: `## Overview

An ongoing personal Unity project, designed and developed independently.

## Approach

The game uses object-oriented C# to build maintainable, event-driven game logic, with Unity's engine features handling gameplay mechanics, interactive systems, and asset integration.

## Status

This project is still in progress — gameplay systems and content are being actively expanded.

## Future Improvements

- TODO: add screenshots and a gameplay demo video as the project progresses
- TODO: add downloadable build once a playable milestone is ready`,
    },
  });

  await prisma.project.create({
    data: {
      title: "Chainsilience AI",
      slug: "chainsilience-ai",
      shortDescription:
        "An AI-powered supply-chain resilience platform — built with a team of 4 for IDSOL2026 — that detects external disruptions and turns them into traceable, human-approved response actions.",
      category: "ARTIFICIAL_INTELLIGENCE",
      status: "IN_PROGRESS",
      featured: true,
      published: true,
      technologies: [
        "Python",
        "LangChain",
        "FAISS",
        "Sentence Transformers",
        "BM25",
        "LLM Agents",
        "Knowledge Graph",
      ],
      content: `## Overview

Chainsilience AI is a supply-chain risk intelligence platform I developed alongside a team of four for IDSOL2026, aimed at helping SMEs, startups, and semiconductor companies detect, assess, and respond to external disruptions — geopolitical events, tariffs, export restrictions, natural disasters, shipping disruptions, material shortages — before they become costly operational problems.

## Approach

The platform models supply chains with a **knowledge graph** and a **digital twin**, used for mapping supply-chain paths, disruption detection, impact simulation, risk scoring, and mitigation strategies.

For retrieval, I built a hybrid RAG pipeline using **LangChain**, combining **FAISS** vector search and sentence-transformer embeddings with **BM25** keyword retrieval, so relevant signals aren't missed by either approach alone. LLM agents sit on top of that retrieval layer to judge news relevance, verify claims, reason about risk, and generate recommendations.

## Design Philosophy: Auditable, Not a Black Box

The system is built around a human-in-the-loop workflow, not full automation. AI agents gather and analyze external information, connect disruptions to the specific supply-chain dependencies they affect, assess potential business impact, and generate recommended response actions and draft communications — all for human review and approval before anything happens.

A core focus of the project is making AI-generated decisions traceable: every recommendation is backed by its underlying evidence and structured into an actionable workflow, so a decision-maker can see *why* an alert matters and what to do about it, rather than trusting an opaque score.

## Team & Traction

Built with a team of four; the platform was piloted with a real company during development.

## Future Improvements

- Integrate approved workflows with enterprise communication systems (e.g. Gmail) for AI-assisted execution while keeping a human in the approval loop

## Try It

The platform is live at [chainsilience-ai.vercel.app](https://chainsilience-ai.vercel.app).`,
      resources: {
        create: [CHAINSILIENCE_LIVE_DEMO],
      },
    },
  });

  for (const project of aisleProjects) {
    await prisma.project.create({ data: project });
  }

  console.log("Projects seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
