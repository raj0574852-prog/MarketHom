const fs = require('fs');
const html = fs.readFileSync('test_volyn_new.html', 'utf8');

console.log('Old Boilerplate:', html.includes('Through the EducationHom marketplace'));
console.log('Old H1:', html.includes('Publish Guest Post on <!-- -->'));
console.log('Canonical:', html.includes('rel="canonical"'));
console.log('JSON-LD:', html.includes('application/ld+json'));
console.log('Price leak base_price:', html.includes('base_price'));
console.log('Price leak internal_cost:', html.includes('internal_cost'));
