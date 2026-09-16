import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error, count } = await supabase
    .from('website_listings')
    .update({ status: 'published' })
    .eq('status', 'draft')
    .select('id');
    
  if (error) {
    return NextResponse.json({ success: false, error });
  }

  return NextResponse.json({ success: true, count: data?.length || 0 });
}
