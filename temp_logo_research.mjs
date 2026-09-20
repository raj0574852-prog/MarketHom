import fs from 'fs';
import * as cheerio from 'cheerio';
import https from 'https';
import http from 'http';

const domains = [
  'thehindu.com',
  'allhiphop.com',
  'sarkariexam.com',
  'standartnews.com',
  'deviantart.com',
  'chicagotribune.com',
  'dailycaller.com',
  'betensured.com',
  'sourceforge.net',
  'goodmenproject.com',
  'pctechmag.com',
  'rawmags.com',
  'dgmnews.com',
  'mensxp.com',
  'dailynewsreleases.com',
  'techbullion.com',
  'homesblogs.com',
  'mercedesblog.com',
  'thaigernews.com',
  'gecktech.com',
  'sayingwhisper.com',
  'thunderstormnews.com',
  'kaggle.com',
  'qpoenergy.com',
  'homebusinessmag.com',
  'epicauralife.com',
  'wptavern.com',
  'officerprofile.com',
  'blessingread.com',
  'thenamestories.com'
];

async function fetchHtml(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (e) {
    return null;
  }
}

async function checkImage(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*'
      },
      signal: AbortSignal.timeout(5000)
    });
    // some servers don't support HEAD or return 403 for it, fallback to GET if needed
    if (response.status === 405 || response.status === 403) {
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/*'
        },
        signal: AbortSignal.timeout(5000)
      });
      return { ok: getResponse.ok, status: getResponse.status, contentType: getResponse.headers.get('content-type') };
    }
    return { ok: response.ok, status: response.status, contentType: response.headers.get('content-type') };
  } catch (e) {
    return { ok: false, status: 0, contentType: null, error: e.message };
  }
}

function resolveUrl(base, relative) {
  if (!relative) return null;
  try {
    return new URL(relative, base).href;
  } catch {
    return null;
  }
}

async function findLogoOnPage(domain) {
  const url = `https://${domain}`;
  const html = await fetchHtml(url);
  if (!html) return null;
  
  const $ = cheerio.load(html);
  let bestLogo = null;
  
  // Look for conventional logo identifiers
  const selectors = [
    'a.logo img', 'a#logo img', 'img.logo', 'img#logo', 
    'header img[alt*="logo" i]', 'header img[src*="logo" i]',
    'nav img[alt*="logo" i]', 'nav img[src*="logo" i]',
    'div.logo img', 'img[alt="Logo"]'
  ];
  
  for (const sel of selectors) {
    const img = $(sel).first();
    if (img.length > 0) {
      const src = img.attr('src') || img.attr('data-src');
      if (src) {
        bestLogo = resolveUrl(url, src);
        if (bestLogo && !bestLogo.endsWith('.gif') && !bestLogo.includes('data:image')) {
          // If we found a good SVG or PNG logo, return it
          return bestLogo;
        }
      }
    }
  }
  
  // Schema.org logo
  try {
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      const json = JSON.parse($(scripts[i]).html());
      if (json && typeof json === 'object') {
        const findLogoInJson = (obj) => {
          if (obj.logo) {
            if (typeof obj.logo === 'string') return obj.logo;
            if (obj.logo.url) return obj.logo.url;
          }
          if (obj.publisher && obj.publisher.logo) {
            if (typeof obj.publisher.logo === 'string') return obj.publisher.logo;
            if (typeof obj.publisher.logo.url) return obj.publisher.logo.url;
          }
          return null;
        };
        const l = findLogoInJson(json);
        if (l) {
          bestLogo = resolveUrl(url, l);
          if (bestLogo) return bestLogo;
        }
      }
    }
  } catch (e) {}

  // meta og:image (often not a transparent logo but fallback)
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) {
    bestLogo = resolveUrl(url, ogImage);
  }
  
  return bestLogo;
}

async function getEducationHomLogo(domain) {
  const html = await fetchHtml(`https://www.educationhom.com/websites/${domain}`);
  if (!html) return null;
  const $ = cheerio.load(html);
  
  // PublisherLogo typically renders as:
  // <img src="URL" alt="domain logo" class="... object-contain ..." />
  const img = $(`img[alt*="logo" i]`).first();
  if (img.length > 0) {
    const src = img.attr('src');
    if (src && !src.startsWith('/_next/')) {
       return src;
    }
  }
  return null;
}

async function main() {
  const results = [];
  
  for (const domain of domains) {
    console.log(`Processing ${domain}...`);
    let currentLogo = await getEducationHomLogo(domain);
    let recommendedLogo = null;
    
    // Evaluate current logo
    let currentStatus = 'MISSING';
    if (currentLogo) {
      const check = await checkImage(currentLogo);
      if (check.ok) {
        if (check.contentType && !check.contentType.startsWith('image/')) {
          currentStatus = 'INVALID';
        } else if (currentLogo.includes('favicon')) {
          currentStatus = 'ACCEPTABLE'; // Favicon
        } else {
          currentStatus = 'GOOD';
        }
      } else {
        currentStatus = 'BROKEN';
      }
    }
    
    if (currentStatus === 'GOOD' || currentStatus === 'ACCEPTABLE') {
      recommendedLogo = currentLogo;
    } else {
      // Find a new logo
      const foundLogo = await findLogoOnPage(domain);
      if (foundLogo) {
        const check = await checkImage(foundLogo);
        if (check.ok && check.contentType && check.contentType.startsWith('image/')) {
          recommendedLogo = foundLogo;
        }
      }
    }
    
    // Check if Wikimedia Commons has one (just a simple query, skipping for now to keep it simple, will add if needed)
    
    let action = 'MANUAL REVIEW';
    if (recommendedLogo === currentLogo && currentStatus === 'GOOD') {
      action = 'KEEP CURRENT';
    } else if (recommendedLogo && currentLogo && recommendedLogo !== currentLogo) {
      action = 'REPLACE';
    } else if (recommendedLogo && !currentLogo) {
      action = 'ADD';
    }
    
    // Validate recommended logo
    let httpStatus = 'N/A';
    let contentType = 'N/A';
    if (recommendedLogo) {
      const check = await checkImage(recommendedLogo);
      if (check.ok) {
        httpStatus = check.status;
        contentType = check.contentType || 'unknown';
      } else {
        recommendedLogo = null; // Found logo is broken
        action = 'MANUAL REVIEW';
      }
    }
    
    results.push({
      domain,
      currentLogo: currentLogo || 'N/A',
      currentStatus,
      recommendedLogo: recommendedLogo || 'N/A',
      httpStatus,
      contentType,
      source: recommendedLogo ? 'OFFICIAL WEBSITE' : 'N/A',
      action
    });
  }
  
  fs.writeFileSync('C:/Users/abhay/.gemini/antigravity/brain/a03b1e8a-f2fc-4876-b5e7-12a38d2eaa8d/scratch/logo_results.json', JSON.stringify(results, null, 2));
  console.log("Done.");
}

main();
