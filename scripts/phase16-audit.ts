import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

async function audit() {
  console.log("Fetching robots.txt");
  const r = await fetch(`${BASE_URL}/robots.txt`);
  console.log(await r.text());
  
  console.log("Fetching sitemap");
  const s = await fetch(`${BASE_URL}/sitemap.xml`);
  const sXML = await s.text();
  const chunkCount = (sXML.match(/<sitemap>/g) || []).length;
  console.log(`Sitemap index has ${chunkCount} chunks.`);
  
  const mSitemap = await fetch(`${BASE_URL}/main-sitemap/sitemap/0.xml`);
  const mSitemapXML = await mSitemap.text();
  const urlCount = (mSitemapXML.match(/<url>/g) || []).length;
  console.log(`First chunk has ${urlCount} URLs.`);

  console.log("Fetching indexation report from local API");
  const i = await fetch(`${BASE_URL}/api/admin/indexation-report`, {
    headers: { 'x-admin-key': process.env.ADMIN_KEY || 'test' }
  });
  if (i.ok) {
    const data = await i.json();
    console.log("Indexation Report:");
    console.log(JSON.stringify(data.distribution, null, 2));
  } else {
    console.log("Indexation report API failed:", i.status);
  }
}
audit().catch(console.error);
