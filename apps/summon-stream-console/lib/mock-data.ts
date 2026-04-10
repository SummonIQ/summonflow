export type DeploymentTarget = "railway" | "cloudflare" | "vercel" | "embedded";

export type StreamApp = {
  id: string;
  name: string;
  environment: string;
  appKey: string;
  publishToken: string;
  authPath: string;
  publishPath: string;
  websocketPath: string;
  deployment: DeploymentTarget[];
  host: string;
  mode: "production" | "staging";
  features: {
    presence: boolean;
    encryptedChannels: boolean;
    clientEvents: boolean;
    redisFanout: boolean;
    analytics: boolean;
  };
  notes: string;
};

export const streamApps: StreamApp[] = [
  {
    id: "live-core",
    name: "SummonStream Live",
    environment: "production",
    appKey: "summon-stream-live",
    publishToken: "••••••••••••f49d2c",
    authPath: "/realtime/auth",
    publishPath: "/apps/summon-stream-live/events",
    websocketPath: "/app",
    deployment: ["railway", "vercel", "cloudflare"],
    host: "summon-stream-websocket-production.up.railway.app",
    mode: "production",
    features: {
      presence: true,
      encryptedChannels: true,
      clientEvents: true,
      redisFanout: true,
      analytics: false,
    },
    notes:
      "Primary production app. Vercel signs subscriptions and publishes events; Railway owns long-lived sockets.",
  },
  {
    id: "desktop-ops",
    name: "Desktop Ops Relay",
    environment: "internal",
    appKey: "desktop-ops",
    publishToken: "••••••••••••b7a1e4",
    authPath: "/realtime/auth",
    publishPath: "/apps/desktop-ops/events",
    websocketPath: "/app",
    deployment: ["embedded"],
    host: "127.0.0.1:4317",
    mode: "staging",
    features: {
      presence: true,
      encryptedChannels: false,
      clientEvents: true,
      redisFanout: false,
      analytics: false,
    },
    notes:
      "Local notification relay for desktop tooling and ops consoles where a localhost hub makes sense.",
  },
  {
    id: "applab-desktop",
    name: "AppLab Desktop",
    environment: "production",
    appKey: "summon-stream-live",
    publishToken: "••••••••••••f49d2c",
    authPath: "/api/realtime/auth",
    publishPath: "/apps/summon-stream-live/events",
    websocketPath: "/app",
    deployment: ["railway", "vercel"],
    host: "summon-stream-websocket-production.up.railway.app",
    mode: "production",
    features: {
      presence: true,
      encryptedChannels: true,
      clientEvents: true,
      redisFanout: true,
      analytics: true,
    },
    notes:
      "Integrated into the AppLab Desktop application for real-time project updates, Kanban sync, and live agent activity tracking.",
  },
];

export const supportedFeatures = [
  {
    title: "Shipping now",
    items: [
      "Public, private, presence, and private encrypted channels",
      "Client events and server-triggered broadcasts",
      "Vercel auth and publish helpers",
      "Railway, Cloudflare, and embedded runtimes",
      "Redis pubsub adapter seam for fanout",
    ],
  },
  {
    title: "Add next",
    items: [
      "Team accounts and RBAC",
      "Usage metering and billing plans",
      "Webhook delivery history",
      "Per-app analytics and audit trails",
      "Rate limits and quotas",
    ],
  },
];

export const channelPolicies = [
  {
    name: "presence-ops-room",
    purpose: "Operator collaboration and incident signaling",
    auth: "member-bound",
    encryption: "optional",
    events: ["incident-opened", "client-typing", "member-joined"],
  },
  {
    name: "private-encrypted-customer-feed",
    purpose: "Sensitive customer-specific status stream",
    auth: "token + member",
    encryption: "required",
    events: ["sync-progress", "invoice-ready", "agent-note"],
  },
  {
    name: "public-status-board",
    purpose: "Low-friction public status and rollout feed",
    auth: "none",
    encryption: "none",
    events: ["release-shipped", "maintenance-window", "service-restored"],
  },
];

export type ActiveChannel = {
  name: string;
  type: "public" | "private" | "presence" | "encrypted";
  members: number;
  uptime: string;
  lastEvent: string;
  app: string;
  status: "active" | "idle";
};

export const activeChannels: ActiveChannel[] = [
  {
    name: "project-applab-desktop",
    type: "presence",
    members: 12,
    uptime: "4h 22m",
    lastEvent: "member-joined",
    app: "AppLab Desktop",
    status: "active",
  },
  {
    name: "notifications-global",
    type: "public",
    members: 1420,
    uptime: "12d 5h",
    lastEvent: "broadcast-sent",
    app: "SummonStream Live",
    status: "active",
  },
  {
    name: "room-vault-77",
    type: "encrypted",
    members: 2,
    uptime: "15m",
    lastEvent: "message-sent",
    app: "SummonStream Live",
    status: "active",
  },
  {
    name: "internal-ops-relay",
    type: "private",
    members: 4,
    uptime: "1h 10m",
    lastEvent: "client-event",
    app: "Desktop Ops Relay",
    status: "idle",
  },
];

export const integrationCards = [
  {
    name: "Next.js on Vercel",
    summary:
      "Use stateless route handlers for subscription signing and publish relays. Works cleanly with the Vercel helper package.",
    status: "shipping",
  },
  {
    name: "Railway socket service",
    summary:
      "Run the long-lived Node runtime with app keys, publish tokens, and Redis fanout for the production websocket edge.",
    status: "shipping",
  },
  {
    name: "Cloudflare edge runtime",
    summary:
      "Use Durable Objects when you want edge-native connection placement and lighter always-on infrastructure.",
    status: "shipping",
  },
  {
    name: "Managed billing and quotas",
    summary:
      "Natural next layer once you want to sell the service rather than just operate it for your own products.",
    status: "next",
  },
];

export function getApp(id: string) {
  return streamApps.find((app) => app.id === id) ?? streamApps[0];
}
