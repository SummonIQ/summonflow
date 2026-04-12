import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
    default: "SummonFlow",
    template: "%s | SummonFlow",
  },
  description:
    "Own your realtime stack. SummonFlow gives you channels, presence, encrypted events, and a control plane in one place.",
  openGraph: {
    title: "SummonFlow",
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
    "self-hosted realtime",
    "event streaming",
    "developer tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${mono.variable} dark`} suppressHydrationWarning style={{ colorScheme: "dark" }}>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
