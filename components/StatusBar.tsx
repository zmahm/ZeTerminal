'use client';

import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-zeterminal-darker zeterminal-border border-t px-4 py-1 flex items-center justify-between text-xs text-zeterminal-textMuted">
      <div className="flex items-center gap-4">
        <span>Status: Connected</span>
        <span>•</span>
        <span>Data: Live</span>
      </div>
      <div className="flex items-center gap-4">
        {mounted && time ? (
          <>
            <span>{time.toLocaleTimeString()}</span>
            <span>•</span>
            <span>{time.toLocaleDateString()}</span>
          </>
        ) : (
          <>
            <span>--:--:--</span>
            <span>•</span>
            <span>--/--/----</span>
          </>
        )}
      </div>
    </div>
  );
}

