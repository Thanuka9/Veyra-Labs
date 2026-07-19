import { pricingTiers, addonServices } from "../src/lib/content";
import {
  PROJECT_TYPES,
  SCOPE_OPTIONS,
  buildEstimate,
  getIncludedScopeIds,
  getScopeForType,
  formatRange,
  type ProjectTypeId,
} from "../src/lib/estimate";

const ids = new Set(PROJECT_TYPES.map((p) => p.id));
let ok = true;

for (const t of pricingTiers) {
  if (!t.quoteType || !ids.has(t.quoteType)) {
    console.error("BAD_TIER", t.name);
    ok = false;
    continue;
  }
  const scopes = getScopeForType(t.quoteType);
  const included = getIncludedScopeIds([t.quoteType]);
  const paid = scopes.filter((s) => s.min > 0 || s.max > 0);
  const base = buildEstimate({
    projectTypeIds: [t.quoteType],
    selectedScopeIds: included,
    timelineId: "standard",
  });
  console.log(
    t.quoteType,
    "included",
    included.length,
    "paid",
    paid.length,
    "base",
    formatRange(base.totalMin, base.totalMax)
  );
  if (included.length < 3) {
    console.error("TOO_FEW_INCLUDED", t.quoteType, included.length);
    ok = false;
  }
  if (paid.length < 2) {
    console.error("TOO_FEW_PAID", t.quoteType);
    ok = false;
  }
  const expected = PROJECT_TYPES.find((p) => p.id === t.quoteType)!;
  if (base.totalMin !== expected.baseMin || base.totalMax !== expected.baseMax) {
    console.error("BASE_DRIFT", t.quoteType, base, expected.baseMin, expected.baseMax);
    ok = false;
  }
}

for (const s of addonServices) {
  const id = s.id as ProjectTypeId;
  const scopes = getScopeForType(id);
  const included = getIncludedScopeIds([id]);
  const paid = scopes.filter((x) => x.min > 0 || x.max > 0);
  console.log("addon", s.id, "included", included.length, "paid", paid.length, "total", scopes.length);
  if (scopes.length < 3) {
    console.error("THIN_ADDON", s.id);
    ok = false;
  }
}

const bundles = [
  ["devops", 800, 4000],
  ["security", 1500, 5000],
  ["mobile", 500, 1500],
  ["analytics", 1200, 3000],
  ["integrations", 1000, 4500],
  ["performance", 600, 1800],
] as const;

for (const [id, min, max] of bundles) {
  const p = PROJECT_TYPES.find((s) => s.id === id);
  if (!p || p.baseMin !== min || p.baseMax !== max) {
    console.error("ADDON_BASE_MISMATCH", id, p);
    ok = false;
  } else {
    console.log("addon base OK", id, formatRange(min, max));
  }
}

// Portfolio + Analytics add-on should equal sum of bases
{
  const portfolio = buildEstimate({
    projectTypeIds: ["portfolio"],
    selectedScopeIds: getIncludedScopeIds(["portfolio"]),
    timelineId: "standard",
  });
  const both = buildEstimate({
    projectTypeIds: ["portfolio", "analytics"],
    selectedScopeIds: [
      ...getIncludedScopeIds(["portfolio"]),
      ...getIncludedScopeIds(["analytics"]),
    ],
    timelineId: "standard",
  });
  const expectedMin = portfolio.totalMin + 1200;
  const expectedMax = portfolio.totalMax + 3000;
  console.log(
    "portfolio+analytics",
    formatRange(both.totalMin, both.totalMax),
    "expected",
    formatRange(expectedMin, expectedMax)
  );
  if (both.totalMin !== expectedMin || both.totalMax !== expectedMax) {
    console.error("COMBO_MISMATCH");
    ok = false;
  }
}

console.log(ok ? "ALL_OK" : "FAILED");
process.exit(ok ? 0 : 1);
