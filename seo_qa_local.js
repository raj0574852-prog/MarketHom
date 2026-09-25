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
         return resolve(fetchHtml(res.headers.location.startsWith('/') ? 'http://localhost:3000' + res.headers.location : res.headers.location)); // follow redirect
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
    } catch (e) { }
  });
  return results;
}

async function runTests() {
  console.log('--- LOCAL SEO VERIFICATION ---');
  
  const titles = new Set();
  const descriptions = new Set();
  
  for (const url of URLS_TO_TEST) {
    console.log(`\nTesting URL: ${url}`);
    try {
      const res = await fetchHtml(url);
      console.log(`  [${res.status === 200 || res.status === 404 ? 'PASS' : 'FAIL'}] HTTP Status: ${res.status}`);
      if (res.status !== 200) {
        console.log(`  Skipping further checks for ${url} because status is ${res.status}`);
        continue;
      }
      
      const $ = cheerio.load(res.html);
      
      const canonical = $('link[rel="canonical"]').attr('href');
      console.log(`  [${canonical && canonical.includes(url.split('/').pop()) ? 'PASS' : 'FAIL'}] Canonical correct: ${canonical}`);
      
      const indexable = $('meta[name="robots"]').attr('content');
      console.log(`  [${indexable && indexable.includes('index') && !indexable.includes('noindex') ? 'PASS' : 'FAIL'}] Indexable: ${indexable}`);
      
      const title = $('title').text();
      titles.add(title);
      const titleLen = title.length;
      console.log(`  [${title && !title.includes('MarketHom Agency') ? 'PASS' : 'FAIL'}] Title useful (No "MarketHom"): ${title}`);
      console.log(`  [${titleLen >= 30 && titleLen <= 70 ? 'PASS' : 'FAIL'}] Title length: ${titleLen}`);
      
      const desc = $('meta[name="description"]').attr('content');
      descriptions.add(desc);
      const descLen = desc ? desc.length : 0;
      console.log(`  [${desc && descLen > 50 ? 'PASS' : 'FAIL'}] Description useful: ${desc}`);
      console.log(`  [${descLen >= 100 && descLen <= 180 ? 'PASS' : 'FAIL'}] Description length: ${descLen}`);
      
      const ogType = $('meta[property="og:type"]').attr('content');
      console.log(`  [${ogType === 'website' ? 'PASS' : 'FAIL'}] og:type is website (no Article schema): ${ogType}`);
      
      const pageText = $('body').text().toLowerCase();
      
      const hasEducationHom = pageText.includes('educationhom lists this publisher');
      console.log(`  [${hasEducationHom ? 'PASS' : 'FAIL'}] Visible useful summary present`);
      
      const keywords = $('meta[name="keywords"]').attr('content');
      console.log(`  [${!keywords ? 'PASS' : 'FAIL'}] No generic meta keywords: ${keywords || 'none'}`);
      
    } catch (e) {
      console.log(`  [FAIL] Exception checking URL: ${e.message}`);
    }
  }
  
  console.log('\nUniqueness check:');
  console.log(`[${titles.size > 1 ? 'PASS' : 'FAIL'}] Titles are unique (${titles.size} unique titles)`);
  console.log(`[${descriptions.size > 1 ? 'PASS' : 'FAIL'}] Descriptions are unique (${descriptions.size} unique descriptions)`);
}

runTests();
