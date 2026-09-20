const domains = [
  'globenewswire.com', 'finance.yahoo.com', 'windstream.net', 'einpresswire.com', 'barchart.com', 'apnews.com', 'newsbreak.com', 'markets.chroniclejournal.com', 'investing.com', 'usatoday.com', 'theglobeandmail.com', 'manilatimes.net', 'markets.businessinsider.com', 'streetinsider.com', 'reuters.com', 'nagpurtoday.in', '24-7pressrelease.com', 'bhaskar.com', 'entrepreneur.com'
];

async function check() {
  const results = [];
  for (const d of domains) {
    try {
      const res = await fetch('https://www.educationhom.com/websites/' + d);
      if (res.status === 200) {
        const text = await res.text();
        const match = text.match(/<img[^>]*src="([^"]+)"[^>]*alt="[^"]*logo"/);
        if (match) {
          const url = match[1];
          // Try fetching the image
          try {
            const imgRes = await fetch(url.startsWith('http') ? url : `https://www.educationhom.com${url}`, { method: 'HEAD' });
            const contentType = imgRes.headers.get('content-type') || '';
            const isImage = contentType.startsWith('image/');
            results.push({ domain: d, logo_url: url, status: imgRes.status, contentType, isImage });
          } catch (e) {
            results.push({ domain: d, logo_url: url, status: 'error_fetching_img', contentType: null, isImage: false });
          }
        } else {
          results.push({ domain: d, logo_url: null, status: 'no_img_tag', contentType: null, isImage: false });
        }
      } else {
        results.push({ domain: d, logo_url: null, status: res.status, contentType: null, isImage: false });
      }
    } catch (e) {
      results.push({ domain: d, logo_url: null, status: 'error_fetching_page', contentType: null, isImage: false });
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
check();
