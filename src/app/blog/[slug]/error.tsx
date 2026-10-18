'use client';

import Link from 'next/link';

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-40 pb-20 text-center container-custom min-h-[60vh] flex flex-col items-center justify-center bg-[hsl(222,47%,7%)] text-white">
      <span className="text-6xl mb-4">📰</span>
      <h1 className="text-4xl font-bold mb-4">Article Reloading</h1>
      <p className="text-[hsl(215,20%,60%)] mb-8 max-w-md">
        We encountered a brief hiccup while loading this article. You can retry or browse all published articles.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-[hsl(217,91%,54%)] text-white font-bold hover:bg-[hsl(217,91%,60%)] transition-colors"
        >
          Retry
        </button>
        <Link href="/blog" className="px-6 py-3 rounded-xl border border-[hsl(215,25%,22%)] text-white font-bold hover:border-white transition-colors">
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
