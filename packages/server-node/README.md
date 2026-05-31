# @summoniq/summonflow-server-node

`@summoniq/summonflow-server-node` is the self-hosted Node.js server pair for `@summoniq/summonflow-client-sdk`.

It exposes a small realtime runtime:

- WebSocket endpoint at `/app/:key`
- auth endpoint helper at `/realtime/auth`
- optional publish endpoint at `/apps/:key/events`
- public, private, and presence channels
- private encrypted channels
- client events
- server-triggered broadcasts
- HMAC auth signing for private and presence subscriptions
- pluggable pubsub adapter boundary for multi-instance fanout

## Install

```bash
npm install @summoniq/summonflow-server-node ws
```

## Quick start

```ts
import { createSummonStreamNodeServer } from "@summoniq/summonflow-server-node";

const { server } = await createSummonStreamNodeServer({
  app: {
    key: "local-app-key",
    secret: "local-app-secret",
    encryptionMasterKeyBase64: process.env.SUMMONFLOW_ENCRYPTION_MASTER_KEY_BASE64,
  },
  authorize: ({ channelName }) => {
    if (channelName.startsWith("private-")) {
      return { ok: true };
    }

    if (channelName.startsWith("presence-")) {
      return {
        ok: true,
        userData: {
          memberId: "user-123",
          memberInfo: { name: "Ada" },
        },
      };
    }

    return { ok: true };
  },
});

server.listen(6001);
```

## Generic host bootstrap

For platform-agnostic deployments (Railway, Fly, Render, Docker, bare VM), use the env-driven host:

```ts
import { startSummonFlowNodeServer } from "@summoniq/summonflow-server-node/host";

await startSummonFlowNodeServer();
```

Required env: `SUMMONFLOW_APP_KEY`, `SUMMONFLOW_APP_SECRET`. Optional: `PORT`, `SUMMONFLOW_WS_PATH`, `SUMMONFLOW_AUTH_PATH`, `SUMMONFLOW_PUBLISH_PATH`, `SUMMONFLOW_PUBLISH_TOKEN`, `SUMMONFLOW_ACTIVITY_TIMEOUT_SECONDS`.

## Embedded (in-process) server

For tests or desktop-embedded usage, spin up the server programmatically and get back resolved URLs:

```ts
import { createEmbeddedSummonFlowServer } from "@summoniq/summonflow-server-node/embedded";

const embedded = await createEmbeddedSummonFlowServer({
  app: { key: "local-app-key", secret: "local-app-secret" },
});

console.log(embedded.wsUrl, embedded.authUrl, embedded.publishUrl);
```

## Manual auth endpoint

If you already have an HTTP server, use `new SummonStreamServer(...).attach(server)` and mount:

```ts
const realtime = new SummonStreamServer({
  app: { key: "local-app-key", secret: "local-app-secret" },
  authorize: ({ channelName }) => ({ ok: !channelName.includes("forbidden") }),
});

realtime.attach(server);

server.on("request", async (req, res) => {
  if (req.url === "/realtime/auth") {
    await realtime.createNodeAuthHandler()(req, res);
  }
});
```

## Server publishes

```ts
realtime.publish("public-chat", "message-created", {
  id: "msg_1",
  text: "hello",
});
```

For encrypted channels, publish to `private-encrypted-*` and the server will encrypt payloads with a per-channel secret derived from `encryptionMasterKeyBase64`.

## HTTP publish relay

If you want stateless platforms like Vercel to emit realtime events without hosting the websocket server, enable a publish token and send:

```http
POST /apps/:key/events
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "channel": "presence-room",
  "event": "message-created",
  "data": { "text": "hello" }
}
```

## Package family

- `@summoniq/summonflow-client-sdk`: browser/Node client
- `@summoniq/summonflow-server-sdk`: stateless auth + publish helpers (Vercel, edge runtimes)
- `@summoniq/summonflow-server-node`: this package — self-hosted Node websocket server
- `@summoniq/summonflow-server-cloudflare`: Worker + Durable Object runtime
- `@summoniq/summonflow-server-redis`: Redis pubsub adapter for multi-instance fanout

## Multi-instance fanout

The core server accepts a `pubSub` adapter with this shape:

```ts
{
  publish(envelope) {}
  subscribe(handler) { return unsubscribe }
}
```

Use `createInMemoryPubSubAdapter()` for local development or testing, and plug in Redis/NATS/etc. via `@summoniq/summonflow-server-redis` without changing the websocket server surface.

## Low-level subscription signing

```ts
import { authorizeSubscription } from "@summoniq/summonflow-server-node";

const authorization = authorizeSubscription({
  appKey: "local-app-key",
  secret: "local-app-secret",
  socketId: "123.456",
  channelName: "presence-room",
  userData: {
    memberId: "user-123",
    memberInfo: { name: "Ada" },
  },
});
```
