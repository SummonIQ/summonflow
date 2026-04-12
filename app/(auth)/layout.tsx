import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="marketing-theme min-h-screen">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}
