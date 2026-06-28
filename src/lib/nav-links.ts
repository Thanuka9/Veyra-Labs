/** Primary site navigation — page routes. */
export const SITE_NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/technology", label: "Technology" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
] as const;

const FOOTER_LABELS: Record<string, string> = {
  "/work": "Featured Work",
  "/services": "Services",
  "/technology": "Technology",
  "/process": "Our Process",
  "/about": "About Veyra Labs",
  "/pricing": "Pricing & Estimates",
  "/testimonials": "Testimonials",
};

export const FOOTER_COMPANY_LINKS = [
  ...SITE_NAV_LINKS.map((l) => ({
    label: FOOTER_LABELS[l.href] ?? l.label,
    href: l.href,
  })),
  { label: "Testimonials", href: "/testimonials" },
];

export function contactHref(onHome: boolean) {
  return onHome ? "#contact" : "/#contact";
}

export function uniqueGalleryImages<T extends { src: string }>(images: T[]): T[] {
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
