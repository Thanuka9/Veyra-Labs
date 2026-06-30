"use client";

import { CookieConsent } from "./CookieConsent";
import { VeyraChat } from "./VeyraChat";

/** Fixed bottom-right dock  -  chat on the right, cookie consent beside it (never overlapping). */
export function VeyraWidgetDock() {
  return (
    <div className="veyra-widget-dock">
      <VeyraChat />
      <CookieConsent />
    </div>
  );
}
