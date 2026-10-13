import type { Prisma } from "@prisma/client";

// Projects added after the initial seed, shared by `prisma/seed.ts` (full
// reseed) and `prisma/sync-projects.ts` (non-destructive upsert against an
// existing database, e.g. production). Facts come from Kexin Cao's résumé.

export const CHAINSILIENCE_LIVE_DEMO = {
  type: "LIVE_DEMO",
  title: "Live Demo",
  url: "https://chainsilience-ai.vercel.app",
  displayOrder: 0,
} satisfies Prisma.ProjectResourceCreateWithoutProjectInput;

export const aisleProjects: Prisma.ProjectCreateInput[] = [
  {
    title: "Aisle: Personalized Explore",
    slug: "aisle-personalized-explore",
    shortDescription:
      "A persona-driven AI shopping agent built at the Agentic Commerce Pioneers hackathon — it reorders live Shopify results for each shopper and learns which pitch actually converts.",
    category: "ARTIFICIAL_INTELLIGENCE",
    status: "COMPLETED",
    featured: true,
    published: true,
    technologies: ["LLM", "OpenRouter", "DeepSeek", "Shopify", "A/B Testing", "Recommendation Systems"],
    startDate: new Date("2026-09-01"),
    endDate: new Date("2026-09-30"),
    content: `## Overview

Built at the **Agentic Commerce Pioneers** hackathon as the LLM & Personalization Engineer on Aisle's Personalized Purchase Agent — an AI shopping agent designed to cut decision fatigue for time-strapped student shoppers.

## Approach

### Persona-driven ranking
I designed the ranking engine that reorders live Shopify results using consented user attributes — budget, student status, tech level, gender, and age — so the first few products a shopper sees are the ones most likely to fit them.

### LLM-generated pitches
Each product gets five distinct one-line pitches generated through OpenRouter/DeepSeek, one per tone:

- **Value** — why it's worth the money
- **Aspirational** — who you become with it
- **Social proof** — what others think
- **Expert** — the technical case
- **Playful** — a lighter angle

The tones were A/B tested against each other live, in production.

### Self-improving preference model
A memory model scores every pick (**+1**) and every completed purchase (**+2**), tracking conversion per tone and per persona, and continuously refines the "For You" feed from that signal.

## Lessons Learned

Personalization only earns trust when it is consented and explainable — the ranking uses attributes the shopper chose to share, and the feedback loop improves from what they actually do rather than from guesses.`,
    results: {
      create: [
        { metric: "Pitch Tones", value: "5", note: "Value, aspirational, social-proof, expert, playful", displayOrder: 0 },
        { metric: "Pick Signal", value: "+1", note: "Scored per tone and per persona", displayOrder: 1 },
        { metric: "Purchase Signal", value: "+2", note: "Completed purchases weigh double", displayOrder: 2 },
      ],
    },
  },
  {
    title: "Aisle: Recovery Engine",
    slug: "aisle-recovery-engine",
    shortDescription:
      "An MCP-based payment recovery layer for AI agents, built at the Battle of the Schools hackathon — when a tool call hits a paywall, it gets one human approval, tops up safely, and resumes the call.",
    category: "ARTIFICIAL_INTELLIGENCE",
    status: "COMPLETED",
    featured: true,
    published: true,
    technologies: ["TypeScript", "MCP", "Steel", "Stripe", "OpenRouter", "LLM Agents"],
    startDate: new Date("2026-09-01"),
    endDate: new Date("2026-09-30"),
    content: `## Overview

Built at the **Battle of the Schools** hackathon as an AI / Full-Stack Developer. Aisle is an MCP-based payment recovery system for AI agents: when an agent's tool call fails because a vendor's credits are exhausted, Aisle detects it, asks the user for a one-time purchase approval, completes the purchase, and automatically resumes the blocked tool call.

## Approach

### Detect → approve → buy → verify → replay
The gateway sits between the agent and the vendor. On an "insufficient credits" failure it works out the top-up that fixes it, asks for **one approval**, executes the purchase, verifies that the entitlement actually arrived, and replays the exact same call.

### Safety before autonomy
Letting an agent spend money only works if spending is boring and predictable:

- **Deterministic spending controls** — limits are enforced in code, never by a model
- **Signed purchase mandates** — the approved amount and target are locked in before checkout
- **Origin locking** — purchases can only happen on the vendor that was approved
- **Pre- and post-purchase verification** — prevents unauthorized, duplicate, or mismatched transactions

### Browser automation
Steel browser automation handles vendors without a purchase API, with LLM-assisted UI navigation to find the right page — while the payment step itself stays deterministic. Supported OpenRouter and Stripe test vendors, with entitlement verification and recovery replay.

## Lessons Learned

The model is good at navigating; it should never be the thing that clicks "Pay". Splitting the flow into LLM-assisted steps and deterministic steps is what made the system safe enough to demo end to end.`,
    resources: {
      create: [{ type: "GITHUB", title: "Source Code", url: "https://github.com/NoelVFX/Aisle", displayOrder: 0 }],
    },
  },
];
