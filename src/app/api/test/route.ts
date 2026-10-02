import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const supabase = getServiceSupabase();
    
    const { data: site } = await supabase
      .from('website_listings')
      .select('id, domain, source_hash')
      .limit(1)
      .single();
      
    let metrics = null;
    let metricsCount = null;
    if (site) {
      const res = await supabase
        .from('website_metrics')
        .select('*')
        .eq('website_listing_id', site.id);
      metrics = res.data;
      
      const countRes = await supabase
        .from('website_metrics')
        .select('*', { count: 'exact', head: true });
      metricsCount = countRes.count;
    }

    return NextResponse.json({ site, metrics, metricsCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
