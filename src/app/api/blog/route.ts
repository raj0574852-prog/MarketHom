import { NextResponse } from 'next/server';
import { BlogPost, INITIAL_POSTS } from '@/lib/blogStore';
import fs from 'fs';
import path from 'path';

// Permanent file-backed storage on server to protect SEO rankings
const STORAGE_FILE = path.join(process.cwd(), 'data_posts_backup.json');

const globalForBlog = globalThis as unknown as {
  serverPosts: BlogPost[] | undefined;
};

// Helper to read posts from disk or memory
function loadPermanentPosts(): BlogPost[] {
  if (globalForBlog.serverPosts !== undefined) {
    return globalForBlog.serverPosts;
  }

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const fileData = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        globalForBlog.serverPosts = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading permanent posts file:', e);
  }

  globalForBlog.serverPosts = INITIAL_POSTS;
  savePermanentPosts(INITIAL_POSTS);
  return INITIAL_POSTS;
}

// Helper to save posts permanently to disk and memory
function savePermanentPosts(posts: BlogPost[]): void {
  globalForBlog.serverPosts = posts;
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing permanent posts file:', e);
  }
}

export async function GET() {
  const posts = loadPermanentPosts();
  return NextResponse.json({
    success: true,
    posts
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
    
    let currentPosts = loadPermanentPosts();

    const existingIndex = currentPosts.findIndex(p => p.id === body.id || (body.id && p.id === body.id) || p.slug === slug);

    let updatedPost: BlogPost;

    if (existingIndex >= 0) {
      // Update existing post at exact index
      updatedPost = { ...currentPosts[existingIndex], ...body, date: dateStr, slug };
      currentPosts[existingIndex] = updatedPost;
    } else {
      // Create new post
      updatedPost = {
        ...body,
        id: body.id || 'post-' + Date.now(),
        date: dateStr,
        slug
      };
      currentPosts = [updatedPost, ...currentPosts];
    }

    savePermanentPosts(currentPosts);

    return NextResponse.json({
      success: true,
      message: 'Article published permanently live on server',
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

    let currentPosts = loadPermanentPosts();
    // Strictly filter out ONLY the matching article ID or slug
    const updated = currentPosts.filter(p => p.id !== id && p.slug !== id);

    savePermanentPosts(updated);

    return NextResponse.json({
      success: true,
      message: 'Article deleted by admin action',
      posts: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
