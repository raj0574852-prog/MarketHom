import { getServiceSupabase } from '../supabaseClient';
import { BlogPost, getPostBySlug, getStoredPosts } from '../blogStore';
import { CANONICAL_SITE_URL } from '../constants';

interface SupabasePostRow {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  author?: string;
  author_role?: string;
  read_time?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  no_index?: boolean;
  no_follow?: boolean;
  canonical_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Mappers to translate between Frontend (camelCase) and Supabase (snake_case)
function mapToSupabase(post: Partial<BlogPost>) {
  const mapped: Record<string, unknown> = { ...post };
  
  // Map camelCase to snake_case
  if (post.authorRole !== undefined) { mapped.author_role = post.authorRole; delete mapped.authorRole; }
  if (post.readTime !== undefined) { mapped.read_time = post.readTime; delete mapped.readTime; }
  if (post.featuredImage !== undefined) { mapped.featured_image = post.featuredImage; delete mapped.featuredImage; }
  if (post.metaTitle !== undefined) { mapped.meta_title = post.metaTitle; delete mapped.metaTitle; }
  if (post.metaDescription !== undefined) { mapped.meta_description = post.metaDescription; delete mapped.metaDescription; }
  if (post.keywords !== undefined) { mapped.keywords = post.keywords; }
  if (post.noIndex !== undefined) { mapped.no_index = post.noIndex; delete mapped.noIndex; }
  if (post.noFollow !== undefined) { mapped.no_follow = post.noFollow; delete mapped.noFollow; }
  
  // Canonical URL: If provided, use it. If not provided or blank, automatically construct from slug
  const slug = post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
  const providedCanonical = post.canonicalUrl && typeof post.canonicalUrl === 'string' ? post.canonicalUrl.trim() : '';
  mapped.canonical_url = providedCanonical || (slug ? `${CANONICAL_SITE_URL}/blog/${slug}` : null);
  delete mapped.canonicalUrl;
  
  // Always ensure status is set to published for public viewing
  if (!mapped.status) mapped.status = 'published';
  
  return mapped;
}

function mapFromSupabase(row: SupabasePostRow): BlogPost {
  // Sanitize massive base64 strings that bloat the HTML payload to multiple megabytes
  let sanitizedImage = row.featured_image;
  if (sanitizedImage && sanitizedImage.startsWith('data:image') && sanitizedImage.length > 50000) {
    console.warn(`Stripped massive base64 image from post ${row.slug}`);
    sanitizedImage = undefined;
  }

  // Guarantee canonicalUrl is always populated
  const canonicalUrl = row.canonical_url && String(row.canonical_url).trim().length > 0
    ? String(row.canonical_url).trim()
    : `${CANONICAL_SITE_URL}/blog/${row.slug}`;

  return {
    ...row,
    authorRole: row.author_role,
    readTime: row.read_time,
    featuredImage: sanitizedImage,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: (row.keywords as string) || undefined,
    noIndex: row.no_index,
    noFollow: row.no_follow,
    canonicalUrl,
  } as BlogPost;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  let dbPosts: BlogPost[] = [];
  try {
    const client = getServiceSupabase();
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      dbPosts = data.map(mapFromSupabase);
    }
  } catch (err) {
    console.error('Error fetching published posts from Supabase:', err);
  }

  if (dbPosts.length > 0) {
    return dbPosts;
  }

  return getStoredPosts();
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const client = getServiceSupabase();
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (!error && data) {
      return mapFromSupabase(data);
    }
  } catch (err) {
    console.error(`Error fetching post by slug ${slug}:`, err);
  }

  try {
    const fallback = getPostBySlug(slug);
    if (fallback) return fallback;
  } catch {}

  return null;
}

export async function getRecentPublishedPosts(limit: number = 3): Promise<BlogPost[]> {
  const client = getServiceSupabase();
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }

  return (data || []).map(mapFromSupabase);
}

// Admin only operations
export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  const adminSupabase = getServiceSupabase();
  const { data, error } = await adminSupabase
    .from('posts')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts for admin:', error);
    return [];
  }

  return (data || []).map(mapFromSupabase);
}

export async function createPost(post: BlogPost): Promise<BlogPost | null> {
  return upsertPost(post);
}

async function safeUpdate(adminSupabase: any, payload: Record<string, any>, id: string) {
  let { data, error } = await adminSupabase
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error && 'keywords' in payload && (error.message?.includes('keywords') || error.code === 'PGRST204' || error.code === '42703')) {
    console.warn('Supabase posts table missing keywords column, retrying update without keywords:', error.message);
    const { keywords, ...withoutKeywords } = payload;
    const retryResult = await adminSupabase
      .from('posts')
      .update(withoutKeywords)
      .eq('id', id)
      .select()
      .single();
    data = retryResult.data;
    error = retryResult.error;
  }

  if (error) {
    throw error;
  }
  return data;
}

async function safeInsert(adminSupabase: any, payload: Record<string, any>) {
  let { data, error } = await adminSupabase
    .from('posts')
    .insert([payload])
    .select()
    .single();

  if (error && 'keywords' in payload && (error.message?.includes('keywords') || error.code === 'PGRST204' || error.code === '42703')) {
    console.warn('Supabase posts table missing keywords column, retrying insert without keywords:', error.message);
    const { keywords, ...withoutKeywords } = payload;
    const retryResult = await adminSupabase
      .from('posts')
      .insert([withoutKeywords])
      .select()
      .single();
    data = retryResult.data;
    error = retryResult.error;
  }

  if (error) {
    throw error;
  }
  return data;
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const adminSupabase = getServiceSupabase();
  const payload = { ...mapToSupabase(updates), updated_at: new Date().toISOString() };
  try {
    const data = await safeUpdate(adminSupabase, payload, id);
    return mapFromSupabase(data);
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  // Soft delete by archiving to preserve content integrity and prevent permanent data loss
  const adminSupabase = getServiceSupabase();
  const { error } = await adminSupabase
    .from('posts')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error(`Error archiving post ${id}:`, error);
    throw error;
  }

  return true;
}

export async function hardDeletePost(id: string): Promise<boolean> {
  const adminSupabase = getServiceSupabase();
  const { error } = await adminSupabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }

  return true;
}

export async function upsertPost(post: BlogPost): Promise<BlogPost | null> {
  const adminSupabase = getServiceSupabase();
  const mapped = mapToSupabase(post);
  const now = new Date().toISOString();

  // Find if already exists by id or slug to prevent unique slug collisions
  const { data: existing } = await adminSupabase
    .from('posts')
    .select('id, slug')
    .or(`id.eq.${post.id},slug.eq.${post.slug}`)
    .limit(1)
    .maybeSingle();

  if (existing) {
    try {
      const data = await safeUpdate(adminSupabase, { ...mapped, id: existing.id, updated_at: now }, existing.id);
      return mapFromSupabase(data);
    } catch (error) {
      console.error(`Error updating post ${existing.id}:`, error);
      throw error;
    }
  } else {
    try {
      const data = await safeInsert(adminSupabase, { ...mapped, created_at: now, updated_at: now });
      return mapFromSupabase(data);
    } catch (error) {
      console.error('Error inserting post:', error);
      throw error;
    }
  }
}
