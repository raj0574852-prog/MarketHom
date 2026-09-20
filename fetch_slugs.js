const fs = require('fs');

async function run() {
  try {
    const res = await fetch('https://www.educationhom.com/websites');
    const html = await res.text();
    const regex = /href="\/websites\/([^"\/?]+)"/g;
    const matches = [...html.matchAll(regex)];
    const slugs = [...new Set(matches.map(m => m[1]))];
    console.log('Slugs found:');
    console.log(slugs);
    
    // Pick first 10
    const sample = slugs.slice(0, 10);
    fs.writeFileSync('prod_slugs.json', JSON.stringify(sample));
  } catch(e) {
    console.error(e);
  }
}
run();
