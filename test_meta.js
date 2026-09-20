const https = require('https');
https.get('https://www.educationhom.com/websites/reuters.com?t=3', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const relatedMatch = data.match(/href="\/websites\/([^"]+)"/g);
    console.log("Related Links: ", relatedMatch ? relatedMatch.join(', ') : "None");
  });
});
