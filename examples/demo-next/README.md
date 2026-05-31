# summonflow-demo-next

Next.js App Router demo for the Vercel side of the SummonFlow stack.

It demonstrates:

- `POST /api/realtime/auth` for private and presence auth
- `POST /api/realtime/publish` for Upstash Redis-backed publish
- client-side subscriptions using `@summoniq/summonflow-client-sdk`

## Environment

```env
NEXT_PUBLIC_SUMMONFLOW_APP_KEY=local-app-key
SUMMONFLOW_APP_SECRET=local-app-secret

NEXT_PUBLIC_SUMMONFLOW_WS_HOST=your-node-host.example.com
NEXT_PUBLIC_SUMMONFLOW_FORCE_TLS=true
NEXT_PUBLIC_SUMMONFLOW_WSS_PORT=443
NEXT_PUBLIC_SUMMONFLOW_WS_PATH=/app

NEXT_PUBLIC_SUMMONFLOW_AUTH_PATH=/api/realtime/auth
NEXT_PUBLIC_SUMMONFLOW_DEFAULT_CHANNEL=presence-demo-room

UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
SUMMONFLOW_REDIS_CHANNEL=summonflow:events
```

## Run

The demo references `@summoniq/summonflow-client-sdk` and `@summoniq/summonflow-server-sdk` via local file paths. Build the packages first:

```bash
# from the summonflow repo root
cd packages/client-sdk && npm install && npm run build
cd ../server-sdk && npm install && npm run build
```

Then run the demo:

```bash
cd examples/demo-next
npm install
npm run dev
```
