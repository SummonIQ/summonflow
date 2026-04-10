import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const siteUrl = "https://summonstream.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SummonStream",
    template: "%s | SummonStream",
  },
  description:
    "Own your realtime stack. SummonStream gives you Pusher-class channels, presence, encrypted events, and deployment flexibility without the hosted lock-in.",
  openGraph: {
    title: "SummonStream",
    description:
      "A self-hosted realtime stack for apps that need channels, presence, encrypted events, and control over deployment.",
    type: "website",
    url: siteUrl,
  },
  keywords: [
    "realtime",
    "websocket",
    "channels",
    "presence",
    "Pusher alternative",
    "self-hosted realtime",
    "event streaming",
    "WebSocket server",
    "realtime infrastructure",
    "developer tools",
  ],
  twitter: {
    card: "summary_large_image",
    title: "SummonStream",
    description:
      "Self-hosted realtime infrastructure with a polished control plane and deployment flexibility.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
