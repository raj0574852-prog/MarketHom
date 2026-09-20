const fs = require('fs');

const slugs = [
  'businessinsider.com',
  'benzinga.com',
  'forbes.com',
  'techcrunch.com',
  'apnews.com',
  'globenewswire.com',
  'mashable.com',
  'entrepreneur.com',
  'yahoo.com',
  'reuters.com'
];

async function run() {
  for (const slug of slugs) {
    try {
      const response = await fetch(`http://localhost:3000/websites/${slug}`);
      if (response.status === 404) {
        console.log(`${slug}: 404 Not Found`);
        continue;
      }
      const html = await response.text();
      
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      const h1 = h1Match ? h1Match[1] : 'NOT FOUND';
      
      const qaMatch = html.match(/Quick Answer/);
      const oppMatch = html.match(/Publishing Opportunity/);
      const overviewMatch = html.match(/Publisher Overview/);
      const guidelinesMatch = html.match(/Publishing Guidelines/);
      const acceptedMatch = html.match(/Accepted Niches &amp; Content Rules/);
      
      const priceLeaks = [];
      if (html.includes('base_price')) priceLeaks.push('base_price');
      if (html.includes('internal_cost')) priceLeaks.push('internal_cost');
      if (html.includes('website.price')) priceLeaks.push('website.price');
      
      console.log(`\n=== ${slug} ===`);
      console.log(`H1: ${h1}`);
      console.log(`Has Quick Answer: ${!!qaMatch}`);
      console.log(`Has Publisher Overview: ${!!overviewMatch}`);
      console.log(`Has Publishing Opportunity: ${!!oppMatch}`);
      console.log(`Has Publishing Guidelines: ${!!guidelinesMatch}`);
      console.log(`Has Accepted Content: ${!!acceptedMatch}`);
      console.log(`Price Leaks: ${priceLeaks.length > 0 ? priceLeaks.join(', ') : 'NONE'}`);
      
    } catch (e) {
      console.error(`Failed to fetch ${slug}:`, e.message);
    }
  }
}

run();
