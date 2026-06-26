/** Canonical site URL — set NEXT_PUBLIC_SITE_URL for ngrok / staging previews. */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://veyralabs.com";
}
