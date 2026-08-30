import { NextResponse } from 'next/server';
import { BlogPost } from '@/lib/blogStore';
import { getPublishedPosts, getAllPostsForAdmin, createPost, updatePost, deletePost, getPublishedPostBySlug } from '@/lib/blog/posts';
import crypto from 'crypto';

// Reusable function to verify the secure admin session
function verifyAdminSession(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';
  
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  const providedToken = match ? match[1] : '';

  if (sessionToken && providedToken && providedToken.length === sessionToken.length) {
    return crypto.timingSafeEqual(Buffer.from(providedToken), Buffer.from(sessionToken));
  }
  return false;
}

export async function GET(request: Request) {
  try {
    // If Admin, they get all posts (including drafts/unlisted if we had them)
    const isAdmin = verifyAdminSession(request);
    
    let posts: BlogPost[] = [];
    if (isAdmin) {
      posts = await getAllPostsForAdmin();
    } else {
      // Public only gets published posts
      posts = await getPublishedPosts();
    }

    return NextResponse.json({
      success: true,
      posts: posts,
      deletedIds: [] // No longer needed with Supabase
    });
  } catch (err) {
    console.error('Error fetching blog posts via API:', err);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body: BlogPost = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const dateStr = body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if we are updating an existing post
    const existingPost = body.id ? await getAllPostsForAdmin().then(posts => posts.find(p => p.id === body.id)) : null;

    let savedPost: BlogPost | null;

    if (existingPost) {
      // Update
      const updates = { ...body, date: dateStr, slug };
      savedPost = await updatePost(existingPost.id, updates);
    } else {
      // Create
      const newPost = {
        ...body,
        id: body.id || 'post-' + Date.now(),
        date: dateStr,
        slug
      };
      savedPost = await createPost(newPost);
    }

    const allPosts = await getAllPostsForAdmin();

    return NextResponse.json({
      success: true,
      message: 'Article published live on Supabase',
      post: savedPost,
      posts: allPosts
    });
  } catch (error: any) {
    console.error('Error in POST /api/blog:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to publish article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // We no longer need the bulk PUT sync from localStorage. 
  // We reject it here, except maybe if they are using it? The admin panel triggers this sometimes.
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  // Just return success and the current server state to make the frontend happy,
  // but don't overwrite Supabase with localStorage.
  const allPosts = await getAllPostsForAdmin();
  
  return NextResponse.json({
    success: true,
    posts: allPosts,
    deletedIds: []
  });
}

export async function DELETE(request: Request) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    await deletePost(id);
    const allPosts = await getAllPostsForAdmin();

    return NextResponse.json({
      success: true,
      message: 'Article permanently deleted from Supabase',
      posts: allPosts,
      deletedIds: []
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/blog:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete article' }, { status: 500 });
  }
}
