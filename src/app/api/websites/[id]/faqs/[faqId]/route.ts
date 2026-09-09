import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, faqId: string }> }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, faqId } = await params;
    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('website_faqs')
      .delete()
      .eq('id', faqId)
      .eq('website_listing_id', id);

    if (error) {
      console.error('Error deleting website FAQ:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/websites');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/websites/[id]/faqs/[faqId]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string, faqId: string }> }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, faqId } = await params;
    const body = await request.json();
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('website_faqs')
      .update(body)
      .eq('id', faqId)
      .eq('website_listing_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating website FAQ:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/websites');
    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error in PATCH /api/websites/[id]/faqs/[faqId]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
