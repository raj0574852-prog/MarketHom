const https = require('https');
https.get('https://www.educationhom.com/websites?page=2', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/href="\/websites[^"]*"/g);
    if (matches) {
      const pageLinks = matches.filter(m => m.includes('page='));
      console.log(pageLinks);
    } else {
      console.log('No matches');
    }
  });
});
