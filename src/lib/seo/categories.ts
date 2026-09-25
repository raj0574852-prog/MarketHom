export const CATEGORY_NAMES = [
  'Art & Design', 'Automotive', 'Business', 'Crypto', 
  'Education', 'Entertainment', 'Environment', 'Fashion', 
  'Finance', 'Food & Drink', 'Gaming', 'General', 
  'Health', 'Home & Garden', 'Law & Legal', 'Lifestyle', 
  'Marketing', 'News', 'Parenting', 'Pets', 
  'Politics', 'Real Estate', 'Science', 'Sports', 
  'Technology', 'Travel', 'Weddings'
];

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getCategoryNameFromSlug(slug: string): string | undefined {
  return CATEGORY_NAMES.find(c => slugifyCategory(c) === slug);
}

export const CATEGORY_SLUGS = CATEGORY_NAMES.map(name => ({
  name,
  slug: slugifyCategory(name)
}));
