import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`mesh-card rounded-[1.5rem] border border-[var(--line)] border-b-[color:color-mix(in_srgb,var(--line)_60%,transparent)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}
