const fs = require('fs');
const path = require('path');

function extractJsonLd(content) {
  const match = content.match(/<script type="application\/ld\+json"(?:[^>]*)>([\s\S]*?)<\/script>/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse JSON-LD", e);
    }
  }
  return null;
}

// We cannot easily run Next.js App Router components outside the framework without extensive mocking.
// Instead, let's read the source code and extract the logic for JSON-LD generation directly.
const pageCode = fs.readFileSync(path.join(__dirname, 'src/app/websites/[slug]/page.tsx'), 'utf-8');

// The logic we want to verify is:
/*
  ...(website.content_placement_selling_price ? [{
    '@type': 'Service',
    '@id': `${canonical}#service`,
    'name': `Content Placement on ${website.name || website.domain}`,
    'serviceType': 'Guest Post and Content Placement',
    'description': website.short_description || `Premium publishing opportunity on ${website.domain}. Secure high-quality backlinks.`,
    'url': canonical,
    'provider': {
      '@type': 'Organization',
      'name': 'EducationHom',
      'url': CANONICAL_SITE_URL
    },
    'offers': {
      '@type': 'Offer',
      'url': canonical,
      'priceCurrency': website.currency || 'USD',
      'price': website.content_placement_selling_price,
      'availability': 'https://schema.org/InStock'
    }
  }] : [])
*/

const isServicePresent = pageCode.includes("'@type': 'Service'");
const isOfferPresent = pageCode.includes("'@type': 'Offer'");
const isProductPresent = pageCode.includes("'@type': 'Product'");
const isSellingPriceUsed = pageCode.includes("'price': website.content_placement_selling_price");
const isCurrencyUsed = pageCode.includes("'priceCurrency': website.currency || 'USD'");

console.log("Service Schema Present:", isServicePresent);
console.log("Offer Schema Present:", isOfferPresent);
console.log("Product Schema Present:", isProductPresent);
console.log("Selling Price Used in Offer:", isSellingPriceUsed);
console.log("Currency Used in Offer:", isCurrencyUsed);

// For the live URLs, we can fetch their current live prices since we don't have DB access locally.
async function fetchLivePrices() {
  const domains = ['bakenstein.com', 'reuters.com', 'armalco.info'];
  
  for (const domain of domains) {
    try {
      const res = await fetch(`https://www.educationhom.com/websites/${domain}`);
      const text = await res.text();
      // Search for "Starting At" price
      const priceMatch = text.match(/Starting At<\/p><div[^>]*><div[^>]*><span[^>]*>(\$|€|£)?([\d,.]+)/i);
      
      let price = "N/A";
      let currency = "N/A";
      if (priceMatch) {
        currency = priceMatch[1] === '$' ? 'USD' : priceMatch[1] || 'USD';
        price = priceMatch[2];
      }
      
      console.log(`${domain} | Visible Price: ${price} | Currency: ${currency}`);
    } catch (e) {
      console.log(`Failed to fetch ${domain}: ${e.message}`);
    }
  }
}

fetchLivePrices();
