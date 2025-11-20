'use client';

import { useState, useEffect } from 'react';
import { getSearchResults } from '@/lib/api-client';
import { SearchResult } from '@/lib/types';

interface SearchBarProps {
  onSymbolSelect: (symbol: string) => void;
}

export default function SearchBar({ onSymbolSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await getSearchResults(query, abortController.signal);
        if (!abortController.signal.aborted) {
          setResults(searchResults.slice(0, 10));
          setShowResults(true);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
          setResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => {
      clearTimeout(debounceTimer);
      abortController.abort();
    };
  }, [query]);

  const handleSelect = (symbol: string) => {
    onSymbolSelect(symbol);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        placeholder="Search symbol (e.g., AAPL, MSFT)..."
        className="w-full px-4 py-2 bg-zeterminal-panel zeterminal-border rounded text-zeterminal-text placeholder-zeterminal-textMuted focus:outline-none focus:ring-2 focus:ring-zeterminal-accent"
      />
      
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-zeterminal-panel zeterminal-border rounded shadow-lg max-h-96 overflow-y-auto scrollbar-thin">
          {isSearching ? (
            <div className="p-4 text-zeterminal-textMuted text-center">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-zeterminal-textMuted text-center">No results found</div>
          ) : (
            <div>
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(result['1. symbol'])}
                  className="px-4 py-3 hover:bg-zeterminal-border cursor-pointer border-b border-zeterminal-border/50 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{result['1. symbol']}</div>
                      <div className="text-sm text-zeterminal-textMuted">{result['2. name']}</div>
                    </div>
                    <div className="text-sm text-zeterminal-textMuted">
                      {result['4. region']} • {result['8. currency']}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

