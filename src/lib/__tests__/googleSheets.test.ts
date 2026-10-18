import { describe, it, expect } from 'vitest';
import { mapHeaders } from '../googleSheets';
import { normalizeDomain } from '../domainNormalizer';

describe('Google Sheets Integration & Normalization', () => {
  it('correctly maps variations of spreadsheet headers to internal canonical fields', () => {
    expect(mapHeaders('Domain')).toBe('domain');
    expect(mapHeaders('Website URL')).toBe('domain');
    expect(mapHeaders('DA (Moz)')).toBe('da');
    expect(mapHeaders('Domain Authority')).toBe('da');
    expect(mapHeaders('DR (Ahrefs)')).toBe('dr');
    expect(mapHeaders('Domain Rating')).toBe('dr');
    expect(mapHeaders('Organic Traffic')).toBe('traffic');
    expect(mapHeaders('Monthly Traffic')).toBe('traffic');
    expect(mapHeaders('Authority Score')).toBe('authority_score');
    expect(mapHeaders('Spam Score')).toBe('spam_score');
    expect(mapHeaders('Category')).toBe('category_id');
    expect(mapHeaders('Content Placement Price')).toBe('content_placement_price');
    expect(mapHeaders('Link Insert Price')).toBe('link_insert_price');
    expect(mapHeaders('CBD Content Placement Price')).toBe('cbd_content_placement_price');
    expect(mapHeaders('Adult Content Placement Price')).toBe('adult_content_placement_price');
    expect(mapHeaders('Sample Link')).toBe('sample_link');
    expect(mapHeaders('Total Deals')).toBe('total_deals');
  });

  it('normalizes domains accurately by stripping protocols, www, and trailing paths', () => {
    expect(normalizeDomain('https://www.example.com/')).toBe('example.com');
    expect(normalizeDomain('http://sub.domain.co.uk/path?param=1')).toBe('sub.domain.co.uk');
    expect(normalizeDomain('  HTTPS://UPPERCASE-DOMAIN.ORG  ')).toBe('uppercase-domain.org');
    expect(normalizeDomain('volynbasket.com')).toBe('volynbasket.com');
  });

  it('safely rejects invalid or empty domain strings', () => {
    expect(normalizeDomain('')).toBeNull();
    expect(normalizeDomain('   ')).toBeNull();
  });
});
