import { NextResponse } from 'next/server';
import { BlogPost, INITIAL_POSTS } from '@/lib/blogStore';

// Server-side memory cache for Next.js server runtime
const globalForBlog = globalThis as unknown as {
  serverPosts: BlogPost[] | undefined;
  deletedIds: string[] | undefined;
};

if (globalForBlog.serverPosts === undefined) {
  globalForBlog.serverPosts = INITIAL_POSTS;
}
if (globalForBlog.deletedIds === undefined) {
  globalForBlog.deletedIds = [];
}

export async function GET() {
  return NextResponse.json({
    success: true,
    posts: globalForBlog.serverPosts || INITIAL_POSTS,
    deletedIds: globalForBlog.deletedIds || []
  });
}

export async function POST(request: Request) {
  try {
    const body: BlogPost = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const dateStr = body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    let currentPosts = globalForBlog.serverPosts || [];

    // Ensure we un-mark deleted if re-published
    if (globalForBlog.deletedIds) {
      globalForBlog.deletedIds = globalForBlog.deletedIds.filter(d => d !== body.id && d !== slug);
    }

    const existingIndex = currentPosts.findIndex(p => p.id === body.id || (body.id && p.id === body.id) || p.slug === slug);

    let updatedPost: BlogPost;

    if (existingIndex >= 0) {
      updatedPost = { ...currentPosts[existingIndex], ...body, date: dateStr, slug };
      currentPosts[existingIndex] = updatedPost;
    } else {
      updatedPost = {
        ...body,
        id: body.id || 'post-' + Date.now(),
        date: dateStr,
        slug
      };
      currentPosts = [updatedPost, ...currentPosts];
    }

    globalForBlog.serverPosts = currentPosts;

    return NextResponse.json({
      success: true,
      message: 'Article published live on server',
      post: updatedPost,
      posts: currentPosts
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to publish article' }, { status: 500 });
  }
}

// Bulk Sync Endpoint to Re-Hydrate Server Container from Client Storage
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (body.posts && Array.isArray(body.posts)) {
      const deletedSet = new Set(globalForBlog.deletedIds || []);
      const filtered = body.posts.filter((p: BlogPost) => !deletedSet.has(p.id) && !deletedSet.has(p.slug));
      globalForBlog.serverPosts = filtered;
    }
    if (body.deletedIds && Array.isArray(body.deletedIds)) {
      globalForBlog.deletedIds = Array.from(new Set([...(globalForBlog.deletedIds || []), ...body.deletedIds]));
    }
    return NextResponse.json({
      success: true,
      posts: globalForBlog.serverPosts,
      deletedIds: globalForBlog.deletedIds
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to sync articles' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    if (!globalForBlog.deletedIds) globalForBlog.deletedIds = [];
    globalForBlog.deletedIds.push(id);

    if (globalForBlog.serverPosts) {
      globalForBlog.serverPosts = globalForBlog.serverPosts.filter(p => p.id !== id && p.slug !== id);
    }

    return NextResponse.json({
      success: true,
      message: 'Article permanently deleted',
      posts: globalForBlog.serverPosts || [],
      deletedIds: globalForBlog.deletedIds
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
