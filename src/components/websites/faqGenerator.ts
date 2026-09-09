import { WebsiteListing, WebsiteFAQ } from './types';

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

  const displayPrice = website.content_placement_selling_price || website.price;
  if (displayPrice) {
    addFaq(
      `What is the starting price to publish a guest post on ${website.domain}?`,
      `The starting price for a content placement on ${website.domain} is $${displayPrice} USD through the EducationHom marketplace. Prices may vary depending on the specific publication requirements.`
    );
  }

  if (website.link_validity || website.max_dofollow_links) {
    const linkTypes = [];
    if (website.link_validity) linkTypes.push(website.link_validity.toLowerCase());
    if (website.max_dofollow_links) linkTypes.push(`up to ${website.max_dofollow_links} dofollow links`);
    
    if (linkTypes.length > 0) {
      addFaq(
        `What type of links does ${website.domain} allow in guest posts?`,
        `According to their listing, ${website.domain} generally permits ${linkTypes.join(' and ')} per published article.`
      );
    }
  }

  if (website.turnaround_time) {
    addFaq(
      `What is the typical turnaround time for publication on ${website.domain}?`,
      `The estimated turnaround time for reviewing and publishing a guest post on ${website.domain} is ${website.turnaround_time}.`
    );
  }

  if (website.accepted_niches && website.accepted_niches.length > 0) {
    addFaq(
      `What niches or topics are accepted on ${website.domain}?`,
      `${website.name} currently accepts content in the following areas: ${website.accepted_niches.join(', ')}.`
    );
  }

  if (website.rejected_niches && website.rejected_niches.length > 0) {
    addFaq(
      `Are there any restricted niches for guest posting on ${website.domain}?`,
      `Yes, ${website.name} explicitly rejects content related to: ${website.rejected_niches.join(', ')}.`
    );
  }

  if (website.original_content_required !== undefined) {
    addFaq(
      `Does ${website.domain} require original content?`,
      website.original_content_required 
        ? `Yes, ${website.domain} maintains strict editorial standards and requires all submitted guest posts to be 100% original and unpublished elsewhere.`
        : `While original content is always recommended, ${website.domain} does not strictly mandate it in their baseline guidelines.`
    );
  }

  if (website.sponsored_label !== undefined) {
    addFaq(
      `Will my guest post on ${website.domain} be marked as sponsored?`,
      website.sponsored_label 
        ? `Yes, articles published on ${website.domain} are typically marked with a "Sponsored" or similar disclosure label.`
        : `According to current guidelines, articles on ${website.domain} are not automatically labeled as sponsored.`
    );
  }

  // Cap at 8 FAQs maximum to respect the 0-8 rule
  return faqs.slice(0, 8);
}
