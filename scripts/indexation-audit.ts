import fs from 'fs';

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'EducationHom-Audit-Bot' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extractMeta(html: string, name: string): string | null {
  const match = html.match(new RegExp(`<meta\\s+(?:name|property)="${name}"\\s+content="([^"]+)"`));
  return match ? match[1] : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/);
  return match ? match[1] : null;
}

async function audit() {
  console.log('Starting SEO QA Audit...');
  
  // A small subset of urls representing the 4 types
  const urlsToTest = [
    'http://localhost:3000/websites/category/technology',
    'http://localhost:3000/websites',
    'http://localhost:3000/websites?category=Technology' // Parameterized
  ];

  let results = [];
  
  for (const url of urlsToTest) {
    console.log(`Auditing ${url}...`);
    try {
      const html = await fetchHtml(url);
      const robots = extractMeta(html, 'robots');
      const canonical = extractMeta(html, 'og:url') || extractMeta(html, 'canonical') || html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      const title = extractTitle(html);
      
      results.push({
        url,
        robots: robots || 'index, follow (implicit)',
        canonical,
        title,
        status: 'OK'
      });
    } catch (e: any) {
      results.push({ url, status: e.message });
    }
  }

  const report = `# INDEXATION AUDIT REPORT\n\n` +
    results.map(r => `## ${r.url}\n- Status: ${r.status}\n- Title: ${r.title}\n- Robots: ${r.robots}\n- Canonical: ${r.canonical}\n`).join('\n');
    
  fs.writeFileSync('INDEXATION_AUDIT_REPORT.md', report);
  console.log('Done! Wrote INDEXATION_AUDIT_REPORT.md');
}

audit();
