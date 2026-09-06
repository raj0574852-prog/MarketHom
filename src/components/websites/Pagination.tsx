'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/websites?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 gap-4">
      <div className="text-sm text-slate-500">
        Showing <span className="font-bold text-slate-900">{(currentPage - 1) * 20 + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * 20, totalItems)}</span> of <span className="font-bold text-slate-900">{totalItems}</span> results
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${
                currentPage === page
                  ? 'bg-[hsl(217,91%,54%)] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
