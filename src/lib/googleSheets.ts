import Papa from 'papaparse';
import crypto from 'crypto';
import { normalizeDomain } from './domainNormalizer';

export interface WebsiteRow {
  domain: string;
  source_hash: string;
  category_id?: string;
  price?: number;
  da?: number;
  dr?: number;
  ahrefs_traffic?: number;
  semrush_traffic?: number;
  spam_score?: number;
  country?: string;
  language?: string;
  link_validity?: string;
  publication_type?: string;
  max_dofollow_links?: number;
  max_nofollow_links?: number;
  content_type?: string;
  platform_type?: string;
  location?: string;
  turnaround_time?: string;
  article_length?: string;
  is_listed?: boolean;
  featured?: boolean;
  content_placement_price?: number;
  link_insert_price?: number;
  cbd_content_placement_price?: number;
  cbd_content_creation_placement_price?: number;
  cbd_link_insert_price?: number;
  adult_content_placement_price?: number;
  adult_content_creation_placement_price?: number;
  adult_link_insert_price?: number;
  total_deals?: number;
  sample_link?: string;
  [key: string]: any; // Allow capturing other fields
}

// Maps google sheet headers to our internal field names
export function mapHeaders(header: string): string {
  const h = header.toLowerCase().trim();
  
  if (h === 'domain' || h === 'website' || h === 'website url' || h === 'url') return 'domain';
  if (h === 'da' || h === 'domain authority') return 'da';
  if (h === 'dr' || h === 'domain rating') return 'dr';
  if (h === 'traffic' || h === 'monthly traffic' || h === 'organic traffic' || h.includes('ahrefs traffic')) return 'ahrefs_traffic';
  if (h.includes('semrush traffic')) return 'semrush_traffic';
  if (h === 'spam score') return 'spam_score';
  if (h === 'category' || h === 'niche') return 'category_id';
  if (h === 'country' || h === 'location') return 'country';
  if (h === 'language') return 'language';
  
  // Specific Pricing Mappings
  if (h === 'content placement price' || h === 'content placement') return 'content_placement_price';
  if (h === 'link insert price' || h === 'link insert') return 'link_insert_price';
  if (h === 'cbd content placement price' || h === 'cbd content placement') return 'cbd_content_placement_price';
  if (h === 'cbd content creation & placement price' || h === 'cbd content creation & price') return 'cbd_content_creation_placement_price';
  if (h === 'cbd link insert price' || h === 'cbd link insert') return 'cbd_link_insert_price';
  if (h === 'adult content placement price' || h === 'adult content placement') return 'adult_content_placement_price';
  if (h === 'adult content creation & placement price' || h === 'adult content creation & price') return 'adult_content_creation_placement_price';
  if (h === 'adult link insert price' || h === 'adult link insert') return 'adult_link_insert_price';
  
  // Fallback for basic price if it doesn't match the specific ones
  if (h.includes('price') && !h.includes('cbd') && !h.includes('adult')) return 'price'; 

  if (h === 'total deals') return 'total_deals';
  if (h === 'sample link') return 'sample_link';
  if (h.includes('link type')) return 'link_validity';
  if (h === 'listed' || h === 'is listed' || h === 'is_listed') return 'is_listed';
  if (h === 'featured' || h === 'is featured' || h === 'is_featured') return 'featured';
  
  return h.replace(/[^a-z0-9_]/g, '_');
}

function computeHash(data: any): string {
  // Sort keys to ensure deterministic hashing
  const sortedKeys = Object.keys(data).sort();
  const sortedData: Record<string, any> = {};
  for (const key of sortedKeys) {
    if (key !== 'source_hash' && key !== 'domain') {
      sortedData[key] = data[key];
    }
  }
  const str = JSON.stringify(sortedData);
  return crypto.createHash('sha256').update(str).digest('hex');
}

export async function fetchGoogleSheet(spreadsheetId: string, sheetName?: string): Promise<{ rows: WebsiteRow[], isComplete: boolean }> {
  // Export as CSV. The URL doesn't require auth if the sheet is public.
  let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
  if (sheetName) {
    url += `&gid=${sheetName}`; // gid can be provided, but name requires API. Assuming public link works on default sheet.
  }

  const response = await fetch(url, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
  }

  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => mapHeaders(header),
      complete: (results) => {
        let isComplete = true;

        if (results.errors.length > 0) {
          // Check if it's a fatal parsing error
          const hasFatalError = results.errors.some(e => e.type === 'FieldMismatch' || e.code === 'UndetectableDelimiter' || e.code === 'TooFewFields');
          if (hasFatalError) {
            reject(new Error(`Fatal CSV Parsing Error: ${results.errors[0].message}`));
            return;
          }
          console.warn("CSV parsing warnings:", results.errors);
          // If there are warnings, we cannot guarantee the dataset is complete/perfect
          isComplete = false;
        }

        // Validate required headers
        if (!results.meta.fields || !results.meta.fields.includes('domain')) {
            reject(new Error('Missing required "domain" column in Google Sheet.'));
            return;
        }

        const rows: WebsiteRow[] = [];
        
        for (const row of results.data as any[]) {
          if (!row.domain) continue;
          
          const normalizedDomain = normalizeDomain(row.domain);
          if (!normalizedDomain) continue;

          // Parse numeric values safely
          const da = row.da ? parseInt(row.da, 10) : undefined;
          const dr = row.dr ? parseInt(row.dr, 10) : undefined;
          
          // Traffic sometimes comes as "Semrush Traffic - 1,480"
          let semrush = undefined;
          if (row.semrush_traffic) {
            const match = row.semrush_traffic.match(/[0-9,]+/);
            if (match) semrush = parseInt(match[0].replace(/,/g, ''), 10);
          }

          let ahrefs = undefined;
          if (row.ahrefs_traffic) {
            const match = row.ahrefs_traffic.match(/[0-9,]+/);
            if (match) ahrefs = parseInt(match[0].replace(/,/g, ''), 10);
          }
          
          const parsePrice = (val: any) => {
            if (!val || String(val).toUpperCase() === 'N/A') return undefined;
            const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
            return isNaN(num) ? undefined : num;
          };

          const price = parsePrice(row.price);
          const spamScore = row.spam_score ? parseInt(row.spam_score, 10) : undefined;
          const totalDeals = row.total_deals ? parseInt(row.total_deals, 10) : undefined;

          // Parse booleans safely
          const parseBoolean = (val: any) => {
            if (val === undefined || val === null || val === '') return undefined;
            const s = String(val).toLowerCase().trim();
            if (s === 'yes' || s === 'true' || s === '1' || s === 'y') return true;
            if (s === 'no' || s === 'false' || s === '0' || s === 'n') return false;
            return undefined; // fallback
          };

          const isListed = parseBoolean(row.is_listed);
          const featured = parseBoolean(row.featured);

          const parsedRow: WebsiteRow = {
            ...row,
            domain: normalizedDomain,
            da: isNaN(da as number) ? undefined : da,
            dr: isNaN(dr as number) ? undefined : dr,
            semrush_traffic: isNaN(semrush as number) ? undefined : semrush,
            ahrefs_traffic: isNaN(ahrefs as number) ? undefined : ahrefs,
            price: price,
            spam_score: isNaN(spamScore as number) ? undefined : spamScore,
            category_id: row.category_id || 'General',
            is_listed: isListed,
            featured: featured,
            content_placement_price: parsePrice(row.content_placement_price),
            link_insert_price: parsePrice(row.link_insert_price),
            cbd_content_placement_price: parsePrice(row.cbd_content_placement_price),
            cbd_content_creation_placement_price: parsePrice(row.cbd_content_creation_placement_price),
            cbd_link_insert_price: parsePrice(row.cbd_link_insert_price),
            adult_content_placement_price: parsePrice(row.adult_content_placement_price),
            adult_content_creation_placement_price: parsePrice(row.adult_content_creation_placement_price),
            adult_link_insert_price: parsePrice(row.adult_link_insert_price),
            total_deals: isNaN(totalDeals as number) ? undefined : totalDeals,
            sample_link: row.sample_link !== 'N/A' && row.sample_link ? row.sample_link : undefined,
            source_hash: '', // Placeholder
          };

          parsedRow.source_hash = computeHash(parsedRow);
          rows.push(parsedRow);
        }
        resolve({ rows, isComplete });
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
}
