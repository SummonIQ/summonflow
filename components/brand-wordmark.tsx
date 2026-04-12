import type { HTMLAttributes } from "react";
import { BrandMark } from "@/components/brand-mark";

type BrandWordmarkProps = HTMLAttributes<HTMLDivElement>;

export function BrandWordmark({ className = "", ...props }: BrandWordmarkProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()} {...props}>
      <BrandMark aria-hidden className="text-teal-500" />
      <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">SummonFlow</span>
    </div>
  );
}
