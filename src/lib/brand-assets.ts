const BRAND_V = "4";

export const BRAND_PATHS = {
  wordmarkMain: `/brand/wordmark-main.png?v=${BRAND_V}`,
  wordmarkLight: `/brand/wordmark-light.png?v=${BRAND_V}`,
  lockupDark: `/brand/lockup-dark.png?v=${BRAND_V}`,
  appIcon: `/brand/app-icon.png?v=${BRAND_V}`,
} as const;

const cache = new Map<string, string>();

export async function fetchImageAsDataUrl(path: string): Promise<string> {
  const cached = cache.get(path);
  if (cached) return cached;

  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load brand asset: ${path}`);

  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  cache.set(path, dataUrl);
  return dataUrl;
}

export async function getWordmarkDataUrl(): Promise<string> {
  return fetchImageAsDataUrl(BRAND_PATHS.wordmarkMain);
}

export async function getAppIconDataUrl(): Promise<string> {
  return fetchImageAsDataUrl(BRAND_PATHS.appIcon);
}
