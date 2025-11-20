'use client';

import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface CommandBarProps {
  onCommand: (command: string) => void;
  onClose: () => void;
}

export default function CommandBar({ onCommand, onClose }: CommandBarProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useHotkeys('escape', () => onClose(), { enableOnFormTags: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div className="bg-zeterminal-panel zeterminal-border rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-zeterminal-textMuted">Command:</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-1 bg-zeterminal-darker zeterminal-border rounded text-zeterminal-text focus:outline-none focus:ring-2 focus:ring-zeterminal-accent"
                placeholder="Type command (e.g., GO AAPL, NEWS MSFT, CHART TSLA)..."
              />
            </div>
            <div className="text-xs text-zeterminal-textMuted space-y-1">
              <div className="font-semibold mb-1">Available Commands:</div>
              <div>GO [SYMBOL] - Navigate to symbol</div>
              <div>NEWS [SYMBOL] - View news for symbol</div>
              <div>CHART [SYMBOL] - View chart for symbol</div>
              <div>WATCH [SYMBOL] - Add to watchlist</div>
              <div>PORTFOLIO - Switch to portfolio view</div>
              <div>INTRADAY - Switch to intraday chart</div>
              <div>DAILY - Switch to daily chart</div>
              <div className="mt-2">Or type a symbol directly (e.g., AAPL)</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

