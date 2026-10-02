const cheerio = require('cheerio');

async function checkWebsite(domain) {
  console.log(`\nChecking https://www.educationhom.com/websites/${domain}`);
  try {
    const res = await fetch(`https://www.educationhom.com/websites/${domain}?t=${Date.now()}`);
    if (!res.ok) {
      console.log(`Failed to fetch: ${res.status}`);
      return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // The metrics are usually inside a grid.
    const extractMetric = (label) => {
      let found = 'N/A';
      $('*').each((i, el) => {
        const text = $(el).text();
        if (text === label) {
          const parentText = $(el).parent().text();
          found = parentText.replace(label, '').trim();
        }
      });
      return found;
    };

    console.log(`DA: ${extractMetric('DA')}`);
    console.log(`DR: ${extractMetric('DR')}`);
    console.log(`Authority Score: ${extractMetric('Authority Score')}`);
    console.log(`Spam Score: ${extractMetric('Spam Score')}`);
    console.log(`Traffic: ${extractMetric('Traffic')}`);
    console.log(`Backlinks (should not exist): ${html.includes('Backlinks') ? 'Found' : 'Not Found'}`);
  } catch (error) {
    console.error(`Error checking ${domain}:`, error.message);
  }
}

async function checkSyncStatus() {
  console.log('\nChecking sync status:');
  try {
    const res = await fetch('https://www.educationhom.com/api/admin/websites/sync');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await checkSyncStatus();
  await checkWebsite('globenewswire.com');
  await checkWebsite('textilelearner.net');
}

run();
