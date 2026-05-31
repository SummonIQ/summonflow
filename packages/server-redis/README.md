# @summoniq/summonflow-server-redis

Redis pubsub adapter for `@summoniq/summonflow-server-node`.

This is the cost-effective scaling path:

- run the websocket server on Railway/Render/Fly
- use Redis pubsub for cross-instance fanout
- let Vercel publish into Redis using its Upstash Redis integration

## Install

```bash
npm install @summoniq/summonflow-server-redis redis
```

## Usage

```ts
import { createRedisPubSubAdapter } from "@summoniq/summonflow-server-redis";
import { createSummonStreamNodeServer } from "@summoniq/summonflow-server-node";

const pubSub = await createRedisPubSubAdapter({
  redisUrl: process.env.REDIS_URL!,
});

const attached = await createSummonStreamNodeServer({
  app: {
    key: process.env.SUMMONFLOW_APP_KEY!,
    secret: process.env.SUMMONFLOW_APP_SECRET!,
  },
  pubSub,
});
```

## Channel naming

By default the adapter uses `summonflow:events`.
