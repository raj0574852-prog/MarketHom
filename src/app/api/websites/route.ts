import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const supabase = getServiceSupabase();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 1000);
    const q = searchParams.get('q') || '';
    const statusFilter = searchParams.get('status') || '';
    
    const offset = (page - 1) * limit;

    let query = supabase.from('website_listings').select('*').order('created_at', { ascending: false });

    if (q) {
      query = query.or(`domain.ilike.%${q}%,name.ilike.%${q}%`);
    }
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.range(offset, offset + limit); // Request limit + 1

    if (error) {
      console.error('Error fetching websites:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hasNextPage = data && data.length > limit;
    const websites = data ? data.slice(0, limit) : [];

    return NextResponse.json({ data: websites, hasNextPage });
  } catch (err) {
    console.error('Unexpected error in GET /api/websites:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = getServiceSupabase();

    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const { data, error } = await supabase
      .from('website_listings')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating website listing:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST /api/websites:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
