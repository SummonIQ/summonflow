'use client';

import { useEffect } from 'react';
import { AnalyticsProvider, WebVitals } from '@summoniq/signalsplash-client-sdk/react';
import type { AnalyticsConfig } from '@summoniq/signalsplash-client-sdk';
import { useSession } from '@/lib/auth/client';
import { useProductAnalytics } from '@/lib/analytics/client';

const envEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT?.trim();
const defaultEndpoint =
  process.env.NODE_ENV === 'production'
    ? 'https://api.signalsplash.com/api/events'
    : '';
const resolvedEndpoint = envEndpoint || defaultEndpoint;
const isAnalyticsEnabled =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false' &&
  Boolean(resolvedEndpoint);

const analyticsConfig: AnalyticsConfig = {
  appId: 'summonflow',
  endpoint: resolvedEndpoint || undefined,
  enabled: isAnalyticsEnabled,
  debug: process.env.NODE_ENV === 'development',
  trackPageViews: true,
  trackWebVitals: true,
  sessionTimeout: 30,
};

function AnalyticsIdentify() {
  const { data: session } = useSession();
  const { identifyProductUser } = useProductAnalytics();

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    const user = session.user as {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      createdAt?: string | Date | null;
    };

    async function identifyUser() {
      const profile = await fetch("/api/user", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
      if (cancelled) return;

      identifyProductUser(user.id, {
        email: user.email ?? profile?.email ?? undefined,
        name: user.name ?? profile?.name ?? undefined,
        firstName: user.firstName ?? profile?.firstName ?? undefined,
        lastName: user.lastName ?? profile?.lastName ?? undefined,
        avatar: user.image ?? profile?.image ?? undefined,
        createdAt: typeof user.createdAt === "string" ? user.createdAt : profile?.createdAt,
        company: profile?.activeOrganization?.name,
        activeOrganizationId: profile?.activeOrganization?.id,
        activeOrganizationSlug: profile?.activeOrganization?.slug,
        organizationCount: Array.isArray(profile?.organizations) ? profile.organizations.length : undefined,
        organizationRole: profile?.organizations?.find((organization: { id: string }) =>
          organization.id === profile?.activeOrganization?.id
        )?.role,
      });
    }

    void identifyUser();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, identifyProductUser]);

  return null;
}

export function AppAnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider config={analyticsConfig}>
      <WebVitals />
      <AnalyticsIdentify />
      {children}
    </AnalyticsProvider>
  );
}
