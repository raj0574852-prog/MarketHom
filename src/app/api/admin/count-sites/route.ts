import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET() {
  const supabase = getServiceSupabase();
  
  // Clear any stuck locks
  await supabase
    .from('website_sync_logs')
    .update({ status: 'failed', error_message: 'Force cleared lock by admin API' })
    .eq('status', 'running');

  const { count, error } = await supabase
    .from('website_listings')
    .select('*', { count: 'exact', head: true });

  const { count: publishedCount } = await supabase
    .from('website_listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('is_listed', true);

  return NextResponse.json({ total: count, published: publishedCount, error });
}
