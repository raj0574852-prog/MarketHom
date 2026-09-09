import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// POST /api/websites/[id]/faqs
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { question, answer, display_order } = body;

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('website_faqs')
      .insert({
        website_listing_id: id,
        question,
        answer,
        display_order: display_order || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting website FAQ:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/websites');
    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error in POST /api/websites/[id]/faqs:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
