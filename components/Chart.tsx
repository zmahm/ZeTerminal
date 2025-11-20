'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getIntradayData, getDailyData } from '@/lib/api-client';
import { ChartDataPoint } from '@/lib/types';

interface ChartProps {
  symbol: string;
  interval?: 'intraday' | 'daily';
}

export default function Chart({ symbol, interval = 'intraday' }: ChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let chartData;
        if (interval === 'intraday') {
          chartData = await getIntradayData(symbol);
        } else {
          chartData = await getDailyData(symbol);
        }
        
        if (chartData && chartData.length > 0) {
          setData(chartData.slice(-100));
        } else {
          setError('No chart data available');
        }
      } catch (err) {
        setError('Failed to fetch chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const refreshInterval = setInterval(fetchData, 60000);

    return () => clearInterval(refreshInterval);
  }, [symbol, interval]);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="zeterminal-panel p-4 h-full flex items-center justify-center"
      >
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-zeterminal-textMuted"
        >
          Loading chart...
        </motion.div>
      </motion.div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="zeterminal-panel p-4 h-full flex items-center justify-center"
      >
        <div className="text-zeterminal-red">{error || 'No chart data available'}</div>
      </motion.div>
    );
  }

  const formatTime = (time: string) => {
    if (interval === 'intraday') {
      return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const latestPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[0]?.close || 0;
  const change = latestPrice - previousPrice;
  const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="zeterminal-panel p-4 h-full flex flex-col"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{symbol}</h3>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-right"
          >
            <motion.div 
              key={latestPrice}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold"
            >
              {latestPrice.toFixed(2)}
            </motion.div>
            <div className={`text-sm font-semibold ${isPositive ? 'price-up' : 'price-down'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-1 min-h-0"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorPrice-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#3fb950' : '#f85149'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? '#3fb950' : '#f85149'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis 
              dataKey={interval === 'intraday' ? 'time' : 'date'}
              tickFormatter={formatTime}
              stroke="#8b949e"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#8b949e"
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#161b22', 
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c9d1d9'
              }}
              labelFormatter={(label) => formatTime(label)}
              formatter={(value: number) => [value.toFixed(2), 'Price']}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={isPositive ? '#3fb950' : '#f85149'}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#colorPrice-${symbol})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

