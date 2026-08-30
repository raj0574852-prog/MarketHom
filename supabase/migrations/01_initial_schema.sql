-- Create the posts table
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT,
  date TEXT NOT NULL,
  read_time TEXT,
  icon TEXT,
  featured BOOLEAN DEFAULT false,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  no_index BOOLEAN DEFAULT false,
  no_follow BOOLEAN DEFAULT false,
  canonical_url TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only for published posts)
CREATE POLICY "Public can read published posts"
ON posts
FOR SELECT
TO public
USING (status = 'published');

-- Note: No policies are created for INSERT/UPDATE/DELETE.
-- This intentionally restricts all mutations from the public anon key.
-- The server will use the SERVICE_ROLE_KEY to bypass RLS for admin operations.
