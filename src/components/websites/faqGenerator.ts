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

  // 1. Identity / Category FAQ
  if (website.category_id && website.category_id !== 'General') {
    addFaq(
      `What type of website is ${website.domain}?`,
      `${website.name || website.domain} is a publishing platform primarily focusing on the ${website.category_id} category.`
    );
  }

  // 2. Pricing FAQ (CRITICAL: Only use selling price. Never fallback to base price.)
  if (website.content_placement_selling_price) {
    addFaq(
      `How much does it cost to publish a guest post on ${website.domain}?`,
      `The cost for a content placement on ${website.domain} is $${website.content_placement_selling_price} USD when ordered through the EducationHom marketplace.`
    );
  }

  // 3. Link Validity FAQ
  if (website.link_validity || website.max_dofollow_links) {
    const linkTypes = [];
    if (website.link_validity) linkTypes.push(website.link_validity.toLowerCase());
    if (website.max_dofollow_links) linkTypes.push(`up to ${website.max_dofollow_links} dofollow links`);
    
    if (linkTypes.length > 0) {
      addFaq(
        `What type of links does ${website.domain} allow?`,
        `According to the publisher's guidelines, ${website.domain} typically permits ${linkTypes.join(' and ')} per published article.`
      );
    }
  }

  // 4. Turnaround Time FAQ
  if (website.turnaround_time) {
    addFaq(
      `What is the typical turnaround time for publication on ${website.domain}?`,
      `The estimated turnaround time for reviewing and publishing on ${website.domain} is ${website.turnaround_time}.`
    );
  }

  // 5. Accepted Niches FAQ
  if (website.accepted_niches && website.accepted_niches.length > 0) {
    addFaq(
      `What topics are accepted on ${website.domain}?`,
      `${website.name || website.domain} accepts content in the following areas: ${website.accepted_niches.join(', ')}.`
    );
  } else if (website.rejected_niches && website.rejected_niches.length > 0) {
    addFaq(
      `Are there any restricted niches on ${website.domain}?`,
      `Yes, ${website.name || website.domain} explicitly rejects content related to: ${website.rejected_niches.join(', ')}.`
    );
  }

  // 6. Original Content FAQ
  if (website.original_content_required === true) {
    addFaq(
      `Does ${website.domain} require original content?`,
      `Yes, ${website.domain} maintains editorial standards requiring all submitted guest posts to be 100% original and unpublished elsewhere.`
    );
  }

  // 7. Sponsored Label FAQ
  if (website.sponsored_label === true) {
    addFaq(
      `Will my post on ${website.domain} be marked as sponsored?`,
      `Yes, articles published on ${website.domain} are typically marked with a "Sponsored" or similar disclosure label to comply with editorial guidelines.`
    );
  }

  // Cap at 8 FAQs maximum
  return faqs.slice(0, 8);
}
