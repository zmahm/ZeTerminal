'use client';

import { useState, useEffect } from 'react';
import { getMultipleQuotes } from '@/lib/api-client';
import { Quote, Position } from '@/lib/types';

interface PortfolioProps {
  positions: Position[];
  onRemovePosition?: (symbol: string) => void;
}

export default function Portfolio({ positions, onRemovePosition }: PortfolioProps) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (positions.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const symbols = positions.map(p => p.symbol);
      const data = await getMultipleQuotes(symbols);
      
      const quotesMap: Record<string, Quote> = {};
      data.forEach((quote: Quote) => {
        const symbol = quote.symbol || '';
        quotesMap[symbol] = quote;
      });
      
      setQuotes(quotesMap);
      setIsLoading(false);
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);

    return () => clearInterval(interval);
  }, [positions]);

  const getCurrentPrice = (symbol: string) => {
    const quote = quotes[symbol];
    if (!quote) return 0;
    return quote.price || parseFloat(quote['05. price'] || '0');
  };

  const calculatePositionValue = (position: Position) => {
    const currentPrice = getCurrentPrice(position.symbol);
    return currentPrice * position.shares;
  };

  const calculatePositionGain = (position: Position) => {
    const currentPrice = getCurrentPrice(position.symbol);
    const costBasis = position.avgPrice * position.shares;
    const currentValue = currentPrice * position.shares;
    return currentValue - costBasis;
  };

  const calculatePositionGainPercent = (position: Position) => {
    if (position.avgPrice === 0) return 0;
    const currentPrice = getCurrentPrice(position.symbol);
    return ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
  };

  const totalValue = positions.reduce((sum, pos) => sum + calculatePositionValue(pos), 0);
  const totalCost = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.shares), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost !== 0 ? (totalGain / totalCost) * 100 : 0;

  if (isLoading) {
    return (
      <div className="zeterminal-panel p-4 h-full">
        <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
        <div className="text-zeterminal-textMuted">Loading...</div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="zeterminal-panel p-4 h-full">
        <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
        <div className="text-zeterminal-textMuted">No positions</div>
      </div>
    );
  }

  return (
    <div className="zeterminal-panel p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zeterminal-textMuted">Total Value</div>
            <div className="text-xl font-bold">${totalValue.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-zeterminal-textMuted">Total Gain/Loss</div>
            <div className={`text-xl font-bold ${totalGain >= 0 ? 'price-up' : 'price-down'}`}>
              {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)} ({totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zeterminal-border">
              <th className="text-left py-2 text-zeterminal-textMuted font-semibold">Symbol</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Shares</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Avg Price</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Current</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Value</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">Gain/Loss</th>
              <th className="text-right py-2 text-zeterminal-textMuted font-semibold">%</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => {
              const currentPrice = getCurrentPrice(position.symbol);
              const value = calculatePositionValue(position);
              const gain = calculatePositionGain(position);
              const gainPercent = calculatePositionGainPercent(position);
              const isPositive = gain >= 0;

              return (
                <tr key={index} className="border-b border-zeterminal-border/50">
                  <td className="py-2 font-semibold">{position.symbol}</td>
                  <td className="text-right py-2">{position.shares}</td>
                  <td className="text-right py-2">${position.avgPrice.toFixed(2)}</td>
                  <td className="text-right py-2">${currentPrice.toFixed(2)}</td>
                  <td className="text-right py-2">${value.toFixed(2)}</td>
                  <td className={`text-right py-2 font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
                    {isPositive ? '+' : ''}${gain.toFixed(2)}
                  </td>
                  <td className={`text-right py-2 font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
                    {isPositive ? '+' : ''}{gainPercent.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

