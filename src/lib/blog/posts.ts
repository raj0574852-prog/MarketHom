import { supabase, getServiceSupabase } from '../supabaseClient';
import { BlogPost } from '../blogStore';

// Mappers to translate between Frontend (camelCase) and Supabase (snake_case)
function mapToSupabase(post: Partial<BlogPost>) {
  const mapped: any = { ...post };
  
  // Map camelCase to snake_case
  if (post.authorRole !== undefined) { mapped.author_role = post.authorRole; delete mapped.authorRole; }
  if (post.readTime !== undefined) { mapped.read_time = post.readTime; delete mapped.readTime; }
  if (post.featuredImage !== undefined) { mapped.featured_image = post.featuredImage; delete mapped.featuredImage; }
  if (post.metaTitle !== undefined) { mapped.meta_title = post.metaTitle; delete mapped.metaTitle; }
  if (post.metaDescription !== undefined) { mapped.meta_description = post.metaDescription; delete mapped.metaDescription; }
  if (post.noIndex !== undefined) { mapped.no_index = post.noIndex; delete mapped.noIndex; }
  if (post.noFollow !== undefined) { mapped.no_follow = post.noFollow; delete mapped.noFollow; }
  if (post.canonicalUrl !== undefined) { mapped.canonical_url = post.canonicalUrl; delete mapped.canonicalUrl; }
  
  // Always ensure status is set to published for public viewing
  if (!mapped.status) mapped.status = 'published';
  
  return mapped;
}

function mapFromSupabase(row: any): BlogPost {
  return {
    ...row,
    authorRole: row.author_role,
    readTime: row.read_time,
    featuredImage: row.featured_image,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    noIndex: row.no_index,
    noFollow: row.no_follow,
    canonicalUrl: row.canonical_url,
  } as BlogPost;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }

  return (data || []).map(mapFromSupabase);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error(`Error fetching post by slug ${slug}:`, error);
    }
    return null;
  }

  return mapFromSupabase(data);
}

export async function getRecentPublishedPosts(limit: number = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
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
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts for admin:', error);
    return [];
  }

  return (data || []).map(mapFromSupabase);
}

export async function createPost(post: BlogPost): Promise<BlogPost | null> {
  const adminSupabase = getServiceSupabase();
  const { data, error } = await adminSupabase
    .from('posts')
    .insert([mapToSupabase(post)])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return mapFromSupabase(data);
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const adminSupabase = getServiceSupabase();
  const { data, error } = await adminSupabase
    .from('posts')
    .update({ ...mapToSupabase(updates), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }

  return mapFromSupabase(data);
}

export async function deletePost(id: string): Promise<boolean> {
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
  const { data, error } = await adminSupabase
    .from('posts')
    .upsert([mapToSupabase(post)], { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting post:', error);
    throw error;
  }

  return mapFromSupabase(data);
}
