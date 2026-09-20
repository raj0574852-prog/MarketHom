const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching websites...');
  const { data: websites, error } = await supabase
    .from('website_listings')
    .select('id, domain, price, content_placement_price, content_placement_selling_price, short_description, seo_description, editorial_description');

  if (error) {
    console.error('Error fetching websites:', error);
    return;
  }

  let issues = 0;
  let updatedCount = 0;

  for (const site of websites) {
    const basePrice = site.content_placement_price || site.price;
    const sellingPrice = site.content_placement_selling_price || basePrice;

    if (!basePrice || basePrice === sellingPrice) continue;

    const basePriceStr = `$${basePrice}`;
    const sellingPriceStr = `$${sellingPrice}`;

    let updated = false;
    const updateObj = {};

    if (site.short_description && site.short_description.includes(basePriceStr)) {
      updateObj.short_description = site.short_description.replace(basePriceStr, sellingPriceStr);
      updated = true;
    }
    if (site.seo_description && site.seo_description.includes(basePriceStr)) {
      updateObj.seo_description = site.seo_description.replace(basePriceStr, sellingPriceStr);
      updated = true;
    }
    if (site.editorial_description && site.editorial_description.includes(basePriceStr)) {
      updateObj.editorial_description = site.editorial_description.replace(basePriceStr, sellingPriceStr);
      updated = true;
    }

    if (updated) {
      issues++;
      console.log(`Fixing ${site.domain} (Old: ${basePriceStr} -> New: ${sellingPriceStr})`);
      const { error: updateError } = await supabase
        .from('website_listings')
        .update(updateObj)
        .eq('id', site.id);
        
      if (updateError) {
        console.error(`Failed to update ${site.domain}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Done! Found ${issues} issues, successfully updated ${updatedCount} websites.`);
}

run();
