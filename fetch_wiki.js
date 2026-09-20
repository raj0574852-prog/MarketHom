const urls = [
  'https://en.wikipedia.org/wiki/Associated_Press',
  'https://en.wikipedia.org/wiki/NewsBreak',
  'https://en.wikipedia.org/wiki/The_Chronicle-Journal',
  'https://en.wikipedia.org/wiki/Investing.com',
  'https://en.wikipedia.org/wiki/The_Manila_Times',
  'https://en.wikipedia.org/wiki/Nagpur_Today'
];

async function check() {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const text = await r.text();
        const match = text.match(/<img[^>]+src="(\/\/upload\.wikimedia\.org\/wikipedia\/(en|commons)\/[^"]+(logo|Logo)[^"]*\.(png|svg|jpg).*?)"/);
        console.log(url, '=>', match ? 'https:' + match[1] : 'NOT FOUND');
      }
    } catch(e) {}
  }
}
check();
