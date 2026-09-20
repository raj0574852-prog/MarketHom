const fs = require('fs');

async function runAudit() {
  const slugsStr = fs.readFileSync('prod_slugs.json', 'utf8');
  const slugs = JSON.parse(slugsStr);
  
  const results = [];
  let priceLeaks = 0;
  
  for (const slug of slugs) {
    const url = `https://www.educationhom.com/websites/${slug}`;
    console.log(`Auditing ${url}...`);
    try {
      const res = await fetch(url);
      const html = await res.text();
      
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      const h1Text = h1Match ? h1Match[1].replace(/<!-- -->/g, '').trim() : 'Missing';
      
      const hasQuickAnswer = html.includes('Quick Answer') || html.includes('quick-answer');
      const hasPublisherOverview = html.includes('Publisher Overview');
      const hasOpportunity = html.includes('Publishing Opportunity');
      
      const hasNiches = html.includes('Accepted Niches') || html.includes('Content Rules');
      const hasFAQ = html.includes('Frequently Asked Questions') || html.includes('FAQ');
      
      // Check for price leaks
      const leaks = [];
      if (html.includes('base_price')) leaks.push('base_price');
      if (html.includes('internal_cost')) leaks.push('internal_cost');
      if (html.includes('website.price')) leaks.push('website.price');
      
      // JSON-LD
      const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
      let jsonLdValid = jsonLdMatches.length > 0;
      let hasFAQSchema = false;
      
      for (const m of jsonLdMatches) {
        if (m[1].includes('FAQPage')) hasFAQSchema = true;
      }
      
      results.push({
        slug,
        url,
        h1: h1Text,
        hasQuickAnswer,
        hasPublisherOverview,
        hasOpportunity,
        hasNiches,
        hasFAQ,
        leaks: leaks,
        jsonLdValid,
        hasFAQSchema
      });
      
    } catch(e) {
      console.error(`Failed ${slug}`, e);
    }
  }
  
  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
  console.log('Audit complete.');
}

runAudit();
