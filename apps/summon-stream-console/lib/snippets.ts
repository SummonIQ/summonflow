import type { StreamApp } from "./mock-data";

export function clientSnippet(app: StreamApp) {
  return `import SummonStream from "summon-stream";

const stream = new SummonStream("${app.appKey}", {
  wsHost: "${app.host}",
  wsPath: "${app.websocketPath}",
  forceTLS: true,
  channelAuthorization: {
    endpoint: "${app.authPath}",
  },
});
`;
}

export function serverSnippet(app: StreamApp) {
  return `import { authorizeSubscription } from "summon-stream-server-vercel";

return authorizeSubscription({
  appKey: "${app.appKey}",
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

export function publishSnippet(app: StreamApp) {
  return `await fetch("https://${app.host}${app.publishPath}", {
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
