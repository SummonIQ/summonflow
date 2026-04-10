# summon-flow

`summon-flow` is a self-hosted realtime client library for people who want a clean channel-based API without being tied to a hosted orchestration layer.

It speaks the SummonFlow WebSocket event shape, so it can sit in front of your own SummonFlow server or compatible self-hosted backends.

## What it covers

- public channels
- private channels
- private encrypted channels
- presence channels
- client events
- `bind`, `unbind`, `bind_global`, `unbind_global`, `unbind_all`
- connection state events
- reconnects with backoff
- custom or HTTP channel authorization

## Install

```bash
npm install summon-flow
```

## Browser usage

```ts
import SummonFlow from "summon-flow";

const stream = new SummonFlow("app-key", {
  wsHost: "realtime.example.com",
  wsPort: 6001,
  forceTLS: false,
  channelAuthorization: {
    endpoint: "/realtime/auth",
  },
});

stream.connection.bind("connected", () => {
  console.log("connected", stream.connection.socketId);
});

const channel = stream.subscribe("presence-room");

channel.bind("summon:subscription_succeeded", () => {
  console.log("presence count", channel.members.count);
});

channel.bind("new-message", (payload) => {
  console.log(payload);
});
```

## Encrypted channels

`private-encrypted-` channels are supported when your auth endpoint returns a `sharedSecret` field.

Example auth response:

```json
{
  "token": "app-key:signature",
  "sharedSecret": "base64-encoded-channel-secret"
}
```

Encrypted channel payloads are decrypted client-side with Web Crypto using an AES-GCM envelope:

```json
{
  "ciphertext": "<base64>",
  "nonce": "<base64>"
}
```

## Node usage

Pass a WebSocket implementation explicitly in Node:

```ts
import WebSocket from "ws";
import SummonFlow from "summon-flow";

const stream = new SummonFlow("app-key", {
  wsHost: "127.0.0.1",
  wsPort: 6001,
  WebSocket,
  fetch,
});
```

## Auth behavior

For `private-` and `presence-` channels, `summon-flow` sends a standard SummonFlow auth request:

- `POST /realtime/auth`
- `Content-Type: application/x-www-form-urlencoded`
- body includes `socketId` and `channelName`

You can override that with either:

- `authorizer(request) => { token, member? }`
- `channelAuthorization.customHandler(request) => { token, member? }`

## API notes

The constructor and channel methods intentionally stay compact and predictable:

- `new SummonFlow(key, options)`
- `stream.subscribe(name)`
- `stream.unsubscribe(name)`
- `stream.channel(name)`
- `stream.allChannels()`
- `channel.bind(event, handler)`
- `channel.trigger("client-event", payload)`

This package is intentionally WebSocket-first. It does not ship SockJS or older transport fallbacks.

## Development

```bash
npm install
npm run test
npm run build
npm run typecheck
```
