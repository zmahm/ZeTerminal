# ZeTerminal

A financial terminal application built with Next.js and TypeScript. Provides market data, charts, news, and portfolio management using free financial APIs.

## Features

**Market Data**
- Real-time quotes and price updates
- Market ticker with major stock prices
- Market indices (S&P 500, NASDAQ, Dow Jones, VIX)

**Charts and Analysis**
- Interactive intraday and daily charts
- Technical indicators (RSI, SMA, EMA)
- Order book visualization

**Portfolio Management**
- Watchlist for tracking securities
- Portfolio tracking with P&L calculations
- Symbol search functionality

**News and Information**
- Financial news feed
- Command-based interface
- Keyboard shortcuts for quick navigation

**Interface**
- Dark theme with professional styling
- Multi-panel resizable layout
- Smooth animations and transitions

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Optional: API keys for enhanced functionality

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd btml
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory for API keys (optional):

```env
ALPHA_VANTAGE_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
FINNHUB_API_KEY=your_key_here
```

Free API keys are available from:
- Alpha Vantage: https://www.alphavantage.co/support/#api-key (5 calls/min, 500/day)
- NewsAPI: https://newsapi.org/register (100 requests/day)
- Finnhub: https://finnhub.io/register (60 calls/min)

### Running the Application

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

### Keyboard Shortcuts

- `/` - Open command bar
- `ESC` - Close command bar

### Commands

Press `/` to open the command interface. Available commands:

- `GO AAPL` - Navigate to a symbol
- `NEWS MSFT` - View news for a symbol
- `CHART TSLA` - View chart for a symbol
- `WATCH GOOGL` - Add symbol to watchlist
- `PORTFOLIO` - Switch to portfolio view
- `INTRADAY` - Switch to intraday chart view
- `DAILY` - Switch to daily chart view

You can also type a symbol directly (e.g., `AAPL`) to view it.

## Project Structure

```
btml/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Main page
├── components/        # React components
│   ├── Chart.tsx
│   ├── CommandBar.tsx
│   ├── MarketIndices.tsx
│   ├── MarketTicker.tsx
│   ├── NewsFeed.tsx
│   ├── OrderBook.tsx
│   ├── Portfolio.tsx
│   ├── QuotePanel.tsx
│   ├── SearchBar.tsx
│   ├── StatusBar.tsx
│   ├── TechnicalIndicators.tsx
│   └── Watchlist.tsx
├── lib/
│   ├── api.ts         # Server-side API functions
│   ├── api-client.ts  # Client-side API helpers
│   └── types.ts       # TypeScript type definitions
└── public/            # Static assets
```

## Technologies

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Recharts for charting
- Axios for HTTP requests
- Framer Motion for animations
- React Hotkeys Hook for keyboard shortcuts

## API Information

**Alpha Vantage**
- Free tier: 5 calls/minute, 500 calls/day
- Used for quotes, intraday data, daily data, and symbol search
- Falls back to Yahoo Finance when rate limited

**Yahoo Finance**
- No API key required
- Used as fallback for quotes and market data
- Public API endpoint

**NewsAPI**
- Free tier: 100 requests/day
- Used for financial news aggregation
- Shows mock data if API key is missing

## Rate Limits

The free tier APIs have rate limits that may affect functionality:
- Alpha Vantage: 5 calls/minute, 500/day
- NewsAPI: 100 requests/day
- Yahoo Finance: Public API with potential rate limits

The application implements fallback mechanisms to minimize API calls and handle rate limits gracefully.

## Troubleshooting

**No data showing**
- Check browser console for errors
- Verify API keys in `.env.local` are correct
- Check if API rate limits have been exceeded
- Refresh the page

**Charts not loading**
- Alpha Vantage free tier has limited intraday data
- Try switching to daily view
- Some symbols may not have available data

**News not loading**
- NewsAPI requires a valid API key
- Free tier is limited to 100 requests/day
- Application shows mock data if API key is missing

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## Deployment

The application can be deployed to any platform that supports Next.js:

**Vercel**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Other platforms**
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Limitations

This application uses free APIs and has the following limitations:
- Not truly real-time (limited by API rate limits)
- Some features are simulated (e.g., order book)
- Not suitable for actual trading decisions
- For production use, consider upgrading to paid API tiers

## License

This project is for educational purposes.

## Acknowledgments

- Alpha Vantage for free market data API
- Yahoo Finance for public market data
- NewsAPI for news aggregation
