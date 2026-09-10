'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Pagination({
  currentPage,
  hasNextPage,
}: {
  currentPage: number;
  hasNextPage: boolean;
}) {
  const searchParams = useSearchParams();

  if (currentPage <= 1 && !hasNextPage) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/websites?${params.toString()}`;
  };

  const btnClass = "px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium shadow-sm transition-colors";
  const disabledClass = "px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 opacity-50 cursor-not-allowed font-medium shadow-sm transition-colors";

  return (
    <div className="flex flex-col items-center justify-center mt-12 gap-4">
      <div className="flex items-center gap-4">
        {currentPage <= 1 ? (
          <span className={disabledClass}>Previous</span>
        ) : (
          <Link href={getPageUrl(currentPage - 1)} className={btnClass}>
            Previous
          </Link>
        )}
        
        <div className="font-bold text-slate-900 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
          Page {currentPage}
        </div>
        
        {!hasNextPage ? (
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
