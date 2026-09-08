export interface PricingCalculationResult {
  originalPrice: number;
  markupPercentage: number;
  sellingPrice: number;
}

/**
 * Calculates the selling price for content placement based on the original publisher price.
 * 
 * Rules:
 * price <= 5       -> 125%
 * price <= 10      -> 100%
 * price <= 25      -> 85%
 * price <= 50      -> 75%
 * price <= 100     -> 60%
 * price <= 250     -> 50%
 * price <= 500     -> 40%
 * price <= 1000    -> 30%
 * price <= 2500    -> 25%
 * price <= 5000    -> 20%
 * price <= 10000   -> 15%
 * price > 10000    -> 10%
 * 
 * @param originalPrice The original publisher price
 * @returns PricingCalculationResult | null if originalPrice is invalid
 */
export function calculateContentPlacementSellingPrice(originalPrice: any): PricingCalculationResult | null {
  // Validate original price
  if (originalPrice === null || originalPrice === undefined) {
    return null;
  }

  // Parse as number if string
  let parsedPrice = originalPrice;
  if (typeof originalPrice === 'string') {
    // Strip everything except numbers and decimal points
    const stripped = originalPrice.replace(/[^0-9.]/g, '');
    if (stripped === '') {
      return null;
    }
    parsedPrice = parseFloat(stripped);
  }

  if (typeof parsedPrice !== 'number' || isNaN(parsedPrice) || parsedPrice < 0) {
    return null;
  }

  // Determine markup percentage based on tiers
  let markupPercentage = 0;
  if (parsedPrice <= 5) markupPercentage = 125;
  else if (parsedPrice <= 10) markupPercentage = 100;
  else if (parsedPrice <= 25) markupPercentage = 85;
  else if (parsedPrice <= 50) markupPercentage = 75;
  else if (parsedPrice <= 100) markupPercentage = 60;
  else if (parsedPrice <= 250) markupPercentage = 50;
  else if (parsedPrice <= 500) markupPercentage = 40;
  else if (parsedPrice <= 1000) markupPercentage = 30;
  else if (parsedPrice <= 2500) markupPercentage = 25;
  else if (parsedPrice <= 5000) markupPercentage = 20;
  else if (parsedPrice <= 10000) markupPercentage = 15;
  else markupPercentage = 10;

  // markup is percentage, so multiply by (1 + markupPercentage / 100)
  const multiplier = 1 + (markupPercentage / 100);
  let calculatedPrice = parsedPrice * multiplier;

  // Fix Javascript floating point precision issues (e.g. 12000 * 1.1 = 13200.000000000002)
  calculatedPrice = Math.round(calculatedPrice * 10000) / 10000;

  // Round UP to whole dollar
  const sellingPrice = Math.ceil(calculatedPrice);

  return {
    originalPrice: parsedPrice,
    markupPercentage,
    sellingPrice
  };
}
