import {
  Activity,
  BellRing,
  Blocks,
  Cable,
  LockKeyhole,
  Orbit,
  Radar,
  ServerCog,
} from "lucide-react";

export const featureCards = [
  {
    title: "Protocol you control",
    copy:
      "Channels, presence, encrypted events, publish relays, and deterministic auth without a hosted orchestration dependency.",
    icon: Cable,
  },
  {
    title: "Deploy where it makes sense",
    copy:
      "Railway for the long-lived socket server, Cloudflare for the edge runtime, Vercel for auth and publishing, desktop for local notification hubs.",
    icon: Orbit,
  },
  {
    title: "Operationally boring",
    copy:
      "Signed auth, explicit publish tokens, Redis fanout, and a control plane that tells your team what is configured instead of hiding it in env vars.",
    icon: ServerCog,
  },
  {
    title: "Encrypted where it matters",
    copy:
      "Private encrypted channels and per-channel secrets let you keep payload access inside the clients that should actually see it.",
    icon: LockKeyhole,
  },
];

export const capabilityRows = [
  {
    label: "Public channels",
    status: "shipping",
    detail: "Client subscribe, server publish, multi-instance fanout.",
  },
  {
    label: "Private and presence channels",
    status: "shipping",
    detail: "Signed subscriptions, member rosters, client events.",
  },
  {
    label: "Encrypted channels",
    status: "shipping",
    detail: "Private encrypted streams with derived secrets and client-side decryption.",
  },
  {
    label: "Vercel-side auth and publish",
    status: "shipping",
    detail: "Stateless Next.js helpers for auth routes and publish relays.",
  },
  {
    label: "Cloudflare runtime",
    status: "shipping",
    detail: "Workers plus Durable Objects for edge-native routing.",
  },
  {
    label: "Observability and admin APIs",
    status: "next",
    detail: "Usage timelines, webhooks, richer audit trails, and app-level controls.",
  },
];

export const deploymentCards = [
  {
    name: "Vercel + Railway",
    summary:
      "Best default. Use Vercel for marketing, auth, and publish endpoints. Run the websocket service on Railway.",
    icon: Radar,
  },
  {
    name: "Cloudflare edge",
    summary:
      "Best if you want globally distributed connection handling with Durable Objects and fewer always-on instances.",
    icon: Blocks,
  },
  {
    name: "Embedded desktop",
    summary:
      "Run a localhost hub inside a desktop app for rich notifications, operators consoles, or internal tooling.",
    icon: BellRing,
  },
];

export const stats = [
  { label: "Runtime targets", value: "4" },
  { label: "Shipping capabilities", value: "Presence + encrypted + relay" },
  { label: "Default auth route", value: "/realtime/auth" },
  { label: "Primary transport", value: "WebSocket" },
];

export const productNarrative = [
  "SummonFlow is for teams that want realtime infrastructure to behave like the rest of their stack: explicit, composable, and deployable on their terms.",
  "The product surface covers the client SDK, server runtimes, a publish/auth layer for stateless platforms, and the control plane you need to run apps with more than one channel name and a prayer.",
  "It is deliberately opinionated about clarity. Keys, tokens, paths, deployments, and channel policies should be visible and configurable, not buried in provider dashboards or copy-pasted snippets from 2017.",
];

export const useCases = [
  {
    title: "Product notifications",
    copy: "Transactional realtime updates, toast streams, inbox sync, and operator alerts.",
    icon: BellRing,
  },
  {
    title: "Collaborative tools",
    copy: "Presence, cursors, ephemeral member state, and fast room updates for shared editors and canvases.",
    icon: Activity,
  },
  {
    title: "Operations consoles",
    copy: "Live job events, deployment status, workflow streaming, and private operational feeds.",
    icon: Radar,
  },
];
