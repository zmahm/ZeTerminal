'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getQuote } from '@/lib/api-client';
import { Quote } from '@/lib/types';

interface QuotePanelProps {
  symbol: string;
}

export default function QuotePanel({ symbol }: QuotePanelProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchQuote = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getQuote(symbol, abortController.signal);
        
        if (abortController.signal.aborted) return;
        
        if (data) {
          setQuote(data);
        } else {
          setError('Symbol not found');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Failed to fetch quote');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 30000);

    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, [symbol]);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="zeterminal-panel p-4"
      >
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-zeterminal-textMuted"
        >
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  if (error || !quote) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="zeterminal-panel p-4"
      >
        <div className="text-zeterminal-red">{error || 'No data available'}</div>
      </motion.div>
    );
  }

  const getValue = (key: string, fallback?: any) => {
    if (quote[key]) return quote[key];
    if (fallback !== undefined) return fallback;
    return 'N/A';
  };

  const price = parseFloat(getValue('05. price', quote.price || '0'));
  const change = parseFloat(getValue('09. change', quote.change || '0'));
  const changePercent = parseFloat(
    getValue('10. change percent', quote.changePercent || '0').toString().replace('%', '')
  );
  const volume = getValue('06. volume', quote.volume || '0');
  const high = parseFloat(getValue('03. high', quote.high || '0'));
  const low = parseFloat(getValue('04. low', quote.low || '0'));
  const open = parseFloat(getValue('02. open', quote.open || '0'));
  const previousClose = parseFloat(getValue('08. previous close', quote.previousClose || '0'));

  const isPositive = change >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="zeterminal-panel p-4"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-xl font-bold">{getValue('01. symbol', quote.symbol || symbol)}</h2>
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-right"
        >
          <motion.div 
            key={price}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold"
          >
            {price.toFixed(2)}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-lg font-semibold ${isPositive ? 'price-up' : 'price-down'}`}
          >
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4 text-sm"
      >
        {[
          { label: 'Open', value: open.toFixed(2), color: '' },
          { label: 'Previous Close', value: previousClose.toFixed(2), color: '' },
          { label: 'High', value: high.toFixed(2), color: 'price-up' },
          { label: 'Low', value: low.toFixed(2), color: 'price-down' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="text-zeterminal-textMuted mb-1">{item.label}</div>
            <div className={item.color}>{item.value}</div>
          </motion.div>
        ))}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="col-span-2"
        >
          <div className="text-zeterminal-textMuted mb-1">Volume</div>
          <div>{parseInt(volume).toLocaleString()}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

