import dns from 'dns/promises';
import { URL } from 'url';

const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const TIMEOUT_MS = 3000;
const MAX_REDIRECTS = 3;
const MAX_CONTENT_LENGTH = 1024 * 1024; // 1MB

// Extract domain to IP and check against forbidden ranges
async function validateDestinationSafe(targetUrl: string): Promise<boolean> {
  try {
    const urlObj = new URL(targetUrl);
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return false;
    }

    const hostname = urlObj.hostname;
    // Basic string checks
    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return false;
    }

    // Attempt to resolve IP
    const addresses = await dns.resolve(hostname);
    for (const ip of addresses) {
      // Check common private/loopback/cloud subnets
      if (
        ip === '127.0.0.1' ||
        ip === '::1' ||
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
        ip.startsWith('169.254.')
      ) {
        return false;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

// Safely fetch a URL following redirects carefully
async function safeFetch(url: string, redirects = 0): Promise<Response | null> {
  if (redirects > MAX_REDIRECTS) return null;

  if (!(await validateDestinationSafe(url))) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual', // Prevent automatic following to intercept redirects
      headers: {
        'User-Agent': 'MarketHom Logo Discovery (+https://markethom.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // Handle Redirects safely
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) return null;
      
      const nextUrl = new URL(location, url).href;
      return safeFetch(nextUrl, redirects + 1);
    }

    // Limit size if Content-Length is provided
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_LENGTH) {
      return null;
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function discoverLogoUrl(domain: string): Promise<string | null> {
  const protocolUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  const response = await safeFetch(protocolUrl);
  if (!response || !response.ok) {
    return null;
  }

  // Ensure we have HTML to parse for icons
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return null;
  }

  const htmlBuffer = await response.arrayBuffer();
  // Double check size in case content-length was missing
  if (htmlBuffer.byteLength > MAX_CONTENT_LENGTH) {
    return null;
  }
  
  const html = new TextDecoder().decode(htmlBuffer);

  // Extract <link rel="icon|shortcut icon|apple-touch-icon" href="...">
  const matches = [...html.matchAll(/<link[^>]*rel=["']?([^"'>]+)["']?[^>]*href=["']?([^"'>]+)["']?[^>]*>/gi)];
  // Also try reversed attribute order (href then rel)
  const matchesRev = [...html.matchAll(/<link[^>]*href=["']?([^"'>]+)["']?[^>]*rel=["']?([^"'>]+)["']?[^>]*>/gi)];

  const links: { rel: string, href: string }[] = [];
  
  for (const m of matches) {
    links.push({ rel: m[1].toLowerCase(), href: m[2] });
  }
  for (const m of matchesRev) {
    links.push({ rel: m[2].toLowerCase(), href: m[1] }); // Note swapped order
  }

  let bestHref: string | null = null;
  
  // Priority: 1. icon, 2. shortcut icon, 3. apple-touch-icon
  const getHrefByRel = (targetRels: string[]) => {
    const found = links.find(l => {
      const rels = l.rel.split(' ').map(r => r.trim());
      return targetRels.some(tr => rels.includes(tr));
    });
    return found ? found.href : null;
  };

  bestHref = getHrefByRel(['icon']) || getHrefByRel(['shortcut']) || getHrefByRel(['apple-touch-icon']);

  // Check manifest if no link tag is found
  if (!bestHref) {
    const manifestMatch = html.match(/<link[^>]*rel=["']?manifest["']?[^>]*href=["']?([^"'>]+)["']?[^>]*>/i);
    if (manifestMatch) {
       const manifestUrl = new URL(manifestMatch[1], protocolUrl).href;
       const manifestRes = await safeFetch(manifestUrl);
       if (manifestRes && manifestRes.ok) {
         try {
           const manifestJson = await manifestRes.json();
           if (manifestJson.icons && manifestJson.icons.length > 0) {
             // Prefer reasonably sized icons or just take the first
             bestHref = manifestJson.icons[0].src;
           }
         } catch(e) {}
       }
    }
  }
  
  // Fallback to absolute favicon.ico
  if (!bestHref) {
    const defaultFavicon = new URL('/favicon.ico', protocolUrl).href;
    const favRes = await safeFetch(defaultFavicon);
    if (favRes && favRes.ok) {
        const ct = favRes.headers.get('content-type') || '';
        if (ct.includes('image/')) {
            bestHref = '/favicon.ico';
        }
    }
  }

  if (!bestHref) {
    return null;
  }

  try {
    const finalUrl = new URL(bestHref, protocolUrl).href;
    
    // Final Validation of discovered image URL
    if (!(await validateDestinationSafe(finalUrl))) {
      return null;
    }
    return finalUrl;
  } catch (e) {
    return null;
  }
}
