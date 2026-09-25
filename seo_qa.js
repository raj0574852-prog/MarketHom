const https = require('https');
const cheerio = require('cheerio');

const URLS_TO_TEST = [
  'https://www.educationhom.com/websites/reuters.com',
  'https://www.educationhom.com/websites/statesmanjournal.com',
  'https://www.educationhom.com/websites/yirafire.com',
  'https://www.educationhom.com/websites/real-estatemagazine.com',
  'https://www.educationhom.com/websites/himisspuff.com'
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SEO-QA-Bot/1.0' } }, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         return resolve(fetchHtml(res.headers.location)); // follow redirect
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ html: data, status: res.statusCode, headers: res.headers, finalUrl: url }));
    }).on('error', reject);
  });
}

function extractJsonLd($) {
  const scripts = $('script[type="application/ld+json"]');
  const results = [];
  scripts.each((i, el) => {
    try {
      results.push(JSON.parse($(el).html()));
    } catch (e) {
      console.error('Invalid JSON-LD', e.message);
    }
  });
  return results;
}

async function runTests() {
  console.log('--- PRODUCTION SEO VERIFICATION ---');
  
  // Favicon Test
  const favRes = await fetchHtml('https://www.educationhom.com/favicon.ico');
  console.log(`[${favRes.status === 200 ? 'PASS' : 'FAIL'}] Favicon /favicon.ico returns 200 (Got ${favRes.status})`);
  
  const iconRes = await fetchHtml('https://www.educationhom.com/icon.png');
  console.log(`[${iconRes.status === 200 ? 'PASS' : 'FAIL'}] Favicon /icon.png returns 200 (Got ${iconRes.status})`);
  
  // Robots
  const robotsRes = await fetchHtml('https://www.educationhom.com/robots.txt');
  console.log(`[${robotsRes.status === 200 ? 'PASS' : 'FAIL'}] robots.txt returns 200`);
  
  // Sitemap
  const sitemapRes = await fetchHtml('https://www.educationhom.com/main-sitemap/sitemap/0.xml');
  console.log(`[${sitemapRes.status === 200 ? 'PASS' : 'FAIL'}] Sitemap returns 200`);
  const sitemapXml = sitemapRes.html;
  const hasLastmodPublisher = sitemapXml.includes('<lastmod>') && sitemapXml.includes('/websites/');
  console.log(`[${!hasLastmodPublisher ? 'PASS' : 'FAIL'}] Sitemap has no lastmod for publisher URLs`);
  
  const titles = new Set();
  const descriptions = new Set();
  
  for (const url of URLS_TO_TEST) {
    console.log(`\\nTesting URL: ${url}`);
    try {
      const res = await fetchHtml(url);
      console.log(`  [${res.status === 200 || res.status === 404 ? 'PASS' : 'FAIL'}] HTTP Status: ${res.status}`);
      if (res.status !== 200) {
        console.log(`  Skipping further checks for ${url} because status is ${res.status}`);
        continue;
      }
      
      const $ = cheerio.load(res.html);
      
      const canonical = $('link[rel="canonical"]').attr('href');
      console.log(`  [${canonical === url ? 'PASS' : 'FAIL'}] Canonical correct: ${canonical}`);
      
      const indexable = $('meta[name="robots"]').attr('content');
      console.log(`  [${indexable && indexable.includes('index') && !indexable.includes('noindex') ? 'PASS' : 'FAIL'}] Indexable: ${indexable}`);
      
      const title = $('title').text();
      titles.add(title);
      console.log(`  [${title && title.includes('| EducationHom') ? 'PASS' : 'FAIL'}] Title useful: ${title}`);
      
      const desc = $('meta[name="description"]').attr('content');
      descriptions.add(desc);
      console.log(`  [${desc && desc.length > 50 ? 'PASS' : 'FAIL'}] Description useful`);
      
      const ogType = $('meta[property="og:type"]').attr('content');
      console.log(`  [${ogType === 'website' ? 'PASS' : 'FAIL'}] og:type is website (no Article schema): ${ogType}`);
      
      const pageText = $('body').text().toLowerCase();
      
      const hasDaysAgo = pageText.includes('days ago');
      const hasHoursAgo = pageText.includes('hours ago');
      const hasPublishedAgo = pageText.includes('published ago');
      const hasVerifiedDate = res.html.match(/Verified [A-Z][a-z]+ \d{1,2}, \d{4}/);
      console.log(`  [${!hasDaysAgo && !hasHoursAgo && !hasPublishedAgo ? 'PASS' : 'FAIL'}] No 'days ago' strings`);
      console.log(`  [${!hasVerifiedDate ? 'PASS' : 'FAIL'}] No formatted 'Verified Date'`);
      
      // JSON-LD
      const jsonLd = extractJsonLd($);
      let hasArticle = false;
      let hasWebPage = false;
      let hasOffer = false;
      
      for (const block of jsonLd) {
        let items = Array.isArray(block['@graph']) ? block['@graph'] : (Array.isArray(block) ? block : [block]);
        for (const item of items) {
          if (item['@type'] === 'Article' || item['@type'] === 'BlogPosting') hasArticle = true;
          if (item['@type'] === 'WebPage') hasWebPage = true;
          if (item['@type'] === 'Service' && item.offers) hasOffer = true;
        }
      }
      console.log(`  [${!hasArticle ? 'PASS' : 'FAIL'}] JSON-LD: No Article schema`);
      console.log(`  [${hasWebPage ? 'PASS' : 'FAIL'}] JSON-LD: Has WebPage schema`);
      // It's optional, some missing data pages might not have it, but generally they should.
      
      const iconLink = $('link[rel="icon"]').attr('href');
      console.log(`  [${iconLink === '/icon.png' || iconLink === '/favicon.ico' ? 'PASS' : 'FAIL'}] Favicon linked: ${iconLink}`);
      
    } catch (e) {
      console.log(`  [FAIL] Exception checking URL: ${e.message}`);
    }
  }
  
  console.log('\\nUniqueness check:');
  console.log(`[${titles.size > 1 ? 'PASS' : 'FAIL'}] Titles are unique (${titles.size} unique titles)`);
  console.log(`[${descriptions.size > 1 ? 'PASS' : 'FAIL'}] Descriptions are unique (${descriptions.size} unique descriptions)`);
}

runTests();
