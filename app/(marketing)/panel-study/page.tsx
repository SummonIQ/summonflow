import type { Metadata } from "next";
import { MarketingHeroBackground } from "@/components/marketing-hero-background";

export const metadata: Metadata = {
  title: "Panel Study",
  description: "Standalone hero panel study.",
};

export default function PanelStudyPage() {
  return (
    <main className="page-shell min-h-screen">
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12 sm:px-10">
        <section className="relative h-[34rem] w-full">
          <MarketingHeroBackground />
        </section>
      </div>
    </main>
  );
}
