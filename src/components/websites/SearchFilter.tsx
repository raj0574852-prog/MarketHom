'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useRef, useEffect } from 'react';

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
  "Worldwide", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", 
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
  "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", 
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", 
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", 
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
  "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", 
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Custom Combobox Component to enforce a white background
function Combobox({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If they click away and typed something that isn't exactly an option, we still keep their typed text 
        // because the user wants to be able to "enter these into for the filters".
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
      <input
        type="text"
        className="w-full p-2 text-sm border border-slate-200 rounded bg-white text-slate-900 outline-none focus:border-[hsl(217,91%,54%)] focus:ring-1 focus:ring-[hsl(217,91%,54%)]"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
      
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-slate-200 rounded-md shadow-lg py-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
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
            <li className="px-3 py-2 text-sm text-slate-500 italic">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function SearchFilter({ totalSites = 0 }: { totalSites?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for filters
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');

  const handleApplyFilter = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1
    params.delete('page');
    
    // Helper to set or delete param
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
    
    // Push empty params to clear URL but maintain current view
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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 -mt-8 relative z-20 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder={`Search from ${totalSites} Websites`}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[hsl(217,91%,54%)] focus:ring-1 focus:ring-[hsl(217,91%,54%)]"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            />
          </div>
          <button onClick={() => handleApplyFilter()} className="px-4 py-2 bg-white border border-[hsl(217,91%,54%)] text-[hsl(217,91%,54%)] text-sm rounded-md hover:bg-[hsl(217,91%,54%)]/10 transition-colors">
            Search
          </button>
          <button onClick={handleClear} className="px-4 py-2 bg-[hsl(217,91%,54%)] text-white text-sm rounded-md hover:bg-[hsl(217,91%,45%)] transition-colors whitespace-nowrap">
            Clear Search
          </button>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          {/* View Toggles */}
          <div className="flex border border-slate-200 rounded-md p-0.5 bg-slate-50 mr-2">
            <button 
              onClick={() => toggleView('grid')}
              className={`p-1.5 rounded transition-colors ${currentView !== 'list' ? 'bg-white shadow-sm text-[hsl(217,91%,54%)]' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button 
              onClick={() => toggleView('list')}
              className={`p-1.5 rounded transition-colors ${currentView === 'list' ? 'bg-white shadow-sm text-[hsl(217,91%,54%)]' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          <button onClick={() => handleApplyFilter()} className="px-6 py-2 bg-[hsl(217,91%,54%)] text-white text-sm rounded-md hover:bg-[hsl(217,91%,45%)] transition-colors flex items-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Apply Filter
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="bg-[#f0f7ff] p-4 rounded-md border border-blue-100">
        <form onSubmit={handleApplyFilter} className="flex flex-col sm:flex-row gap-4">
          
          <div className="flex flex-col gap-1 w-full sm:w-1/3 relative">
            <label className="text-xs text-slate-600 flex items-center gap-1">Category <span className="text-[10px] text-blue-500 rounded-full border border-blue-200 w-3 h-3 flex items-center justify-center">i</span></label>
            <Combobox 
              options={CATEGORIES} 
              value={category} 
              onChange={setCategory} 
              placeholder="Type or select a category" 
            />
          </div>
          
          <div className="flex flex-col gap-1 w-full sm:w-1/3 relative">
            <label className="text-xs text-slate-600 flex items-center gap-1">Countries <span className="text-[10px] text-blue-500 rounded-full border border-blue-200 w-3 h-3 flex items-center justify-center">i</span></label>
            <Combobox 
              options={COUNTRIES} 
              value={country} 
              onChange={setCountry} 
              placeholder="Type or select a country" 
            />
          </div>
          
          <button type="submit" className="hidden"></button>
        </form>
      </div>
    </div>
  );
}
