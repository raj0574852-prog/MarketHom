'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const btnClass = "px-4 py-2 border border-white/10 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-cyan-400/40 font-medium shadow-sm transition-all duration-200 text-sm";
  const disabledClass = "px-4 py-2 border border-white/5 rounded-xl bg-slate-950/40 text-slate-600 opacity-50 cursor-not-allowed font-medium text-sm";
  const activeClass = "px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.35)] border border-cyan-400/40 text-sm";

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
    <div className="flex flex-col items-center justify-center mt-14 gap-4 w-full">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center w-full">
        
        {/* Mobile View: Compact Pagination */}
        <div className="flex sm:hidden items-center justify-between w-full">
          {currentPage <= 1 ? (
            <span className={disabledClass} aria-disabled="true">Previous</span>
          ) : (
            <Link href={getPageUrl(currentPage - 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Previous page">
              Previous
            </Link>
          )}
          
          <span className="text-sm font-medium text-slate-400">
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

        {/* Desktop View: Full Pagination */}
        <div className="hidden sm:flex items-center gap-2">
          {currentPage <= 1 ? (
            <span className={disabledClass} aria-disabled="true">
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Previous
            </span>
          ) : (
            <Link href={getPageUrl(currentPage - 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Previous page">
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Previous
            </Link>
          )}

          {startPage > 1 && (
            <>
              <Link href={getPageUrl(1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass}>
                1
              </Link>
              {startPage > 2 && <span className="text-slate-600 px-1">...</span>}
            </>
          )}

          {pages.map((p) => (
            p === currentPage ? (
              <span key={p} className={activeClass} aria-current="page">
                {p}
              </span>
            ) : (
              <Link key={p} href={getPageUrl(p)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass}>
                {p}
              </Link>
            )
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-slate-600 px-1">...</span>}
              <Link href={getPageUrl(totalPages)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass}>
                {totalPages}
              </Link>
            </>
          )}

          {currentPage >= totalPages ? (
            <span className={disabledClass} aria-disabled="true">
              Next
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </span>
          ) : (
            <Link href={getPageUrl(currentPage + 1)} scroll={false} onClick={() => document.getElementById('marketplace-results')?.scrollIntoView({ behavior: 'smooth' })} className={btnClass} aria-label="Next page">
              Next
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
