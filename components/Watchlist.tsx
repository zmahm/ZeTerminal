'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMultipleQuotes } from '@/lib/api-client';
import { Quote } from '@/lib/types';

interface WatchlistProps {
  symbols: string[];
  onSymbolSelect?: (symbol: string) => void;
}

export default function Watchlist({ symbols, onSymbolSelect }: WatchlistProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchQuotes = async () => {
      if (symbols.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const data = await getMultipleQuotes(symbols, abortController.signal);
      if (!abortController.signal.aborted) {
        setQuotes(data);
        setIsLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);

    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, [symbols]);

  const getPrice = (quote: Quote) => {
    return quote.price || parseFloat(quote['05. price'] || '0');
  };

  const getChange = (quote: Quote) => {
    if (quote.change !== undefined) return quote.change;
    return parseFloat(quote['09. change'] || '0');
  };

  const getChangePercent = (quote: Quote) => {
    if (quote.changePercent !== undefined) return quote.changePercent;
    const percent = quote['10. change percent']?.replace('%', '') || '0';
    return parseFloat(percent);
  };

  const getSymbol = (quote: Quote) => {
    return quote.symbol || 'N/A';
  };

  if (isLoading) {
    return (
      <div className="zeterminal-panel p-4 h-full">
        <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
        <div className="text-zeterminal-textMuted">Loading...</div>
      </div>
    );
  }

  if (symbols.length === 0) {
    return (
      <div className="zeterminal-panel p-4 h-full">
        <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
        <div className="text-zeterminal-textMuted">No symbols in watchlist</div>
      </div>
    );
  }

  return (
    <div className="zeterminal-panel p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zeterminal-border">
              <th className="text-left py-2 text-zeterminal-textMuted font-semibold">Symbol</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Price</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Change</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">%</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {quotes.map((quote, index) => {
                const symbol = getSymbol(quote);
                const price = getPrice(quote);
                const change = getChange(quote);
                const changePercent = getChangePercent(quote);
                const isPositive = change >= 0;

                return (
                  <motion.tr
                    key={symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-zeterminal-border/50 hover:bg-zeterminal-border/30 cursor-pointer transition-colors"
                    onClick={() => onSymbolSelect && onSymbolSelect(symbol)}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <td className="py-2 font-semibold">{symbol}</td>
                    <td className="text-right py-2">
                      <motion.span
                        key={price}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {price.toFixed(2)}
                      </motion.span>
                    </td>
                    <td className={`text-right py-2 font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
                      {isPositive ? '+' : ''}{change.toFixed(2)}
                    </td>
                    <td className={`text-right py-2 font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
                      {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

