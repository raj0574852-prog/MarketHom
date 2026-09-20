const urls = [
  'https://www.educationhom.com/websites',
  'https://www.educationhom.com/websites/apnews.com',
  'https://www.educationhom.com/websites/markets.businessinsider.com',
  'https://www.educationhom.com/websites/reuters.com',
  'https://www.educationhom.com/websites/globenewswire.com',
  'https://www.educationhom.com/websites/bhaskar.com',
  'https://www.educationhom.com/websites/entrepreneur.com',
  'https://www.educationhom.com/websites/nonexistent-test-domain.example',
  'https://www.educationhom.com/sitemap.xml',
  'https://www.educationhom.com/robots.txt'
];

async function testUrl(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    
    let result = {
      url: url.split('.com')[1] || url,
      status: res.status,
      h1: false,
      canonical: false,
      robots: false,
      pricing: false,
      about: false,
      logoFallback: false,
      logoImage: false
    };

    if (res.status === 200 && url.includes('/websites/')) {
      result.h1 = /<h1[^>]*>.*?<\/h1>/i.test(text);
      result.canonical = /<link[^>]*rel="canonical"[^>]*>/i.test(text);
      result.robots = /<meta[^>]*name="robots"[^>]*content="index,\s*follow"[^>]*>/i.test(text);
      result.pricing = /Starting At/i.test(text) || /\$/i.test(text);
      result.about = /<h2[^>]*>About.*?<\/h2>/i.test(text) || !text.includes('About '); // It might not have an About section if no descriptions exist
      result.logoFallback = /<div[^>]*class="w-24 h-24[^>]*uppercase[^>]*>/i.test(text);
      result.logoImage = /<img[^>]*alt=".*?logo"[^>]*>/i.test(text);
    }

    return result;
  } catch (e) {
    return { url, status: 'ERROR', error: e.message };
  }
}

async function run() {
  console.log("Running production smoke test...");
  const results = await Promise.all(urls.map(testUrl));
  console.table(results);
}

run();
