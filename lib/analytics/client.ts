"use client";

import { useCallback } from "react";
import { useAnalytics } from "@summoniq/signalsplash-client-sdk/react";
import type { EventPropertyValue, UserTraits } from "@summoniq/signalsplash-client-sdk";

type EventProperties = Record<string, EventPropertyValue>;

export function useProductAnalytics() {
  const { track, identify } = useAnalytics();

  const trackProductEvent = useCallback((name: string, properties?: EventProperties) => {
    track(name, {
      product: "summonflow",
      ...properties,
    });
  }, [track]);

  const identifyProductUser = useCallback((userId: string, traits?: UserTraits) => {
    identify(userId, {
      product: "summonflow",
      ...traits,
    });
  }, [identify]);

  return { trackProductEvent, identifyProductUser };
}
