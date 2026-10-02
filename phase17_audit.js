const fs = require('fs');

async function checkUrl(url, isLegacy = false) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const text = await res.text();
    
    if (isLegacy) {
      return { url, status: res.status, location: res.headers.get('location') };
    }
    
    // Parse HTML
    const canonical = text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i)?.[1];
    const robotsMatch = text.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"[^>]*>/i);
    const robots = robotsMatch ? robotsMatch[1] : null;
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;
    const descMatch = text.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i);
    const desc = descMatch ? descMatch[1] : null;
    
    // Check price leaks
    let hasPriceLeak = false;
    if (desc) {
      hasPriceLeak = desc.includes('$') || desc.includes('price') || /(starting at|from \$)/i.test(desc);
    }
    
    // Check date signals
    const dateSignals = /datePublished|dateModified|publishedTime|modifiedTime|article:published_time|article:modified_time|"days ago"|"hours ago"/.test(text);
    
    // Schemas
    const schemas = [...text.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => {
      try { return JSON.parse(m[1]); } catch(e) { return null; }
    }).filter(Boolean);
    
    let hasProduct = false, hasOffer = false, hasOrg = false, hasBreadcrumb = false, hasFAQ = false;
    let offerPrice = null;
    let orgIdentityCheck = true;
    
    for (const schema of schemas) {
      const type = schema['@type'];
      if (type === 'Product' || (schema['@graph'] && schema['@graph'].some(g => g['@type'] === 'Product'))) {
        hasProduct = true;
        const prod = schema['@type'] === 'Product' ? schema : schema['@graph'].find(g => g['@type'] === 'Product');
        if (prod && prod.offers) {
          hasOffer = true;
          offerPrice = prod.offers.price;
        }
      }
      if (type === 'Organization' || (schema['@graph'] && schema['@graph'].some(g => g['@type'] === 'Organization'))) {
        hasOrg = true;
      }
      if (type === 'BreadcrumbList' || (schema['@graph'] && schema['@graph'].some(g => g['@type'] === 'BreadcrumbList'))) {
        hasBreadcrumb = true;
      }
      if (type === 'FAQPage' || type === 'QAPage' || (schema['@graph'] && schema['@graph'].some(g => g['@type'] === 'FAQPage' || g['@type'] === 'QAPage'))) {
        hasFAQ = true;
      }
    }
    
    // Logo
    const hasFaviconImg = text.includes('https://www.google.com/s2/favicons?domain=');
    const hasBadLogo = text.includes('clearbit.com') || text.includes('logo.dev');
    
    // H1
    const h1Count = [...text.matchAll(/<h1[^>]*>/gi)].length;
    
    return {
      url,
      status: res.status,
      canonical,
      robots,
      title: !!title,
      desc: !!desc,
      hasPriceLeak,
      dateSignals,
      hasProduct,
      offerPrice,
      hasOrg,
      hasBreadcrumb,
      hasFAQ,
      hasFaviconImg,
      hasBadLogo,
      h1Count,
      ok: res.ok
    };
  } catch(e) {
    return { url, error: e.message };
  }
}

async function run() {
  const domains = fs.readFileSync('domains.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  const testDomains = ['reuters.com', 'casinobestpro.com', ...domains.slice(0, 30)];
  
  const results = [];
  
  console.log('Testing core URLs...');
  results.push(await checkUrl('https://www.educationhom.com/websites'));
  results.push(await checkUrl('https://www.educationhom.com/websites/category/business'));
  
  console.log('Testing legacy URLs...');
  for (let i = 0; i < 5; i++) {
    results.push(await checkUrl(`https://www.educationhom.com/websites/${testDomains[i]}`, true));
  }
  
  console.log(`Testing ${testDomains.length} publisher URLs...`);
  for (const domain of testDomains) {
    const res = await checkUrl(`https://www.educationhom.com/website/${domain}`);
    if (res.ok) results.push(res);
  }
  
  fs.writeFileSync('audit_phase17_results.json', JSON.stringify(results, null, 2));
  console.log('Done! Wrote audit_phase17_results.json');
}

run();
