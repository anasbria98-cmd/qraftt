"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/privacy/consent-provider";
import {
  adSenseClientId,
  adSenseSlotIds,
  type AdPlacement,
} from "@/lib/integrations";

interface AdSlotProps {
  placement: AdPlacement;
}

export function AdSlot({ placement }: AdSlotProps) {
  const requested = useRef(false);
  const { adsReady, optionalServicesAllowed } = useConsent();
  const slotId = adSenseSlotIds[placement];
  const configured = Boolean(adSenseClientId && slotId);
  const active = configured && optionalServicesAllowed;

  useEffect(() => {
    if (!active) {
      requested.current = false;
      return;
    }
    if (!active || !adsReady || requested.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      requested.current = true;
    } catch {
      // Ad blockers or network failures must never affect core page content.
    }
  }, [active, adsReady]);

  if (!configured) return null;

  return (
    <aside
      aria-hidden={!active}
      aria-label={active ? "Advertisement" : undefined}
      className={`ad-slot ad-slot-${placement}`}
    >
      {active ? (
        <ins
          className="adsbygoogle"
          data-ad-client={adSenseClientId ?? undefined}
          data-ad-format="auto"
          data-ad-slot={slotId ?? undefined}
          data-full-width-responsive="true"
        />
      ) : null}
    </aside>
  );
}
