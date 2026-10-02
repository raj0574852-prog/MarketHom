const fs = require('fs');

async function run() {
  const res = await fetch('https://www.educationhom.com/website/reuters.com');
  const text = await res.text();
  const schemas = [...text.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => {
    try { return JSON.parse(m[1]); } catch(e) { return null; }
  }).filter(Boolean);
  
  console.log(JSON.stringify(schemas, null, 2));
}

run();
