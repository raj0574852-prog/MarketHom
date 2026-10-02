import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  const supabase = getServiceSupabase();
  const { data: listings, error: lErr } = await supabase
    .from('website_listings')
    .select('*')
    .eq('domain', 'textilelearner.net');
    
  const { data: metrics, error: mErr } = await supabase
    .from('website_metrics')
    .select('*')
    .eq('website_listing_id', listings?.[0]?.id || '00000000-0000-0000-0000-000000000000');
    
  return NextResponse.json({ listings, metrics, lErr, mErr });
}
