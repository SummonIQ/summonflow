# @summoniq/summonflow-server-cloudflare

Cloudflare Worker + Durable Object runtime for SummonFlow.

This is the edge-native alternative to the Node server:

- `/app/:key` websocket upgrades terminate in a Durable Object
- `/realtime/auth` signs private and presence channel auth responses
- `/apps/:key/events` publishes events from stateless Worker routes

It is designed for Cloudflare-first deployments where you want no always-on Node host.

## Current runtime coverage

- public channels
- private channels
- private encrypted channels
- presence channels
- auth signing
- publish relay endpoint

This runtime is the edge-native option, but the most cost-effective production path is still usually:

- Vercel app
- Upstash Redis on Vercel integration
- Node websocket server (e.g. on Railway/Fly/Render) with `@summoniq/summonflow-server-redis`

Choose Cloudflare when you explicitly want the Worker + Durable Object architecture.
