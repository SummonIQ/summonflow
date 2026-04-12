const PLATFORM_HOST = "realtime.summonflow.com";

interface AppSnippetInput {
  key: string;
  name: string;
}

export function clientSnippet(app: AppSnippetInput) {
  return `import SummonFlow from "@summoniq/summon-flow";

const stream = new SummonFlow("${app.key}", {
  // wsHost defaults to ${PLATFORM_HOST} on the managed platform.
  // Only set this if you're self-hosting the socket server.
  channelAuthorization: {
    endpoint: "/api/realtime/auth",
  },
});
`;
}

export function serverSnippet(app: AppSnippetInput) {
  return `import { authorizeSubscription } from "summon-flow-server-vercel";

return authorizeSubscription({
  appKey: "${app.key}",
  secret: process.env.SUMMON_STREAM_APP_SECRET!,
  socketId,
  channelName,
  userData: {
    memberId: "user-123",
    memberInfo: { role: "operator" },
  },
});
`;
}

export function publishSnippet(app: AppSnippetInput) {
  return `await fetch("https://${PLATFORM_HOST}/apps/${app.key}/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${process.env.SUMMON_STREAM_PUBLISH_TOKEN}\`,
  },
  body: JSON.stringify({
    channel: "presence-ops-room",
    event: "incident-opened",
    data: { severity: "high" },
    userId: "ops-17",
  }),
});
`;
}
