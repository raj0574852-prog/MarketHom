'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({
  currentPage,
  hasNextPage,
}: {
  currentPage: number;
  hasNextPage: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (currentPage <= 1 && !hasNextPage) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/websites?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
        >
          Previous
        </button>
        
        <div className="font-bold text-slate-900 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
          Page {currentPage}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
