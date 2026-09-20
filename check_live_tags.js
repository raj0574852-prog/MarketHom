const https = require('https');
https.get('https://www.educationhom.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const can = data.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
    const pub = data.match(/<meta[^>]*name=["']publisher["'][^>]*>/i);
    console.log('Canonical Tag:', can ? can[0] : 'Not Found');
    console.log('Publisher Tag:', pub ? pub[0] : 'Not Found');
  });
});
