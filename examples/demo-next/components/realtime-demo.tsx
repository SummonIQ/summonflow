"use client";

import type SummonFlow from "@summoniq/summonflow-client-sdk";
import { useEffect, useState } from "react";
import { getMissingPublicEnvKeys, getPublicEnv } from "../lib/env";
import { getRealtimeClient } from "../lib/realtime";

interface Message {
  text: string;
  source: string;
  receivedAt: string;
}

export function RealtimeDemo({ channelName }: { channelName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("connecting");
  const [draft, setDraft] = useState("");
  const [client, setClient] = useState<SummonFlow | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const env = getPublicEnv();
    const missingKeys = getMissingPublicEnvKeys(env);

    if (missingKeys.length > 0) {
      setConfigError(`Set ${missingKeys.join(", ")} to enable the live demo.`);
      setStatus("not configured");
      return;
    }

    setClient(getRealtimeClient());
  }, []);

  useEffect(() => {
    if (!client) {
      return;
    }

    const channel = client.subscribe(channelName);

    client.connection.bind("state_change", (payload) => {
      const next = payload as { current?: string } | undefined;
      if (next?.current) {
        setStatus(next.current);
      }
    });

    channel.bind("message-created", (payload, metadata) => {
      const message = payload as { text: string; source?: string };
      const meta = metadata as { userId?: string } | undefined;
      setMessages((current) => [
        {
          text: message.text,
          source: message.source ?? meta?.userId ?? "server",
          receivedAt: new Date().toLocaleTimeString(),
        },
        ...current,
      ]);
    });

    return () => {
      client.unsubscribe(channelName);
    };
  }, [channelName, client]);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    setDraft("");
    await fetch("/api/realtime/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelName,
        text,
      }),
    });
  };

  return (
    <div style={styles.panel}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.eyebrow}>Realtime demo</div>
          <h1 style={styles.title}>Vercel auth + Redis publish + Railway sockets</h1>
        </div>
        <div style={styles.statusPill}>{status}</div>
      </div>

      <p style={styles.copy}>
        This page authenticates channels through a Next.js route, publishes through Upstash Redis,
        and receives live messages from the Railway websocket service.
      </p>

      {configError ? <div style={styles.notice}>{configError}</div> : null}

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={draft}
          placeholder="Send a message into the room"
          disabled={!client}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button style={styles.button} disabled={!client} onClick={sendMessage}>
          Publish
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Channel</div>
        <code>{channelName}</code>
      </div>

      <div style={styles.messageList}>
        {messages.length === 0 ? (
          <div style={styles.empty}>No messages yet.</div>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.receivedAt}-${index}`} style={styles.messageCard}>
              <div style={styles.messageMeta}>
                <span>{message.source}</span>
                <span>{message.receivedAt}</span>
              </div>
              <div>{message.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    maxWidth: 920,
    margin: "0 auto",
    padding: "64px 24px 96px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  eyebrow: {
    color: "var(--accent)",
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 4rem)",
    lineHeight: 1,
  },
  copy: {
    color: "var(--muted)",
    maxWidth: 640,
    fontSize: 16,
    lineHeight: 1.6,
    margin: "20px 0 28px",
  },
  statusPill: {
    border: "1px solid var(--panel-border)",
    background: "rgba(110, 231, 183, 0.08)",
    color: "var(--accent)",
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
    color: "var(--text)",
    borderRadius: 14,
    padding: "14px 16px",
  },
  button: {
    border: 0,
    borderRadius: 14,
    background: "var(--accent)",
    color: "#072016",
    fontWeight: 700,
    padding: "0 18px",
    cursor: "pointer",
  },
  notice: {
    marginBottom: 20,
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(251, 191, 36, 0.28)",
    background: "rgba(120, 53, 15, 0.22)",
    color: "#fcd34d",
  },
  card: {
    background: "rgba(23, 34, 48, 0.88)",
    border: "1px solid var(--panel-border)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    color: "var(--muted)",
    fontSize: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  messageList: {
    display: "grid",
    gap: 12,
  },
  empty: {
    color: "var(--muted)",
    padding: "18px 0",
  },
  messageCard: {
    background: "rgba(15, 23, 32, 0.72)",
    border: "1px solid var(--panel-border)",
    borderRadius: 18,
    padding: 16,
  },
  messageMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 8,
  },
};
