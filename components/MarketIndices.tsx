'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getQuote } from '@/lib/api-client';
import { Quote } from '@/lib/types';

const INDICES = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: '^VIX', name: 'VIX' },
];

export default function MarketIndices() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      setIsLoading(true);
      const quotesMap: Record<string, any> = {};

      for (const index of INDICES) {
        try {
          const quote = await getQuote(index.symbol);
          if (quote) {
            quotesMap[index.symbol] = quote;
          }
        } catch (error) {
          console.error(`Error fetching ${index.symbol}:`, error);
        }
      }

      setQuotes(quotesMap);
      setIsLoading(false);
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 60000);

    return () => clearInterval(interval);
  }, []);

  const getPrice = (quote: any) => {
    return quote?.price || parseFloat(quote?.['05. price'] || '0');
  };

  const getChange = (quote: any) => {
    if (quote?.change !== undefined) return quote.change;
    return parseFloat(quote?.['09. change'] || '0');
  };

  const getChangePercent = (quote: any) => {
    if (quote?.changePercent !== undefined) return quote.changePercent;
    const percent = quote?.['10. change percent']?.replace('%', '') || '0';
    return parseFloat(percent);
  };

  if (isLoading) {
    return (
      <div className="zeterminal-panel p-2">
        <div className="text-xs text-zeterminal-textMuted">Loading indices...</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="zeterminal-panel p-2"
    >
      <div className="flex gap-4 text-xs">
        {INDICES.map((index, idx) => {
          const quote = quotes[index.symbol];
          if (!quote) return null;

          const price = getPrice(quote);
          const change = getChange(quote);
          const changePercent = getChangePercent(quote);
          const isPositive = change >= 0;

          return (
            <motion.div 
              key={index.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-zeterminal-textMuted">{index.name}:</span>
              <motion.span
                key={price}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {price.toFixed(2)}
              </motion.span>
              <span className={isPositive ? 'price-up' : 'price-down'}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

