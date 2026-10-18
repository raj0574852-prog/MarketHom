import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('website_sync_logs')
    .update({ status: 'failed', error_summary: 'Force cleared lock via endpoint' })
    .eq('status', 'running')
    .select();
    
  return NextResponse.json({ success: true, updatedRows: data, error });
}
