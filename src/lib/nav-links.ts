/** Homepage section anchors — order matches app/page.tsx top → bottom. */
export const NAV_SECTION_LINKS = [
  { href: "#outcomes", label: "Outcomes" },
  { href: "#featured", label: "Featured" },
  { href: "#work", label: "Case Studies" },
  { href: "#tech", label: "Tech Stack" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#process", label: "Process" },
  { href: "#why", label: "Why Us" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
] as const;

const FOOTER_LABELS: Record<string, string> = {
  "#featured": "Featured Work",
  "#pricing": "Pricing & Estimates",
  "#process": "Our Process",
  "#why": "Why Veyra Labs",
  "#about": "About Veyra Labs",
};

export const FOOTER_COMPANY_LINKS = NAV_SECTION_LINKS.map((l) => ({
  label: FOOTER_LABELS[l.href] ?? l.label,
  href: `/${l.href}`,
}));

export function sectionHref(hash: string, onHome: boolean) {
  return onHome ? hash : `/${hash}`;
}

export function uniqueGalleryImages<T extends { src: string }>(images: T[]): T[] {
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
