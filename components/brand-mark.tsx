import type { HTMLAttributes } from "react";

type BrandMarkProps = HTMLAttributes<HTMLDivElement>;

export function BrandMark({ className = "", ...props }: BrandMarkProps) {
  return (
    <div className={`flex h-6 w-6 items-center justify-center gap-[2px] ${className}`.trim()} {...props}>
      <span className="h-[7.2px] w-[1.5px] rounded-full bg-[rgba(167,139,250,0.9)]" />
      <span className="h-3 w-[2px] rounded-full bg-current" />
      <span className="h-[10.8px] w-[1.5px] rounded-full bg-[rgba(192,132,252,0.88)]" />
      <span className="h-4 w-[2px] rounded-full bg-current" />
      <span className="h-[14.4px] w-[1.5px] rounded-full bg-[rgba(244,114,182,0.86)]" />
      <span className="h-5 w-[2px] rounded-full bg-current" />
    </div>
  );
}
