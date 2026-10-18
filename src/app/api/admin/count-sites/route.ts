import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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
