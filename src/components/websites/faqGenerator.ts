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

  // Only add highly specific facts.

  if (website.turnaround_time) {
    addFaq(
      `What is the typical turnaround time for publication on ${website.domain}?`,
      `The estimated turnaround time for reviewing and publishing on ${website.domain} is ${website.turnaround_time}.`
    );
  }

  if (website.rejected_niches && website.rejected_niches.length > 0) {
    addFaq(
      `Are there any restricted niches for guest posting on ${website.domain}?`,
      `Yes, ${website.name || website.domain} explicitly rejects content related to: ${website.rejected_niches.join(', ')}.`
    );
  }

  // Only mention accepted niches if they are highly specific (not just 'General')
  if (website.accepted_niches && website.accepted_niches.length > 0 && !website.accepted_niches.includes('General Niches')) {
    addFaq(
      `What specific topics are accepted on ${website.domain}?`,
      `${website.name || website.domain} focuses on content in the following areas: ${website.accepted_niches.join(', ')}.`
    );
  }

  // Only mention original content if it's strictly required
  if (website.original_content_required === true) {
    addFaq(
      `Does ${website.domain} require original content?`,
      `Yes, ${website.domain} maintains editorial standards requiring all submitted guest posts to be 100% original and unpublished elsewhere.`
    );
  }

  // Only mention sponsored label if it is strictly enforced
  if (website.sponsored_label === true) {
    addFaq(
      `Will my guest post on ${website.domain} be marked as sponsored?`,
      `Yes, articles published on ${website.domain} are typically marked with a "Sponsored" or similar disclosure label to comply with editorial guidelines.`
    );
  }

  // Cap at 4 FAQs maximum to avoid SEO keyword stuffing / boilerplate bloat
  return faqs.slice(0, 4);
}
