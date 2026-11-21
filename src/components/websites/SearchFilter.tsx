'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, LayoutGrid, List, Filter, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  'Art & Design', 'Automotive', 'Business', 'Crypto', 
  'Education', 'Entertainment', 'Environment', 'Fashion', 
  'Finance', 'Food & Drink', 'Gaming', 'General', 
  'Health', 'Home & Garden', 'Law & Legal', 'Lifestyle', 
  'Marketing', 'News', 'Parenting', 'Pets', 
  'Politics', 'Real Estate', 'Science', 'Sports', 
  'Technology', 'Travel', 'Weddings'
];

const COUNTRIES = [
  "Worldwide", "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", 
  "Austria", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia", 
  "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "Hong Kong", 
  "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Malaysia", 
  "Mexico", "Netherlands", "New Zealand", "Norway", "Poland", "Portugal", 
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", 
  "Sweden", "Switzerland", "Turkey", "United Arab Emirates", "United Kingdom", 
  "United States"
];

function Combobox({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onChange(inputValue); 
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, onChange]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className="w-full pl-3.5 pr-8 py-2.5 text-sm border border-white/10 rounded-xl bg-slate-950/70 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
        </div>
      </div>
      
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1.5 max-h-60 overflow-auto bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl py-1 text-sm divide-y divide-white/5">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                className="px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => {
                  setInputValue(option);
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3.5 py-2.5 text-slate-500 italic">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function SearchFilter({ totalSites = 0 }: { totalSites?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');

  const handleApplyFilter = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    
    const updateParam = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    updateParam('q', q);
    updateParam('category', category);
    updateParam('country', country);
    
    router.push(`/websites?${params.toString()}`);
  };

  const handleClear = () => {
    setQ('');
    setCategory('');
    setCountry('');
    
    const params = new URLSearchParams();
    if (searchParams.get('view')) {
      params.set('view', searchParams.get('view')!);
    }
    router.push(`/websites?${params.toString()}`);
  };

  const toggleView = (view: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`/websites?${params.toString()}`);
  };

  const currentView = searchParams.get('view') || 'grid';

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-6 -mt-10 relative z-20 max-w-7xl mx-auto">
      {/* Search Input Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-5">
        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-2.5 flex-1 max-w-2xl">
          <div className="relative w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <input 
              type="text" 
              placeholder={`Search from ${totalSites > 0 ? totalSites.toLocaleString() : '29,000+'} Digital Publishers...`}
              className="w-full pl-10 pr-4 py-3 text-sm border border-white/10 rounded-2xl bg-slate-950/70 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => handleApplyFilter()} 
              className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold rounded-2xl shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer whitespace-nowrap"
            >
              Search Catalog
            </button>
            <button 
              type="button"
              onClick={handleClear} 
              className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-sm font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex w-full lg:w-auto justify-between lg:justify-end items-center gap-3">
          <div className="flex border border-white/10 rounded-xl p-1 bg-slate-950/60">
            <button 
              type="button"
              onClick={() => toggleView('grid')}
              className={`p-2 rounded-lg transition-all ${currentView !== 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => toggleView('list')}
              className={`p-2 rounded-lg transition-all ${currentView === 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button 
            type="button"
            onClick={() => handleApplyFilter()} 
            className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Advanced Filter Controls */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/5">
        <form onSubmit={handleApplyFilter} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Category Niche</span>
            </label>
            <Combobox 
              options={CATEGORIES} 
              value={category} 
              onChange={setCategory} 
              placeholder="All Categories (Tech, Travel, Finance...)" 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Target Country</span>
            </label>
            <Combobox 
              options={COUNTRIES} 
              value={country} 
              onChange={setCountry} 
              placeholder="Worldwide or specific country..." 
            />
          </div>
          
          <button type="submit" className="hidden"></button>
        </form>
      </div>
    </div>
  );
}
