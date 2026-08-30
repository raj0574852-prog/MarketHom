import { supabase, getServiceSupabase } from '../supabaseClient';
import { BlogPost } from '../blogStore';

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

  return data as BlogPost[];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return null;
  }

  return data as BlogPost;
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

  return data as BlogPost[];
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

  return data as BlogPost[];
}

export async function createPost(post: BlogPost): Promise<BlogPost | null> {
  const adminSupabase = getServiceSupabase();
  const { data, error } = await adminSupabase
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return data as BlogPost;
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const adminSupabase = getServiceSupabase();
  const { data, error } = await adminSupabase
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }

  return data as BlogPost;
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
    .upsert([post], { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting post:', error);
    throw error;
  }

  return data as BlogPost;
}
