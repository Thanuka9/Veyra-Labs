"use client";

import { resetCookieConsent } from "./CookieConsent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => resetCookieConsent()}
      className="transition-colors hover:text-cyan"
    >
      Cookie settings
    </button>
  );
}
