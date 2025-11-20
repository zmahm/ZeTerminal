'use client';

interface OrderBookProps {
  symbol: string;
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const bids = [
    { price: 150.25, size: 1000 },
    { price: 150.24, size: 500 },
    { price: 150.23, size: 750 },
    { price: 150.22, size: 300 },
    { price: 150.21, size: 1200 },
  ];

  const asks = [
    { price: 150.26, size: 800 },
    { price: 150.27, size: 600 },
    { price: 150.28, size: 900 },
    { price: 150.29, size: 400 },
    { price: 150.30, size: 1100 },
  ];

  return (
    <div className="zeterminal-panel p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Order Book - {symbol}</h3>
      <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-zeterminal-textMuted font-semibold mb-2 text-xs">BIDS</div>
          <div className="space-y-1">
            {bids.map((bid, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="price-up font-semibold">{bid.price.toFixed(2)}</span>
                <span className="text-zeterminal-textMuted">{bid.size.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-zeterminal-textMuted font-semibold mb-2 text-xs">ASKS</div>
          <div className="space-y-1">
            {asks.map((ask, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="price-down font-semibold">{ask.price.toFixed(2)}</span>
                <span className="text-zeterminal-textMuted">{ask.size.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-zeterminal-border text-xs text-zeterminal-textMuted">
        Simulated data
      </div>
    </div>
  );
}

