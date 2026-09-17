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
    <div className="flex flex-col items-center justify-center mt-12 gap-4 w-full">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center w-full">
        
        {/* Mobile View: Compact Pagination */}
        <div className="flex sm:hidden items-center justify-between w-full">
          {currentPage <= 1 ? (
            <span className={disabledClass} aria-disabled="true">Previous</span>
          ) : (
            <Link href={getPageUrl(currentPage - 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Previous page">
              Previous
            </Link>
          )}
          
          <span className="text-sm font-medium text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          
          {currentPage >= totalPages ? (
            <span className={disabledClass} aria-disabled="true">Next</span>
          ) : (
            <Link href={getPageUrl(currentPage + 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Next page">
              Next
            </Link>
          )}
        </div>

        {/* Desktop View: Detailed Pagination */}
        <div className="hidden sm:flex items-center gap-2">
          {currentPage <= 1 ? (
            <span className={disabledClass} aria-disabled="true">Previous</span>
          ) : (
            <Link href={getPageUrl(currentPage - 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Previous page">
              Previous
            </Link>
          )}
          
          <div className="flex gap-1">
            {startPage > 1 && (
              <>
                <Link href={getPageUrl(1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Go to page 1">1</Link>
                {startPage > 2 && <span className="px-2 py-2 text-slate-400">...</span>}
              </>
            )}

            {pages.map((p) => (
              <Link 
                key={p} 
                href={getPageUrl(p)}
                scroll={false} 
                onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })}
                className={p === currentPage ? activeClass : btnClass}
                aria-current={p === currentPage ? "page" : undefined}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </Link>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2 py-2 text-slate-400">...</span>}
                <Link href={getPageUrl(totalPages)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label={`Go to page ${totalPages}`}>{totalPages}</Link>
              </>
            )}
          </div>
          
          {currentPage >= totalPages ? (
            <span className={disabledClass} aria-disabled="true">Next</span>
          ) : (
            <Link href={getPageUrl(currentPage + 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Next page">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
