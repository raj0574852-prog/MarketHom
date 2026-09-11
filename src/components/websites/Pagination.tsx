'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/websites?${params.toString()}`;
  };

  const btnClass = "px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium shadow-sm transition-colors";
  const disabledClass = "px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 opacity-50 cursor-not-allowed font-medium shadow-sm transition-colors";
  const activeClass = "px-4 py-2 bg-[hsl(217,91%,54%)] text-white font-medium rounded-lg shadow-sm border border-[hsl(217,91%,54%)]";

  // Calculate the range of pages to show (up to 5)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = startPage + 4;
  
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - 4);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center justify-center mt-12 gap-4">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
        {currentPage <= 1 ? (
          <span className={disabledClass}>Previous</span>
        ) : (
          <Link href={getPageUrl(currentPage - 1)} className={btnClass}>
            Previous
          </Link>
        )}
        
        <div className="flex gap-1 sm:gap-2">
          {pages.map((p) => (
            <Link 
              key={p} 
              href={getPageUrl(p)}
              className={p === currentPage ? activeClass : btnClass}
            >
              {p}
            </Link>
          ))}
        </div>
        
        {currentPage >= totalPages ? (
          <span className={disabledClass}>Next</span>
        ) : (
          <Link href={getPageUrl(currentPage + 1)} className={btnClass}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
