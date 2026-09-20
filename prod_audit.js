const fs = require('fs');
const http = require('http');
const https = require('https');

async function run() {
  try {
    console.log("Fetching sitemap...");
    const sitemapRes = await fetch('https://www.educationhom.com/sitemap.xml');
    const sitemapXml = await sitemapRes.text();
    
    // Extract all /websites/ urls
    const matches = [...sitemapXml.matchAll(/<loc>(https:\/\/www\.educationhom\.com\/websites\/[^<]+)<\/loc>/g)];
    const allUrls = matches.map(m => m[1]);
    
    console.log(`Found ${allUrls.length} website URLs in sitemap.`);
    
    // Pick 10 random URLs, or use specific ones to get diverse data
    // Let's just pick 10 deterministic diverse-looking ones if available
    const targets = allUrls.slice(0, 10);
    
    console.log("Target URLs:");
    targets.forEach(u => console.log(u));
    
    for (const url of targets) {
      console.log(`\n=== Testing ${url} ===`);
      const res = await fetch(url);
      if (res.status !== 200) {
        console.log(`Status: ${res.status}`);
        continue;
      }
      
      const html = await res.text();
      
      // H1 Check
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      console.log(`H1: ${h1Match ? h1Match[1] : 'NOT FOUND'}`);
      
      // Sections
      const hasQA = html.includes('Quick Answer');
      const hasOverview = html.includes('Publisher Overview');
      const hasOpp = html.includes('Publishing Opportunity');
      const hasGuide = html.includes('Publishing Guidelines');
      const hasRules = html.includes('Accepted Niches &amp; Content Rules');
      
      console.log(`Quick Answer: ${hasQA}`);
      console.log(`Publisher Overview: ${hasOverview}`);
      console.log(`Publishing Opportunity: ${hasOpp}`);
      console.log(`Publishing Guidelines: ${hasGuide}`);
      console.log(`Accepted Niches & Rules: ${hasRules}`);
      
      // Price Leak Check
      const leaks = [];
      if (html.includes('base_price')) leaks.push('base_price');
      if (html.includes('internal_cost')) leaks.push('internal_cost');
      if (html.includes('website.price')) leaks.push('website.price');
      console.log(`Price Leaks: ${leaks.length > 0 ? leaks.join(', ') : 'NONE'}`);
      
      // JSON-LD Check
      const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
      console.log(`Found ${jsonLdMatches.length} JSON-LD blocks`);
    }
  } catch(e) {
    console.error(e);
  }
}

run();
