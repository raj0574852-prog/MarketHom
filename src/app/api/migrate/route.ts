import { NextResponse } from 'next/server';
import { INITIAL_POSTS, BlogPost } from '@/lib/blogStore';
import { getServiceSupabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. Verify Admin Session
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';
    
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    const providedToken = match ? match[1] : '';

    let isValid = false;
    if (sessionToken && providedToken && providedToken.length === sessionToken.length) {
      isValid = crypto.timingSafeEqual(
        Buffer.from(providedToken),
        Buffer.from(sessionToken)
      );
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { localPosts } = await request.json();

    // 2. Gather Server Memory Posts
    const globalForBlog = globalThis as unknown as { serverPosts: BlogPost[] | undefined };
    const memoryPosts = globalForBlog.serverPosts || [];

    // 3. Gather Initial Posts
    const initialPosts = INITIAL_POSTS;

    // 4. Combine and Deduplicate
    const allPosts = [...initialPosts, ...memoryPosts, ...(localPosts || [])];
    const uniquePostsMap = new Map<string, BlogPost>();
    
    // We prioritize memory/local posts over INITIAL_POSTS, so we iterate in reverse or just overwrite
    allPosts.forEach(post => {
      // Deduplicate by ID
      if (!uniquePostsMap.has(post.id)) {
        uniquePostsMap.set(post.id, post);
      }
    });

    const dedupedPosts = Array.from(uniquePostsMap.values());
    
    // Further deduplicate by Slug just in case
    const finalSlugMap = new Map<string, BlogPost>();
    dedupedPosts.forEach(post => {
      if (!finalSlugMap.has(post.slug)) {
        finalSlugMap.set(post.slug, post);
      }
    });

    const finalPosts = Array.from(finalSlugMap.values());

    // 5. Transform for Supabase schema
    const formattedPosts = finalPosts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || '',
      content: p.content,
      category: p.category || 'Uncategorized',
      author: p.author || 'Admin',
      author_role: p.authorRole || null,
      date: p.date,
      read_time: p.readTime || null,
      icon: p.icon || '📝',
      featured: p.featured || false,
      featured_image: p.featuredImage || null,
      meta_title: p.metaTitle || null,
      meta_description: p.metaDescription || null,
      no_index: p.noIndex || false,
      no_follow: p.noFollow || false,
      canonical_url: p.canonicalUrl || null,
      status: 'published' // Default to published since they were visible
    }));

    // 6. Bulk Insert to Supabase
    const adminSupabase = getServiceSupabase();
    const { data, error } = await adminSupabase
      .from('posts')
      .upsert(formattedPosts, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Migration error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report: {
        initialCount: initialPosts.length,
        memoryCount: memoryPosts.length,
        localCount: localPosts ? localPosts.length : 0,
        combinedCount: allPosts.length,
        dedupedByIdCount: dedupedPosts.length,
        finalCount: finalPosts.length,
        supabaseInsertedCount: data ? data.length : 0
      }
    });
  } catch (err) {
    console.error('Migration crash:', err);
    return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 });
  }
}
