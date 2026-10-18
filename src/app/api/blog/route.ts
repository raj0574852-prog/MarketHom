import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { BlogPost } from '@/lib/blogStore';
import { getPublishedPosts, getAllPostsForAdmin, createPost, updatePost, deletePost, getPublishedPostBySlug } from '@/lib/blog/posts';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // If Admin, they get all posts (including drafts/unlisted if we had them)
    const isAdmin = await isAdminAuthenticated();
    
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
    if (!await isAdminAuthenticated()) {
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

    try {
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'page');
      if (savedPost?.slug) {
        revalidatePath(`/blog/${savedPost.slug}`, 'page');
      }
      revalidatePath('/sitemap.xml', 'page');
    } catch (e) {
      console.warn('Failed to revalidate cache', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Article published live on Supabase',
      post: savedPost,
      posts: allPosts
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/blog:', error);
    const message = error instanceof Error ? error.message : 'Failed to publish article';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // We no longer need the bulk PUT sync from localStorage. 
  // We reject it here, except maybe if they are using it? The admin panel triggers this sometimes.
  if (!await isAdminAuthenticated()) {
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
    if (!await isAdminAuthenticated()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    await deletePost(id);
    const allPosts = await getAllPostsForAdmin();

    try {
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'page');
      revalidatePath('/sitemap.xml', 'page');
    } catch (e) {
      console.warn('Failed to revalidate cache', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Article safely archived from Supabase',
      posts: allPosts,
      deletedIds: []
    });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/blog:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete article';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
