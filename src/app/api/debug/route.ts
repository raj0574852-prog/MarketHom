import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('website_metrics')
    .select('*, website_listings(domain)')
    .limit(10);
    
  return NextResponse.json({ data, error });
}
