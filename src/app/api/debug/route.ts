import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const adminSupabase = getServiceSupabase();
    const mockPost = {
      id: 'debug-post-' + Date.now(),
      slug: 'debug-post-' + Date.now(),
      title: 'Debug Post',
      excerpt: 'Debug',
      content: 'Debug',
      category: 'Debug',
      author: 'Debug',
      date: 'Debug',
      status: 'published'
    };

    const { data, error } = await adminSupabase
      .from('posts')
      .insert([mockPost])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error });
    }

    // Clean up
    await adminSupabase.from('posts').delete().eq('id', mockPost.id);

    return NextResponse.json({ success: true, message: 'Insert worked!', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || err.toString() });
  }
}
