import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  const supabase = getServiceSupabase();
  const { data: websites, error } = await supabase
    .from('website_listings')
    .select('id, domain, price, content_placement_price, content_placement_selling_price, short_description, seo_description, editorial_description');

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  const issues = [];
  const updates = [];

  for (const site of websites) {
    const basePrice = site.content_placement_price || site.price;
    const sellingPrice = site.content_placement_selling_price || basePrice;

    if (!basePrice || basePrice === sellingPrice) continue;

    const basePriceStr = `$${basePrice}`;
    const sellingPriceStr = `$${sellingPrice}`;

    let updated = false;
    const updateObj: any = { id: site.id };

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
      issues.push({ domain: site.domain, old: basePriceStr, new: sellingPriceStr, obj: updateObj });
      updates.push(updateObj);
    }
  }

  return NextResponse.json({ 
    total_checked: websites.length, 
    issues_found: issues.length, 
    issues 
  });
}
