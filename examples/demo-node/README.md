# summonflow-demo-node

Generic Node.js websocket service demo for SummonFlow. Suitable for Railway, Fly, Render, Docker, or any host that runs long-lived Node processes.

## Environment

```env
PORT=8080

SUMMONFLOW_APP_KEY=local-app-key
SUMMONFLOW_APP_SECRET=local-app-secret
SUMMONFLOW_ENCRYPTION_MASTER_KEY_BASE64=optional-base64-32-byte-key

SUMMONFLOW_WS_PATH=/app
SUMMONFLOW_AUTH_PATH=/realtime/auth
SUMMONFLOW_PUBLISH_PATH=/apps/local-app-key/events
SUMMONFLOW_PUBLISH_TOKEN=optional-token
SUMMONFLOW_ACTIVITY_TIMEOUT_SECONDS=120

# Optional, only needed for multi-instance fanout or Vercel publish via Redis
REDIS_URL=redis://...
```

## Run

The demo references `@summoniq/summonflow-server-node` and `@summoniq/summonflow-server-redis` via local file paths. Build the packages first:

```bash
# from the summonflow repo root
cd packages/server-node && npm install && npm run build
cd ../server-redis && npm install && npm run build
```

Then run the demo:

```bash
cd examples/demo-node
npm install
npm run build
npm start
```

## Deployment shape

- Always-on Node host runs this process continuously
- Redis is optional and only needed for multi-instance fanout
- Vercel publishes into Redis and authenticates channels via `@summoniq/summonflow-server-sdk`
