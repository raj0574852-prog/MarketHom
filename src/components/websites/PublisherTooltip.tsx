'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PublisherTooltipProps {
  title: string;
  value: string | number;
  provider?: string;
  scale?: string;
  definition: string;
  children: React.ReactNode;
}

export function PublisherTooltip({
  title,
  value,
  provider,
  scale,
  definition,
  children
}: PublisherTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleFocus = () => setIsOpen(true);
  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div 
      className="relative flex items-center justify-center" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <button
        type="button"
        className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={`Information about ${title}`}
        aria-expanded={isOpen}
        onClick={toggleOpen}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-64 p-4 mt-2 text-left bg-white rounded-xl shadow-xl border border-slate-200"
          style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
          role="tooltip"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
            <button 
              className="text-slate-400 hover:text-slate-600 sm:hidden"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1 mb-3">
            <div className="text-xs text-slate-700 font-medium flex justify-between">
              <span className="text-slate-500">Value:</span> {value}
            </div>
            {provider && (
              <div className="text-xs text-slate-700 font-medium flex justify-between">
                <span className="text-slate-500">Provider:</span> {provider}
              </div>
            )}
            {scale && (
              <div className="text-xs text-slate-700 font-medium flex justify-between">
                <span className="text-slate-500">Scale:</span> {scale}
              </div>
            )}
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
            {definition}
          </p>
        </div>
      )}
    </div>
  );
}
