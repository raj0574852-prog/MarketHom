const urls = [
  'https://www.investing.com',
  'https://www.manilatimes.net',
  'https://www.nagpurtoday.in'
];

async function check() {
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36' } });
      if (r.ok) {
        const text = await r.text();
        const m1 = text.match(/<img[^>]*src=["']([^"']*(logo|Logo)[^"']*)["'][^>]*>/);
        const m2 = text.match(/<meta property="og:image" content="([^"]+)"/);
        console.log(url);
        console.log('  Logo:', m1 ? m1[1] : 'none');
        console.log('  OG Image:', m2 ? m2[1] : 'none');
      } else {
        console.log(url, 'FAILED', r.status);
      }
    } catch(e) {
      console.log(url, 'ERROR', e.message);
    }
  }
}
check();
