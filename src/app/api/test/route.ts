import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const supabase = getServiceSupabase();
    
    // release lock
    const { data: updateRes, error } = await supabase
      .from('website_sync_logs')
      .update({ status: 'failed', error_summary: 'Manual lock release' })
      .eq('status', 'running')
      .select();

    return NextResponse.json({ updateRes, error });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
