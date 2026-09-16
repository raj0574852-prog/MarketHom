import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('website_sync_logs')
    .update({ status: 'failed', error_summary: 'Force cleared lock via endpoint' })
    .eq('status', 'running')
    .select();
    
  return NextResponse.json({ success: true, updatedRows: data, error });
}
