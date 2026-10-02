import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain') || 'textilelearner.net';
  
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('website_listings')
    .select('*, website_metrics(*)')
    .eq('domain', domain)
    .single();
    
  return NextResponse.json({ data, error });
}
