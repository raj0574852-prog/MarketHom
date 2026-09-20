const fs = require('fs');
const http = require('http');
const https = require('https');

// Helper to check if a URL returns a 200 OK
function checkImage(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function processDomains() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Please provide a file with domains, e.g., node get_logos.js domains.txt");
    process.exit(1);
  }

  const domains = fs.readFileSync(inputFile, 'utf8').split('\n').map(d => d.trim()).filter(Boolean);
  console.log(`Processing ${domains.length} domains...`);
  
  const results = [];
  
  for (const domain of domains) {
    // Basic clean up of domain (remove http://, www.)
    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    // Clearbit Logo API is the most reliable free logo API
    const logoUrl = `https://logo.clearbit.com/${cleanDomain}`;
    
    const isValid = await checkImage(logoUrl);
    if (isValid) {
      results.push(`${domain},${logoUrl}`);
    } else {
      // Try Google Favicon API as fallback (returns a small icon, usually always works)
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
      results.push(`${domain},${faviconUrl}`);
    }
  }

  fs.writeFileSync('logos_output.csv', 'Domain,Logo URL\n' + results.join('\n'));
  console.log("Done! Check logos_output.csv");
}

processDomains();
