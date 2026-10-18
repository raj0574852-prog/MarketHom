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
