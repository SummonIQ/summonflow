import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SummonStream Demo",
  description: "Next.js + Vercel + Railway realtime reference app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
