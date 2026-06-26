"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { GoogleAnalytics } from "./GoogleAnalytics";

export const CONSENT_KEY = "veyra-cookie-consent";

export type CookieConsentValue = "accepted" | "essential";

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "essential") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveCookieConsent(value: CookieConsentValue) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("veyra-cookie-consent-change", { detail: value }));
}

/** Clears saved choice so the banner shows again — used from footer “Cookie settings”. */
export function resetCookieConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("veyra-cookie-consent-change", { detail: null }));
}

export function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
    setReady(true);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentValue | null>).detail;
      setConsent(detail);
    };

    window.addEventListener("veyra-cookie-consent-change", onChange);
    return () => window.removeEventListener("veyra-cookie-consent-change", onChange);
  }, []);

  function choose(value: CookieConsentValue) {
    saveCookieConsent(value);
    setConsent(value);
  }

  const showBanner = ready && consent === null;

  return (
    <>
      {consent === "accepted" && <GoogleAnalytics />}

      {showBanner && (
        <div
          className="cookie-consent-card"
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
        >
          <button
            type="button"
            onClick={() => choose("essential")}
            className="cookie-consent-close"
            aria-label="Close and use essential cookies only"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3 pr-5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet/15">
              <Cookie size={18} className="text-violet" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Cookie preferences</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                We use essential cookies to run this site. With your permission we also use analytics
                cookies to improve our experience. Read our{" "}
                <Link href="/cookies" className="font-medium text-cyan hover:underline">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-cyan hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => choose("essential")} className="cookie-consent-btn-secondary">
              Essential only
            </button>
            <button type="button" onClick={() => choose("accepted")} className="cookie-consent-btn-primary">
              Accept all
            </button>
          </div>
        </div>
      )}
    </>
  );
}
