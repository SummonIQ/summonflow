"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth/client";

export function MarketingSessionCta({
  signupLabel,
  consoleLabel = "Go to Console",
  className,
}: {
  signupLabel: string;
  consoleLabel?: string;
  className: string;
}) {
  const { data: session } = useSession();

  return (
    <Link href={session ? "/apps" : "/signup"} className={className}>
      {session ? consoleLabel : signupLabel}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
