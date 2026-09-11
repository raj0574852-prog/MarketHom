import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PATCH(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids, status } = body;
    
    if (!Array.isArray(ids) || !status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { error } = await supabase
      .from('website_listings')
      .update({ status })
      .in('id', ids);

    if (error) {
      console.error('Error bulk updating website listings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clear the cache so changes appear instantly on the public site
    revalidatePath('/websites');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in PATCH /api/websites/bulk-status:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
