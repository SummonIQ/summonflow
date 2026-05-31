import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppAnalyticsProvider } from "@/components/providers/analytics-provider";
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

const siteUrl = "https://summonflow.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SummonFlow — Open Source Realtime Infrastructure",
    template: "%s | SummonFlow",
  },
  description:
    "Open source realtime infrastructure with channels, presence, end-to-end encryption, and a control plane you actually own. Self-host or use managed. Same SDK.",
  openGraph: {
    title: "SummonFlow — Open Source Realtime Infrastructure",
    description:
      "Channels, presence, encrypted events, and a control plane in one TypeScript SDK. Self-host on your infra or use the managed platform.",
    type: "website",
    url: siteUrl,
    siteName: "SummonFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "SummonFlow — Open Source Realtime Infrastructure",
    description:
      "Channels, presence, encrypted events, and a control plane in one TypeScript SDK. Self-host or managed.",
  },
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "realtime",
    "websocket",
    "channels",
    "presence",
    "self-hosted realtime",
    "open source websocket",
    "event streaming",
    "pub/sub",
    "developer tools",
    "TypeScript SDK",
    "end-to-end encryption",
    "realtime infrastructure",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${mono.variable} dark`} suppressHydrationWarning style={{ colorScheme: "dark" }}>
      <body suppressHydrationWarning>
        <AppAnalyticsProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppAnalyticsProvider>
      </body>
    </html>
  );
}
