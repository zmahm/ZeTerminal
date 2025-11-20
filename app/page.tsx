'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketTicker from '@/components/MarketTicker';
import MarketIndices from '@/components/MarketIndices';
import QuotePanel from '@/components/QuotePanel';
import Chart from '@/components/Chart';
import NewsFeed from '@/components/NewsFeed';
import Watchlist from '@/components/Watchlist';
import Portfolio from '@/components/Portfolio';
import TechnicalIndicators from '@/components/TechnicalIndicators';
import OrderBook from '@/components/OrderBook';
import StatusBar from '@/components/StatusBar';
import SearchBar from '@/components/SearchBar';
import CommandBar from '@/components/CommandBar';
import { useHotkeys } from 'react-hotkeys-hook';
import { Position } from '@/lib/types';

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'TSLA']);
  const [portfolioPositions, setPortfolioPositions] = useState<Position[]>([
    { symbol: 'AAPL', shares: 10, avgPrice: 150.00 },
    { symbol: 'MSFT', shares: 5, avgPrice: 300.00 },
  ]);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [chartInterval, setChartInterval] = useState<'intraday' | 'daily'>('intraday');
  const [leftPanelView, setLeftPanelView] = useState<'watchlist' | 'portfolio'>('watchlist');
  const [rightPanelView, setRightPanelView] = useState<'quote' | 'technical' | 'orderbook'>('quote');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useHotkeys('/', (e) => {
    e.preventDefault();
    setShowCommandBar(true);
  });

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCommand = (command: string) => {
    const parts = command.toUpperCase().split(' ');
    const cmd = parts[0];
    const symbol = parts[1];

    switch (cmd) {
      case 'GO':
        if (symbol) setSelectedSymbol(symbol);
        break;
      case 'NEWS':
        if (symbol) setSelectedSymbol(symbol);
        break;
      case 'CHART':
        if (symbol) setSelectedSymbol(symbol);
        break;
      case 'WATCH':
        if (symbol && !watchlistSymbols.includes(symbol)) {
          setWatchlistSymbols([...watchlistSymbols, symbol]);
        }
        break;
      case 'PORTFOLIO':
        setLeftPanelView('portfolio');
        break;
      case 'INTRADAY':
        setChartInterval('intraday');
        break;
      case 'DAILY':
        setChartInterval('daily');
        break;
      default:
        if (parts.length === 1 && parts[0].length <= 5) {
          // Assume it's a symbol
          setSelectedSymbol(parts[0]);
        }
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlistSymbols(watchlistSymbols.filter(s => s !== symbol));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-zeterminal-dark"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-zeterminal-darker zeterminal-border border-b px-4 py-2 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-zeterminal-text">ZETERMINAL</h1>
            <div className="text-xs text-zeterminal-textMuted">
            Press / for commands{mounted && currentTime ? ` | ${currentTime}` : ''}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <SearchBar onSymbolSelect={handleSymbolSelect} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartInterval('intraday')}
              className={`zeterminal-button text-xs ${chartInterval === 'intraday' ? 'bg-zeterminal-accent' : ''}`}
            >
              Intraday
            </button>
            <button
              onClick={() => setChartInterval('daily')}
              className={`zeterminal-button text-xs ${chartInterval === 'daily' ? 'bg-zeterminal-accent' : ''}`}
            >
              Daily
            </button>
          </div>
        </div>
      </motion.header>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Market Indices */}
      <div className="px-2">
        <MarketIndices />
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 grid grid-cols-12 grid-rows-6 gap-2 p-2 overflow-hidden"
      >
        {/* Left Column - Watchlist/Portfolio */}
        <div className="col-span-2 row-span-6 flex flex-col">
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setLeftPanelView('watchlist')}
              className={`flex-1 zeterminal-button text-xs ${leftPanelView === 'watchlist' ? 'bg-zeterminal-accent' : ''}`}
            >
              Watchlist
            </button>
            <button
              onClick={() => setLeftPanelView('portfolio')}
              className={`flex-1 zeterminal-button text-xs ${leftPanelView === 'portfolio' ? 'bg-zeterminal-accent' : ''}`}
            >
              Portfolio
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {leftPanelView === 'watchlist' ? (
              <Watchlist 
                symbols={watchlistSymbols} 
                onSymbolSelect={handleSymbolSelect}
              />
            ) : (
              <Portfolio 
                positions={portfolioPositions}
                onRemovePosition={(symbol) => {
                  setPortfolioPositions(portfolioPositions.filter(p => p.symbol !== symbol));
                }}
              />
            )}
          </div>
        </div>

        {/* Center Column - Chart */}
        <div className="col-span-7 row-span-4">
          <Chart symbol={selectedSymbol} interval={chartInterval} />
        </div>

        {/* Right Column - Quote/Technical/OrderBook */}
        <div className="col-span-3 row-span-4 flex flex-col">
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setRightPanelView('quote')}
              className={`flex-1 zeterminal-button text-xs ${rightPanelView === 'quote' ? 'bg-zeterminal-accent' : ''}`}
            >
              Quote
            </button>
            <button
              onClick={() => setRightPanelView('technical')}
              className={`flex-1 zeterminal-button text-xs ${rightPanelView === 'technical' ? 'bg-zeterminal-accent' : ''}`}
            >
              Technical
            </button>
            <button
              onClick={() => setRightPanelView('orderbook')}
              className={`flex-1 zeterminal-button text-xs ${rightPanelView === 'orderbook' ? 'bg-zeterminal-accent' : ''}`}
            >
              Order Book
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {rightPanelView === 'quote' && <QuotePanel symbol={selectedSymbol} />}
            {rightPanelView === 'technical' && <TechnicalIndicators symbol={selectedSymbol} />}
            {rightPanelView === 'orderbook' && <OrderBook symbol={selectedSymbol} />}
          </div>
        </div>

        {/* Bottom Left - News Feed */}
        <div className="col-span-7 row-span-2">
          <NewsFeed symbol={selectedSymbol} />
        </div>

        {/* Bottom Right - Additional Info */}
        <div className="col-span-3 row-span-2 zeterminal-panel p-4">
          <h3 className="text-lg font-semibold mb-4">Market Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-zeterminal-textMuted">Selected Symbol</div>
              <div className="font-semibold">{selectedSymbol}</div>
            </div>
            <div>
              <div className="text-zeterminal-textMuted">Chart Interval</div>
              <div className="font-semibold">{chartInterval === 'intraday' ? '5 Min' : 'Daily'}</div>
            </div>
            <div>
              <div className="text-zeterminal-textMuted">Watchlist Count</div>
              <div className="font-semibold">{watchlistSymbols.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Bar */}
      <StatusBar />

      {/* Command Bar */}
      {showCommandBar && (
        <CommandBar
          onCommand={handleCommand}
          onClose={() => setShowCommandBar(false)}
        />
      )}
    </motion.div>
  );
}

