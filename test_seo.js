const https = require("https");
const urls = [
  "https://www.educationhom.com/websites/reuters.com",
  "https://www.educationhom.com/websites/entrepreneur.com",
  "https://www.educationhom.com/websites/bhaskar.com"
];
urls.forEach(url => {
  https.get(url, (res) => {
    let data = "";
    res.on("data", (c) => data += c);
    res.on("end", () => {
      const canonicalMatch = data.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
      const robotsMatch = data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
      const relatedMatch = data.match(/Similar in/);
      console.log("URL: " + url);
      console.log("Status: " + res.statusCode);
      console.log("Canonical: " + (canonicalMatch ? canonicalMatch[1] : "N/A"));
      console.log("Robots: " + (robotsMatch ? robotsMatch[1] : "N/A"));
      console.log("Has Internal Links: " + !!relatedMatch);
      console.log("---");
    });
  });
});
