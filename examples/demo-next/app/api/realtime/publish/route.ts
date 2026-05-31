import { publishToSummonFlowViaRedis } from "@summoniq/summonflow-server-sdk";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as {
    channel?: string;
    text?: string;
  };

  if (!body.channel || !body.text) {
    return Response.json({ error: "channel and text are required" }, { status: 400 });
  }

  await publishToSummonFlowViaRedis({
    channel: body.channel,
    event: "message-created",
    data: {
      text: body.text,
      source: "vercel",
    },
    redisChannel: process.env.SUMMONFLOW_REDIS_CHANNEL,
  });

  return Response.json({ ok: true });
}
