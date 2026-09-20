const domains = [
  'globenewswire.com', 'finance.yahoo.com', 'windstream.net', 'einpresswire.com', 'barchart.com', 'apnews.com', 'newsbreak.com', 'markets.chroniclejournal.com', 'investing.com', 'usatoday.com', 'theglobeandmail.com', 'manilatimes.net', 'markets.businessinsider.com', 'streetinsider.com', 'reuters.com', 'nagpurtoday.in', '24-7pressrelease.com', 'bhaskar.com', 'entrepreneur.com'
];

async function checkDomain(d) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('https://www.educationhom.com/websites/' + d, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.status === 200) {
      const text = await res.text();
      const match = text.match(/<img[^>]*src="([^"]+)"[^>]*alt="[^"]*logo"/);
      if (match) {
        let url = match[1];
        if (url.startsWith('/_next/image')) {
          // It's a next/image URL, try to decode the actual src
          const urlParams = new URLSearchParams(url.split('?')[1]);
          const actualUrl = urlParams.get('url');
          if (actualUrl) url = actualUrl;
        }

        try {
          const imgController = new AbortController();
          const imgTimeout = setTimeout(() => imgController.abort(), 10000);
          const fetchUrl = url.startsWith('http') ? url : `https://www.educationhom.com${url}`;
          const imgRes = await fetch(fetchUrl, { method: 'HEAD', signal: imgController.signal });
          clearTimeout(imgTimeout);
          const contentType = imgRes.headers.get('content-type') || '';
          const isImage = contentType.startsWith('image/');
          return { domain: d, logo_url: url, status: imgRes.status, contentType, isImage };
        } catch (e) {
          return { domain: d, logo_url: url, status: 'error_fetching_img', contentType: null, isImage: false };
        }
      } else {
        return { domain: d, logo_url: null, status: 'no_img_tag', contentType: null, isImage: false };
      }
    } else {
      return { domain: d, logo_url: null, status: res.status, contentType: null, isImage: false };
    }
  } catch (e) {
    return { domain: d, logo_url: null, status: 'error_fetching_page', contentType: null, isImage: false };
  }
}

async function checkAll() {
  const promises = domains.map(d => checkDomain(d));
  const results = await Promise.all(promises);
  console.log(JSON.stringify(results, null, 2));
}

checkAll();
