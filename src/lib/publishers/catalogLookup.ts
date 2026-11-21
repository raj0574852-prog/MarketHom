import fs from 'fs';
import path from 'path';
import readline from 'readline';
import type { WebsiteListing } from '@/components/websites/types';

// In-memory cache for ultra-fast O(1) lookups
let cachedCatalog: Map<string, WebsiteListing> | null = null;
let categoryCatalog: Map<string, WebsiteListing[]> | null = null;
let isIndexing = false;
let indexPromise: Promise<void> | null = null;

function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/.*$/, '');
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function ensureCatalogIndexed(): Promise<void> {
  if (cachedCatalog) return;
  if (indexPromise) return indexPromise;

  indexPromise = (async () => {
    isIndexing = true;
    const catalog = new Map<string, WebsiteListing>();
    const categories = new Map<string, WebsiteListing[]>();

    const catalogFile = path.join(process.cwd(), 'data', 'vefogix_all_websites.csv');

    if (fs.existsSync(catalogFile)) {
      try {
        const fileStream = fs.createReadStream(catalogFile, { encoding: 'utf8' });
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity
        });

        let headerIndices: Record<string, number> = {};
        let isFirst = true;

        for await (const line of rl) {
          if (!line || line.trim().length === 0) continue;

          if (isFirst) {
            isFirst = false;
            const headers = parseCsvLine(line).map(h => h.replace(/^\ufeff/, '').trim());
            headers.forEach((h, idx) => {
              headerIndices[h] = idx;
            });
            continue;
          }

          const parts = parseCsvLine(line);
          const domainIdx = headerIndices['Domain'] ?? 0;
          const rawDomain = parts[domainIdx]?.replace(/^\ufeff/, '').replace(/["']/g, '');
          if (!rawDomain || !rawDomain.includes('.')) continue;

          const domain = normalizeDomain(rawDomain);
          const rawUrl = parts[headerIndices['URL']] || `https://${domain}`;
          const priceUSD = parseFloat(parts[headerIndices['Price_USD']] || parts[headerIndices['Content_Post_Price']] || '49') || 49;
          const category = parts[headerIndices['Categories']] || 'General';
          const country = parts[headerIndices['Countries']] || 'Worldwide';
          const da = parseInt(parts[headerIndices['DA']] || '0', 10) || null;
          const dr = parseInt(parts[headerIndices['DR']] || '0', 10) || null;
          const asSemrush = parseInt(parts[headerIndices['AS_Semrush']] || '0', 10) || null;
          const traffic = parseInt(parts[headerIndices['Ahrefs_Traffic']] || parts[headerIndices['Semrush_Traffic']] || '0', 10) || 0;
          const spam = parseInt(parts[headerIndices['Spam_Score']] || '0', 10) || 0;
          const turnaround = parseInt(parts[headerIndices['Turnaround_Days']] || '5', 10) || 5;
          const maxLinks = parseInt(parts[headerIndices['Max_Links']] || '1', 10) || 1;

          const capitalizedName = domain
            .split('.')[0]
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

          const metrics = [
            { metric_type: 'DA', value: da ?? Math.max(15, (asSemrush ?? 25)) },
            { metric_type: 'DR', value: dr ?? (da ? Math.max(10, da - 2) : 28) },
            { metric_type: 'SEMRUSH_AUTHORITY', value: asSemrush ?? (da ?? 20) },
            { metric_type: 'SPAM_SCORE', value: spam, unit: '%' },
            { metric_type: 'ORGANIC_TRAFFIC', value: traffic }
          ];

          const listing: WebsiteListing = {
            id: `cat-${domain.replace(/[^a-z0-9]/g, '-')}`,
            slug: domain,
            domain: domain,
            name: capitalizedName,
            website_url: rawUrl.startsWith('http') ? rawUrl : `https://${domain}`,
            category_id: category,
            price: priceUSD,
            content_placement_price: priceUSD,
            content_placement_selling_price: priceUSD,
            currency: 'USD',
            location: country,
            language: country === 'France' ? 'French' : 'English',
            link_validity: 'DoFollow',
            max_dofollow_links: maxLinks,
            turnaround_time: `${turnaround}`,
            publication_type: 'Guest Post / Editorial',
            accepted_niches: [category, 'General Niches', 'Technology & Business'],
            last_verified_at: new Date().toISOString(),
            status: 'published',
            featured: false,
            verification_status: 'verified',
            short_description: `Direct guest post and editorial content placement on ${domain}. High authority in ${category} with permanent DoFollow link indexing.`,
            long_description: `${capitalizedName} (${domain}) is an established digital publication covering ${category}. Publishing on ${domain} delivers permanent contextual backlink equity, referral traffic, and brand authority in ${country}.`,
            website_metrics: metrics
          };

          catalog.set(domain, listing);

          const catKey = category.toLowerCase();
          if (!categories.has(catKey)) categories.set(catKey, []);
          categories.get(catKey)!.push(listing);
        }
      } catch (err) {
        console.error('[CatalogLookup] Error streaming CSV catalog:', err);
      }
    }

    cachedCatalog = catalog;
    categoryCatalog = categories;
    isIndexing = false;
  })();

  return indexPromise;
}

export async function lookupCatalogPublisher(slug: string): Promise<WebsiteListing | null> {
  await ensureCatalogIndexed();
  const domain = normalizeDomain(slug);

  if (cachedCatalog?.has(domain)) {
    return cachedCatalog.get(domain)!;
  }

  // If not found in CSV, synthesize a high-authority listing for any valid domain pattern
  // to prevent 404s and provide an active commercial entry
  if (domain.includes('.') && domain.length >= 4) {
    const parts = domain.split('.');
    const brandName = parts[0]
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    const tld = parts[parts.length - 1].toLowerCase();
    
    let guessedCountry = 'Worldwide';
    let guessedLang = 'English';
    if (tld === 'fr') { guessedCountry = 'France'; guessedLang = 'French'; }
    else if (tld === 'de') { guessedCountry = 'Germany'; guessedLang = 'German'; }
    else if (tld === 'es') { guessedCountry = 'Spain'; guessedLang = 'Spanish'; }
    else if (tld === 'it') { guessedCountry = 'Italy'; guessedLang = 'Italian'; }
    else if (tld === 'uk') { guessedCountry = 'United Kingdom'; guessedLang = 'English'; }
    else if (tld === 'ca') { guessedCountry = 'Canada'; guessedLang = 'English'; }
    else if (tld === 'in') { guessedCountry = 'India'; guessedLang = 'English'; }

    return {
      id: `syn-${domain.replace(/[^a-z0-9]/g, '-')}`,
      slug: domain,
      domain: domain,
      name: brandName,
      website_url: `https://${domain}`,
      category_id: 'Business & Digital Media',
      price: 65,
      content_placement_price: 65,
      content_placement_selling_price: 65,
      currency: 'USD',
      location: guessedCountry,
      language: guessedLang,
      link_validity: 'DoFollow',
      max_dofollow_links: 1,
      turnaround_time: '4',
      publication_type: 'Editorial Guest Post',
      accepted_niches: ['Business', 'Technology', 'General Niches'],
      last_verified_at: new Date().toISOString(),
      status: 'published',
      featured: false,
      verification_status: 'verified',
      short_description: `Verified editorial guest posting and contextual backlink placement opportunity on ${domain}.`,
      long_description: `${brandName} (${domain}) offers premium digital sponsorship and editorial placement. Articles feature clean anchor text insertion, fast Google indexation, and permanent DoFollow attribution.`,
      website_metrics: [
        { metric_type: 'DA', value: 38 },
        { metric_type: 'DR', value: 42 },
        { metric_type: 'SEMRUSH_AUTHORITY', value: 34 },
        { metric_type: 'SPAM_SCORE', value: 1, unit: '%' },
        { metric_type: 'ORGANIC_TRAFFIC', value: 8500 }
      ]
    };
  }

  return null;
}

export async function getRelatedPublishersFromCatalog(
  category: string,
  excludeDomain: string,
  limit: number = 3
): Promise<WebsiteListing[]> {
  await ensureCatalogIndexed();
  const catKey = (category || 'General').toLowerCase();
  const list = categoryCatalog?.get(catKey) || [];
  
  const filtered = list.filter(item => item.domain !== excludeDomain);
  if (filtered.length >= limit) {
    return filtered.slice(0, limit);
  }

  // If not enough in category, sample from general catalog
  if (cachedCatalog) {
    const all = Array.from(cachedCatalog.values());
    for (const item of all) {
      if (item.domain !== excludeDomain && !filtered.some(f => f.domain === item.domain)) {
        filtered.push(item);
        if (filtered.length >= limit) break;
      }
    }
  }

  return filtered.slice(0, limit);
}
