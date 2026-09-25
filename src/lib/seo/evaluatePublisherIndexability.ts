import { WebsiteListing } from '@/components/websites/types';

export type IndexabilityClassification = 'INDEX' | 'IMPROVE' | 'NOINDEX' | 'EXCLUDE';

export interface IndexabilityResult {
  indexable: boolean;
  score: number;
  classification: IndexabilityClassification;
  reasons: string[];
  missingSignals: string[];
  sitemapEligible: boolean;
}

export function evaluatePublisherIndexability(
  website: Partial<WebsiteListing> & { is_listed?: boolean }
): IndexabilityResult {
  let score = 0;
  const reasons: string[] = [];
  const missingSignals: string[] = [];

  // 1. Technical Eligibility (EXCLUDE rules)
  if (website.status !== 'published') {
    reasons.push('Status is not published');
    missingSignals.push('status');
  }
  if (website.is_listed === false) {
    reasons.push('Publisher is unlisted');
    missingSignals.push('is_listed');
  }
  if (!website.slug) {
    reasons.push('Missing valid slug');
    missingSignals.push('slug');
  }
  if (!website.domain) {
    reasons.push('Missing domain');
    missingSignals.push('domain');
  }

  const isTechnicallyEligible = 
    website.status === 'published' && 
    website.is_listed !== false && 
    !!website.slug && 
    !!website.domain;

  if (!isTechnicallyEligible) {
    return {
      indexable: false,
      score: 0,
      classification: 'EXCLUDE',
      reasons,
      missingSignals,
      sitemapEligible: false
    };
  }

  // 2. Content & Differentiation Scoring
  // Descriptions
  if (website.editorial_description && website.editorial_description.length > 50) {
    score += 30; // High differentiation
    reasons.push('Has rich editorial description');
  } else if (website.short_description && website.short_description.length > 30) {
    score += 15;
    reasons.push('Has short description');
  } else {
    missingSignals.push('description');
  }

  // Categories
  if (website.category_id && website.category_id !== 'General') {
    score += 15;
    reasons.push('Assigned to specific category');
  } else {
    missingSignals.push('specific_category');
  }

  // Niches
  if (website.accepted_niches && website.accepted_niches.length > 0 && website.accepted_niches[0] !== 'General Niches') {
    score += 15;
    reasons.push(`Has ${website.accepted_niches.length} specific niches`);
  } else {
    missingSignals.push('niches');
  }

  // Turnaround & Links
  let hasPlacementInfo = false;
  if (website.turnaround_time) {
    score += 10;
    hasPlacementInfo = true;
  }
  if (website.max_dofollow_links) {
    score += 10;
    hasPlacementInfo = true;
  }
  if (!hasPlacementInfo) {
    missingSignals.push('placement_info');
  }

  // Pricing
  if (website.content_placement_selling_price || website.price) {
    score += 10;
  } else {
    missingSignals.push('pricing');
  }

  // Metrics
  if (website.website_metrics && website.website_metrics.length > 0) {
    score += 10;
    reasons.push('Has verified metrics');
  } else {
    missingSignals.push('metrics');
  }

  // 3. Classification
  // We do NOT use a blind rule yet for 'indexable'. 
  // For Phase 15A-15B, we classify into buckets based on content differentiation.
  // We will fine-tune these thresholds in Phase 15F based on real distribution.
  let classification: IndexabilityClassification;
  let indexable = true; // Default true until Phase 15F overrides it, or we rely on classification

  if (score >= 60) {
    classification = 'INDEX';
  } else if (score >= 35) {
    classification = 'IMPROVE';
  } else {
    classification = 'NOINDEX';
    // indexable = false; // Intentionally left true or handled dynamically until correlation is done
  }

  return {
    indexable,
    score,
    classification,
    reasons,
    missingSignals,
    sitemapEligible: isTechnicallyEligible // Will be refined in 15G
  };
}
