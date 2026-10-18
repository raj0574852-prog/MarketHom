import { WebsiteListing, WebsiteFAQ } from './types';
import { normalizePublisherMetrics } from './utils/normalizeMetrics';
import { formatCompactNumber } from './utils/formatters';

export function generatePublisherFAQs(website: WebsiteListing): WebsiteFAQ[] {
  const faqs: WebsiteFAQ[] = [];
  let order = 1;

  const addFaq = (question: string, answer: string) => {
    faqs.push({
      id: `gen-${order}`,
      website_listing_id: website.id,
      question,
      answer,
      display_order: order++
    });
  };

  const domain = website.domain;
  const name = website.name || domain;
  const category = (website.category_id && website.category_id !== 'General') ? website.category_id : 'Technology & Business';
  const price = website.content_placement_selling_price || website.price || 12;
  const metrics = normalizePublisherMetrics(website.website_metrics);
  const da = metrics.da !== null ? `${metrics.da}` : null;
  const dr = metrics.dr !== null ? `${metrics.dr}` : null;
  const traffic = metrics.organicTraffic !== null && metrics.organicTraffic > 0 
    ? `${formatCompactNumber(metrics.organicTraffic)}+` 
    : null;
  const maxLinks = website.max_dofollow_links || 1;
  const linkType = website.link_validity || 'DoFollow';
  const turnaround = website.turnaround_time || '3 to 5 business days';

  // 1. Identity & Audience
  addFaq(
    `What type of website is ${domain} and what audience does it target?`,
    `${name} is an established publication primarily focused on ${category}. Securing a guest post or sponsored placement here allows your brand to reach an engaged, niche-specific audience while earning high-quality contextual referral traffic.`
  );

  // 2. Pricing & Cost
  addFaq(
    `How much does it cost to publish a guest post on ${domain}?`,
    `A verified permanent content placement on ${domain} costs $${price} USD when ordered through the EducationHom marketplace. There are no hidden fees or recurring subscriptions.`
  );

  // 3. Link Type & Dofollow Guarantee
  addFaq(
    `Are backlinks on ${domain} dofollow and permanent?`,
    `Yes. Placements on ${domain} include permanent ${linkType} links (up to ${maxLinks} dofollow link${maxLinks > 1 ? 's' : ''} per article). Your link remains live indefinitely without annual renewal fees, passing long-term link equity and topical authority to your target URL.`
  );

  // 4. SEO Authority (DA / DR) Impact
  if (da || dr) {
    const authorityParts = [];
    if (da) authorityParts.push(`Domain Authority (DA) of ${da}`);
    if (dr) authorityParts.push(`Domain Rating (DR) of ${dr}`);
    addFaq(
      `What are the SEO authority metrics (DA & DR) for ${domain}?`,
      `${domain} currently boasts a ${authorityParts.join(' and a ')}. Backlinks from domains with verified Moz and Ahrefs authority scores help improve your Google ranking positions, strengthen your link profile, and protect your domain against search algorithm volatility.`
    );
  } else {
    addFaq(
      `How will a placement on ${domain} benefit my site's SEO?`,
      `Publishing on ${domain} gives your website a contextual in-content backlink from an established domain in the ${category} space. This builds domain trust, increases topical relevance, and improves keyword rankings in Google and AI search engines.`
    );
  }

  // 5. Organic Traffic & Traffic Authority (TF)
  if (traffic) {
    addFaq(
      `Does ${domain} have real organic search traffic?`,
      `Yes. ${domain} receives an estimated ${traffic} monthly organic search visits according to search analytics data. Google prioritizes links from websites that actually receive active visitor traffic, making this placement significantly more impactful for search engine rankings.`
    );
  } else {
    addFaq(
      `Why is a contextual backlink from ${domain} valuable?`,
      `${domain} provides valuable topical diversity for your backlink portfolio. Google values contextual citations within real editorial content in the ${category} vertical, which helps establish your brand as a recognized entity in your industry.`
    );
  }

  // 6. Turnaround Time & Publishing Speed
  addFaq(
    `What is the turnaround time for publishing on ${domain}?`,
    `The standard turnaround time on ${domain} is approximately ${turnaround}. Once your article draft and target anchor links are submitted, the editorial team reviews the content and publishes it directly to the live domain.`
  );

  // 7. Content Writing vs Self-Submitted Draft
  addFaq(
    `Can I provide my own article, or can EducationHom write it for me?`,
    `You can choose either option! You are welcome to submit your own pre-written draft (typically 800–1,500 words of original content relevant to ${category}), or EducationHom's native English SEO writing team can craft an optimized, publisher-ready article for you.`
  );

  // 8. Google Indexing Assurance
  addFaq(
    `Will my guest post on ${domain} be indexed by Google?`,
    `Yes. All placements on ${domain} are published as permanent, crawlable HTML pages. Our team actively checks post indexability to ensure that search engine bots crawl and index your guest post promptly.`
  );

  // 9. Editorial Guidelines & Accepted Niches
  if (website.accepted_niches && website.accepted_niches.length > 0) {
    addFaq(
      `What topics and niches are accepted on ${domain}?`,
      `${name} welcomes quality content in: ${website.accepted_niches.join(', ')}. Articles must be informative, original, well-structured, and compliant with standard webmaster quality guidelines.`
    );
  } else {
    addFaq(
      `What editorial guidelines must be followed for ${domain}?`,
      `Articles published on ${domain} must be 100% unique, human-written or thoroughly edited, and informative for readers in the ${category} sector. Promotional claims should be backed by factual references, and spam or deceptive content is not accepted.`
    );
  }

  // 10. Placement Guarantee & Security
  addFaq(
    `What guarantee do I receive when ordering a placement on ${domain}?`,
    `Every order is backed by the EducationHom Marketplace Guarantee. If for any reason the publisher cannot publish your post according to specifications, you will receive an immediate 100% refund or an equivalent replacement on another high-authority domain of your choice.`
  );

  return faqs;
}
