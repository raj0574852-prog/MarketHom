import { NextResponse } from 'next/server';
import { BlogPost, INITIAL_POSTS } from '@/lib/blogStore';

// Server-side memory cache in global object for Next.js server runtime
const globalForBlog = globalThis as unknown as {
  serverPosts: BlogPost[] | undefined;
};

if (!globalForBlog.serverPosts) {
  globalForBlog.serverPosts = INITIAL_POSTS;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    posts: globalForBlog.serverPosts || INITIAL_POSTS
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
    
    let currentPosts = globalForBlog.serverPosts || INITIAL_POSTS;

    let updatedPost: BlogPost;

    if (body.id) {
      // Update existing post
      updatedPost = { ...body, date: dateStr, slug };
      currentPosts = currentPosts.map(p => p.id === body.id ? updatedPost : p);
    } else {
      // Create new post
      updatedPost = {
        ...body,
        id: 'post-' + Date.now(),
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    if (globalForBlog.serverPosts) {
      globalForBlog.serverPosts = globalForBlog.serverPosts.filter(p => p.id !== id);
    }

    return NextResponse.json({
      success: true,
      posts: globalForBlog.serverPosts || INITIAL_POSTS
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
