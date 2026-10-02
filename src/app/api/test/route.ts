import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const supabase = getServiceSupabase();
    
    // Get setting
    const { data: settings } = await supabase
      .from('website_sync_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
      
    // Check textilelearner.net
    const { data: site } = await supabase
      .from('website_listings')
      .select('id, domain')
      .eq('domain', 'textilelearner.net')
      .single();
      
    let metrics = null;
    if (site) {
      const res = await supabase
        .from('website_metrics')
        .select('*')
        .eq('website_listing_id', site.id);
      metrics = res.data;
    }

    return NextResponse.json({ settings, site, metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
