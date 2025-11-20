# ZeTerminal Setup Guide

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure API keys (optional but recommended):
   
   Create a `.env.local` file in the root directory:
   ```env
   ALPHA_VANTAGE_API_KEY=your_key_here
   NEWS_API_KEY=your_key_here
   FINNHUB_API_KEY=your_key_here
   ```

   Free API keys:
   - Alpha Vantage: https://www.alphavantage.co/support/#api-key
     - Free tier: 5 calls/min, 500 calls/day
   - NewsAPI: https://newsapi.org/register
     - Free tier: 100 requests/day
   - Finnhub: https://finnhub.io/register
     - Free tier: 60 calls/min

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Features

**Core Features**
- Real-time market data and quotes
- Interactive charts (intraday and daily)
- Market ticker with scrolling prices
- Watchlist management
- Portfolio tracking with P&L
- Financial news feed
- Technical indicators (RSI, SMA, EMA)
- Order book visualization
- Symbol search
- Command interface
- Keyboard shortcuts

**Keyboard Shortcuts**
- `/` - Open command bar
- `ESC` - Close command bar

**Command Interface**
Type commands in the command bar (press `/`):
- `GO AAPL` - Navigate to Apple
- `NEWS MSFT` - View Microsoft news
- `CHART TSLA` - View Tesla chart
- `WATCH GOOGL` - Add Google to watchlist
- `PORTFOLIO` - Switch to portfolio view
- `INTRADAY` - Switch to intraday chart
- `DAILY` - Switch to daily chart
- Or type a symbol directly: `AAPL`

## API Rate Limits

**Alpha Vantage (Free Tier)**
- 5 API calls per minute
- 500 API calls per day
- The app uses caching and fallback to Yahoo Finance to minimize API calls

**Yahoo Finance**
- No API key required
- Used as fallback when Alpha Vantage rate limit is reached
- Public API, may have rate limits

**NewsAPI (Free Tier)**
- 100 requests per day
- News feed will show mock data if no API key is provided

## Troubleshooting

**No Data Showing**
1. Check browser console for errors
2. Verify API keys in `.env.local`
3. Check API rate limits haven't been exceeded
4. Try refreshing the page

**Charts Not Loading**
- Alpha Vantage free tier has limited intraday data
- Try switching to daily view
- Some symbols may not have available data

**News Not Loading**
- NewsAPI requires a valid API key
- Free tier is limited to 100 requests/day
- App will show mock data if API key is missing

## Customization

**Adding More Symbols to Default Watchlist**
Edit `app/page.tsx`:
```typescript
const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'YOUR_SYMBOL']);
```

**Adding Portfolio Positions**
Edit `app/page.tsx`:
```typescript
const [portfolioPositions, setPortfolioPositions] = useState<Position[]>([
  { symbol: 'AAPL', shares: 10, avgPrice: 150.00 },
  { symbol: 'MSFT', shares: 5, avgPrice: 300.00 },
]);
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Deploy to Vercel/Netlify:
   - Connect your GitHub repository
   - Add environment variables in the platform settings
   - Deploy automatically on push

## Notes

- This application is built with free APIs and has some limitations
- Real-time data updates are limited by API rate limits
- Some features (like real-time order book) are simulated
- For production use, consider upgrading to paid API tiers

## License

This project is for educational purposes.
