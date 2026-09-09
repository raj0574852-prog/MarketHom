import { getServiceSupabase } from './src/lib/supabaseClient';
import { evaluatePublisherIndexability } from './src/lib/seo/qualityGate';

async function run() {
  const { data } = await getServiceSupabase()
    .from('website_listings')
    .select('*, website_metrics(*)')
    .eq('status', 'published');

  if (!data) {
    console.log("No data returned");
    return;
  }

  let currentlyIndexable = 0;
  let previouslyExcluded = 0;
  let nowEligible = 0;

  for (const site of data) {
    const isTechnicallyEligible = site.status === 'published' && site.is_listed !== false && !!site.slug;
    
    // Calculate the score just like the old gate
    let score = 0;
    if (site.status === 'published') score += 10;
    if (site.is_listed !== false) score += 10;
    if (site.domain && site.slug) score += 10;
    if (site.short_description || site.long_description || site.editorial_description) score += 20;
    if (site.category_id) score += 10;
    if (site.accepted_niches && site.accepted_niches.length > 0) score += 10;
    if (site.content_placement_price && site.content_placement_price > 0) score += 10;
    if (site.website_metrics && site.website_metrics.length > 0) score += 20;

    const isContentRich = score >= 60;
    const oldIndexable = isTechnicallyEligible && isContentRich;
    const newIndexable = isTechnicallyEligible;

    if (newIndexable) currentlyIndexable++;
    if (!oldIndexable && isTechnicallyEligible) {
      previouslyExcluded++;
      nowEligible++;
    }
  }

  console.log(`Currently Indexable: ${currentlyIndexable}`);
  console.log(`Previously Excluded: ${previouslyExcluded}`);
  console.log(`Now Eligible (from previously excluded): ${nowEligible}`);
}

run().catch(console.error);
