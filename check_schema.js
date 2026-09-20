const fs = require('fs');
const cheerio = require('cheerio');

const files = ['statesmanjournal.html', 'yirafire.html', 'real-estatemagazine.html', 'veteriankey.html', 'earlyoclocks.html'];

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  const $ = cheerio.load(html);
  
  console.log(`\n--- ${file} ---`);
  $('script[type="application/ld+json"]').each((i, el) => {
    const json = JSON.parse($(el).html());
    console.log(`Schema Type: ${json['@type'] || (json['@graph'] && json['@graph'].map(g => g['@type']).join(', '))}`);
    
    // Check if any schema contains 'price' key (other than offers.price if applicable)
    const jsonStr = JSON.stringify(json);
    if (jsonStr.includes('price')) {
      console.log('CONTAINS PRICE STRING:', jsonStr.substring(jsonStr.indexOf('price') - 20, jsonStr.indexOf('price') + 50));
    }
  });
});
