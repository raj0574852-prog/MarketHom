import { WebsiteListing } from '@/components/websites/types';

export interface IndexabilityResult {
  indexable: boolean;
  score: number;
  reasons: string[];
}

export function evaluatePublisherIndexability(website: Partial<WebsiteListing> & { is_listed?: boolean }): IndexabilityResult {
  let score = 0;
  const reasons: string[] = [];

  // Technical eligibility (Must-Haves)
  if (website.status !== 'published') {
    reasons.push('Publisher status is not published.');
  } else {
    score += 10;
  }

  if (website.is_listed === false) {
    reasons.push('Publisher is not listed.');
  } else {
    score += 10;
  }

  if (!website.domain || !website.slug) {
    reasons.push('Publisher domain or slug is missing.');
  } else {
    score += 10;
  }

  // Content Quality Evaluation
  if (website.short_description || website.long_description || website.editorial_description) {
    score += 20;
  } else {
    reasons.push('Missing unique publisher description.');
  }

  if (website.category_id) {
    score += 10;
  } else {
    reasons.push('Missing category.');
  }

  if (website.accepted_niches && website.accepted_niches.length > 0) {
    score += 10;
  } else {
    reasons.push('Missing accepted niches information.');
  }

  if (website.content_placement_price && website.content_placement_price > 0) {
    score += 10;
  } else {
    reasons.push('Missing or zero price information.');
  }

  // Evaluate metrics (Bonus)
  const hasMetrics = website.website_metrics && website.website_metrics.length > 0;
  if (hasMetrics) {
    score += 20;
  } else {
    reasons.push('Missing SEO metrics.');
  }

  // Determine indexability.
  // Essential rules: must be published and have a valid slug.
  // Google Sheets removal sets is_listed to false, but MUST NOT cause noindex.
  const isTechnicallyEligible = website.status === 'published' && !!website.slug;
  
  const indexable = isTechnicallyEligible;

  if (!indexable) {
    reasons.push(`Technically ineligible.`);
  }

  return {
    indexable,
    score,
    reasons
  };
}
