'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMultipleQuotes } from '@/lib/api-client';
import { Quote } from '@/lib/types';

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'JNJ'];

export default function MarketTicker() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      const data = await getMultipleQuotes(DEFAULT_SYMBOLS);
      setQuotes(data);
      setIsLoading(false);
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-zeterminal-darker zeterminal-border border-t border-b py-2 px-4"
      >
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-zeterminal-textMuted"
        >
          Loading market data...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-zeterminal-darker zeterminal-border border-t border-b py-2 overflow-hidden"
    >
      <div className="flex animate-scroll whitespace-nowrap">
        {quotes.map((quote, index) => {
          const symbol = getSymbol(quote);
          const price = getPrice(quote);
          const change = getChange(quote);
          const changePercent = getChangePercent(quote);
          const isPositive = change >= 0;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 px-6 border-r border-zeterminal-border"
            >
              <span className="font-semibold text-sm">{symbol}</span>
              <motion.span 
                key={price}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm"
              >
                {price.toFixed(2)}
              </motion.span>
              <span className={`text-sm font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </motion.div>
          );
        })}
        {quotes.map((quote, index) => {
          const symbol = getSymbol(quote);
          const price = getPrice(quote);
          const change = getChange(quote);
          const changePercent = getChangePercent(quote);
          const isPositive = change >= 0;

          return (
            <div key={`dup-${index}`} className="flex items-center gap-4 px-6 border-r border-zeterminal-border">
              <span className="font-semibold text-sm">{symbol}</span>
              <span className="text-sm">{price.toFixed(2)}</span>
              <span className={`text-sm font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}

