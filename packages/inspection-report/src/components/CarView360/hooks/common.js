export function isPricingPill(pillId) {
  return pillId && pillId.startsWith('damage-pill-pricing_');
}

export function getPillPart(pillId, isPricing) {
  return pillId?.substring(isPricing ? 20 : 12) ?? '';
}

export function getPillDamage({ damages, pillId }) {
  const part = getPillPart(pillId, isPricingPill(pillId));
  return { part, damage: damages.find((d) => d.part === part) };
}
