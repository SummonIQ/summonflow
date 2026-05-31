# @summoniq/summonflow-server-sdk

`@summoniq/summonflow-server-sdk` provides server-side helpers for subscription auth and event publishing.

Use it when your backend needs to:

- sign private or presence channel subscriptions
- expose an auth endpoint for the client package
- publish events to a SummonFlow-compatible server
- fan events out over Redis from serverless or edge runtimes

## Install

```bash
npm install @summoniq/summonflow-server-sdk
```

## Sign a subscription

```ts
import { signSubscription } from "@summoniq/summonflow-server-sdk";

const auth = signSubscription({
  appKey: process.env.SUMMONFLOW_APP_KEY!,
  secret: process.env.SUMMONFLOW_APP_SECRET!,
  socketId,
  channelName,
  userData: {
    memberId: "user-123",
    memberInfo: { role: "operator" },
  },
});
```

## Create an auth handler

```ts
import { createAuthHandler } from "@summoniq/summonflow-server-sdk";

export const POST = createAuthHandler({
  appKey: process.env.SUMMONFLOW_APP_KEY!,
  secret: process.env.SUMMONFLOW_APP_SECRET!,
  authorize: async (_request, context) => {
    return {
      ok: true,
      userData: {
        memberId: "user-123",
        memberInfo: { channel: context.channelName },
      },
    };
  },
});
```

## Publish an event

```ts
import { publishToSummonFlow } from "@summoniq/summonflow-server-sdk";

await publishToSummonFlow({
  baseUrl: "https://realtime.example.com",
  appKey: process.env.SUMMONFLOW_APP_KEY!,
  publishToken: process.env.SUMMONFLOW_PUBLISH_TOKEN!,
  channel: "presence-room",
  event: "message-created",
  data: { text: "hello" },
});
```

## Publish over Redis

```ts
import { publishToSummonFlowViaRedis } from "@summoniq/summonflow-server-sdk";

await publishToSummonFlowViaRedis({
  channel: "presence-room",
  event: "message-created",
  data: { text: "hello" },
});
```
