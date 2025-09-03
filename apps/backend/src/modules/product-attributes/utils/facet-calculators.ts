/**
 * Calculate appropriate step size for price range sliders
 * Based on the price range, returns a sensible step increment
 */
export function calculatePriceStep(min: number, max: number): number {
  const range = max - min;
  if (range <= 100) return 5;
  if (range <= 500) return 10;
  if (range <= 1000) return 25;
  if (range <= 5000) return 50;
  return 100;
}

/**
 * Calculate appropriate step size for generic numeric range sliders
 * Used for attribute facets with numeric values
 */
export function calculateStep(min: number, max: number): number {
  const range = max - min;
  if (range <= 10) return 1;
  if (range <= 100) return 5;
  if (range <= 1000) return 10;
  return 50;
}