import Link from 'next/link';
import { getRecentPublishedPosts } from '@/lib/blog/posts';

export default async function BlogPreview() {
  const posts = await getRecentPublishedPosts(3);

  // Helper function for category color assignment
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI SEO': return 'hsl(270,80%,60%)';
      case 'PPC': return 'hsl(39,100%,58%)';
      case 'Local SEO': return 'hsl(152,69%,46%)';
      default: return 'hsl(217,91%,65%)';
    }
  };

  return (
    <section className="section-padding bg-[hsl(222,47%,5%)]" id="blog">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="badge mb-4">Latest Insights</span>
            <h2 className="text-4xl md:text-5xl font-black">
              Expert Marketing{' '}
              <span className="gradient-text">Knowledge</span>
            </h2>
          </div>
          <Link href="/blog" className="btn-outline whitespace-nowrap">
            View All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="glass-card overflow-hidden group"
            >
              {/* Image placeholder with gradient */}
              <div
                className="h-44 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${getCategoryColor(post.category)}20, hsl(222,47%,12%))`,
                }}
              >
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-30">
                      {post.icon || '📝'}
                    </span>
                  </div>
                )}
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: `${getCategoryColor(post.category)}25`, color: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-[hsl(215,20%,50%)] mb-3">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime || '5 min read'}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>

                <h3 className="text-base font-bold mb-3 group-hover:text-[hsl(217,91%,75%)] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-[hsl(217,91%,65%)] group-hover:gap-4 transition-all duration-200">
                  Read Article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
