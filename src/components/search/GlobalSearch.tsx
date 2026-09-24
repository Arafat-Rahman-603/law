'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Scale, FileText, Users, Briefcase, BookOpen, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: 'law' | 'procedure' | 'person' | 'organization';
  id: string;
  title: string;
  description: string;
  jurisdiction: string;
  url: string;
}

export default function GlobalSearch({ countryId, jurisdictionId, locale }: { countryId?: string, jurisdictionId?: string, locale: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&countryId=${countryId || ''}&jurisdictionId=${jurisdictionId || ''}`);
          const data = await res.json();
          setResults(data.results || []);
          setShowDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, countryId, jurisdictionId]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const getIconForType = (type: string) => {
    switch(type) {
      case 'law': return <Scale size={16} className="text-blue-500" />;
      case 'procedure': return <FileText size={16} className="text-green-500" />;
      case 'person': return <Users size={16} className="text-purple-500" />;
      case 'organization': return <Briefcase size={16} className="text-orange-500" />;
      default: return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  const navigateTo = (url: string) => {
    setShowDropdown(false);
    setQuery('');
    router.push(`/${locale}${url}`);
  };

  const handleAskAI = () => {
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/${locale}/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0 || query.trim().length > 2) setShowDropdown(true); }}
          className="block w-full pl-12 pr-32 py-4 md:py-5 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 sm:text-lg transition-all shadow-sm group-focus-within:shadow-md" 
          placeholder="Search a law, legal problem, section, right..."
        />
        <button 
          onClick={handleAskAI}
          className="absolute inset-y-2 right-2 bg-gray-900 text-white px-4 md:px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm md:text-base flex items-center gap-2"
        >
          Ask AI
        </button>
      </div>

      {showDropdown && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[60vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching verified sources...</div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {results.map((result, idx) => (
                <div 
                  key={`${result.type}-${result.id}-${idx}`}
                  onClick={() => navigateTo(result.url)}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex gap-4 transition-colors"
                >
                  <div className="mt-1 flex-shrink-0">
                    {getIconForType(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{result.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{result.description}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
                      <MapPin size={12} />
                      {result.jurisdiction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-gray-900 font-medium mb-1">No verified information found</p>
              <p className="text-sm text-gray-500 mb-4">We couldn&apos;t find verified legal info for this query in the current jurisdiction.</p>
              <div className="flex gap-2">
                <button onClick={handleAskAI} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  Ask AI Anyway
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Change Jurisdiction
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
