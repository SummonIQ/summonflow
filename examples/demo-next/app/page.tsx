import { RealtimeDemo } from "../components/realtime-demo";

export default function Page() {
  return (
    <RealtimeDemo
      channelName={process.env.NEXT_PUBLIC_SUMMONFLOW_DEFAULT_CHANNEL ?? "presence-demo-room"}
    />
  );
}
