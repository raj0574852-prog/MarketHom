const fs = require('fs');

async function runAudit() {
  console.log("Reading domains.txt...");
  let urls = [];
  try {
    const text = fs.readFileSync('domains.txt', 'utf8');
    const domains = text.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    urls = domains.slice(0, 50).map(d => `https://www.educationhom.com/website/${d}`);
  } catch(e) {
    console.log("Failed to read domains.txt", e);
    return;
  }
  
  console.log(`Found ${urls.length} sites. Auditing...`);
  
  const results = {
    total: urls.length,
    indexed: 0,
    noindex: 0,
    canonical_matches: 0,
    canonical_mismatches: 0,
    has_price_in_html: 0,
    has_price_in_jsonld: 0,
    has_product_schema: 0,
    has_organization_schema: 0,
    has_duplicate_overview: 0,
    tierA: 0,
    tierB: 0,
    tierC: 0,
    invalid_favicon: 0
  };

  const duplicationMap = new Map();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const html = await res.text();
      
      // Indexability (simulate by checking robots tag)
      if (html.includes('content="noindex')) {
        results.noindex++;
        results.tierC++; // Assuming NOINDEX means Tier C in our rules
      } else {
        results.indexed++;
        if (html.includes('Publisher Overview') || html.includes('Editorial Focus')) {
           results.tierA++;
        } else {
           results.tierB++;
        }
      }
      
      // Canonical
      const canonicalRegex = /<link rel="canonical" href="([^"]+)"/;
      const match = html.match(canonicalRegex);
      if (match && match[1] === url) {
        results.canonical_matches++;
      } else {
        results.canonical_mismatches++;
        console.log(`Mismatch: Expected ${url}, Got ${match ? match[1] : 'none'}`);
      }
      
      // Price Check
      const hasAnyPrice = /\$[0-9,]+/.test(html);
      if (hasAnyPrice) {
        // Exclude the JSON-LD occurrence from standard text check if needed, but we check raw HTML
        const bodyText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        if (/\$[0-9,]+/.test(bodyText)) {
          results.has_price_in_html++;
        }
        if (/"price":\s*"?\d+"?/.test(html)) {
          results.has_price_in_jsonld++;
        }
      }
      
      // Schema
      if (html.includes('"@type":"Product"') || html.includes('"@type": "Product"')) results.has_product_schema++;
      if (html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"')) results.has_organization_schema++;
      
      // Duplication text check (QuickAnswer)
      const quickAnswerMatch = html.match(/<strong>[^<]+<\/strong> is a [^-]+-focused publishing opportunity/);
      if (quickAnswerMatch) {
        const str = quickAnswerMatch[0];
        duplicationMap.set(str, (duplicationMap.get(str) || 0) + 1);
      }
      
      // Favicon Check
      const faviconRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]+logo)"/i;
      const favMatch = html.match(faviconRegex);
      if (favMatch && favMatch[1] && !favMatch[1].includes('google.com/s2/favicons') && !favMatch[1].startsWith('/_next') && !favMatch[1].startsWith('/icon')) {
        results.invalid_favicon++;
      }

    } catch(e) {
      console.log(`Failed to fetch ${url}`, e);
    }
  }

  console.log("\n--- AUDIT RESULTS ---");
  console.log(JSON.stringify(results, null, 2));
  console.log("Duplication Map Size (Unique Quick Answers):", duplicationMap.size);
  fs.writeFileSync('phase18_audit_results.json', JSON.stringify({results, duplicateAnswers: Object.fromEntries(duplicationMap)}, null, 2));
}

runAudit();
