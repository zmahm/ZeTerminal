'use client';

import { useEffect, useState } from 'react';
import { getDailyData } from '@/lib/api-client';
import { ChartDataPoint } from '@/lib/types';

interface TechnicalIndicatorsProps {
  symbol: string;
}

export default function TechnicalIndicators({ symbol }: TechnicalIndicatorsProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      try {
        const dailyData = await getDailyData(symbol, abortController.signal);
        if (!abortController.signal.aborted && dailyData && dailyData.length > 0) {
          setData(dailyData.slice(-20));
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching technical data:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      abortController.abort();
    };
  }, [symbol]);

  const calculateSMA = (period: number) => {
    if (data.length < period) return null;
    const closes = data.slice(-period).map(d => d.close);
    return closes.reduce((a, b) => a + b, 0) / period;
  };

  const calculateEMA = (period: number) => {
    if (data.length < period) return null;
    const multiplier = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((sum, d) => sum + d.close, 0) / period;
    
    for (let i = period; i < data.length; i++) {
      ema = (data[i].close - ema) * multiplier + ema;
    }
    return ema;
  };

  const calculateRSI = () => {
    if (data.length < 14) return null;
    const changes = [];
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i].close - data[i - 1].close);
    }
    
    const gains = changes.filter(c => c > 0);
    const losses = changes.filter(c => c < 0).map(c => Math.abs(c));
    
    const avgGain = gains.reduce((a, b) => a + b, 0) / 14;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / 14;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const sma20 = calculateSMA(20);
  const sma50 = calculateSMA(50);
  const ema12 = calculateEMA(12);
  const rsi = calculateRSI();

  if (isLoading) {
    return (
      <div className="zeterminal-panel p-4">
        <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
        <div className="text-zeterminal-textMuted">Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="zeterminal-panel p-4">
        <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
        <div className="text-zeterminal-textMuted">No data available</div>
      </div>
    );
  }

  const currentPrice = data[data.length - 1]?.close || 0;

  return (
    <div className="zeterminal-panel p-4">
      <h3 className="text-lg font-semibold mb-4">Technical Indicators - {symbol}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-zeterminal-textMuted mb-1">Current Price</div>
          <div className="font-semibold text-lg">{currentPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-zeterminal-textMuted mb-1">RSI (14)</div>
          <div className={`font-semibold ${
            rsi && rsi > 70 ? 'price-down' : rsi && rsi < 30 ? 'price-up' : ''
          }`}>
            {rsi ? rsi.toFixed(2) : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-zeterminal-textMuted mb-1">SMA (20)</div>
          <div className="font-semibold">{sma20 ? sma20.toFixed(2) : 'N/A'}</div>
        </div>
        <div>
          <div className="text-zeterminal-textMuted mb-1">SMA (50)</div>
          <div className="font-semibold">{sma50 ? sma50.toFixed(2) : 'N/A'}</div>
        </div>
        <div>
          <div className="text-zeterminal-textMuted mb-1">EMA (12)</div>
          <div className="font-semibold">{ema12 ? ema12.toFixed(2) : 'N/A'}</div>
        </div>
        <div>
          <div className="text-zeterminal-textMuted mb-1">Signal</div>
          <div className={`font-semibold ${
            rsi && rsi > 70 ? 'price-down' : rsi && rsi < 30 ? 'price-up' : 'text-zeterminal-textMuted'
          }`}>
            {rsi && rsi > 70 ? 'Overbought' : rsi && rsi < 30 ? 'Oversold' : 'Neutral'}
          </div>
        </div>
      </div>
    </div>
  );
}

