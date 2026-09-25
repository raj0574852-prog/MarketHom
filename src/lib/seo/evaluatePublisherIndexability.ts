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
  // Based on cohort analysis, 32k pages lack rich editorial descriptions.
  // The bare minimum for a valuable marketplace listing is having a specific niche/category + price (Score 25).
  // Pages scoring < 25 (e.g., General category with no details) are mathematically duplicate/thin content.
  let classification: IndexabilityClassification;
  let indexable = true;

  if (score >= 45) {
    classification = 'INDEX';
    indexable = true;
  } else if (score >= 25) {
    classification = 'IMPROVE';
    indexable = true; // Still indexable, but flagged for content enhancement
  } else {
    classification = 'NOINDEX';
    indexable = false; // Protects crawl budget from 6,600+ zero-value "General" template pages
  }

  return {
    indexable,
    score,
    classification,
    reasons,
    missingSignals,
    sitemapEligible: indexable // Only indexable pages go in the sitemap
  };
}
