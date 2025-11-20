import axios from 'axios';
import { Quote, ChartDataPoint, NewsArticle, SearchResult } from './types';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const FINNHUB_KEY = process.env.FINNHUB_API_KEY || '';

export const getQuote = async (symbol: string): Promise<Quote | null> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: ALPHA_VANTAGE_KEY,
      },
    });
    return response.data['Global Quote'] || null;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
};

export const getIntradayData = async (symbol: string, interval: string = '5min'): Promise<ChartDataPoint[] | null> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol.toUpperCase(),
        interval: interval,
        apikey: ALPHA_VANTAGE_KEY,
      },
    });
    const timeSeries = response.data[`Time Series (${interval})`];
    if (!timeSeries) return null;
    
    return Object.entries(timeSeries).map(([time, data]: [string, any]) => ({
      time,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume']),
    })).reverse();
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    return null;
  }
};

export const getDailyData = async (symbol: string): Promise<ChartDataPoint[] | null> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        apikey: ALPHA_VANTAGE_KEY,
      },
    });
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) return null;
    
    return Object.entries(timeSeries).map(([date, data]: [string, any]) => ({
      date,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume']),
    })).reverse();
  } catch (error) {
    console.error('Error fetching daily data:', error);
    return null;
  }
};

export const getSearchResults = async (keywords: string): Promise<SearchResult[]> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: keywords,
        apikey: ALPHA_VANTAGE_KEY,
      },
    });
    return response.data.bestMatches || [];
  } catch (error) {
    console.error('Error searching symbols:', error);
    return [];
  }
};

export const getNews = async (symbol?: string): Promise<NewsArticle[]> => {
  try {
    if (NEWS_API_KEY) {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: symbol ? `${symbol} stock` : 'finance market',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: NEWS_API_KEY,
        },
      });
      return response.data.articles || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getYahooQuote = async (symbol: string): Promise<Quote | null> => {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}`);
    const result = response.data.chart.result[0];
    if (!result) return null;
    
    const meta = result.meta;
    const quote = result.indicators.quote[0];
    const latest = quote.close.length - 1;
    
    return {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      volume: meta.regularMarketVolume,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      open: meta.regularMarketOpen,
      previousClose: meta.previousClose,
    };
  } catch (error) {
    console.error('Error fetching Yahoo quote:', error);
    return null;
  }
};

export const getYahooChartData = async (symbol: string, interval: 'intraday' | 'daily' = 'daily'): Promise<ChartDataPoint[] | null> => {
  try {
    const period = interval === 'intraday' ? '1d' : '1mo';
    const range = interval === 'intraday' ? '1d' : '1mo';
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}`, {
      params: {
        interval: interval === 'intraday' ? '5m' : '1d',
        range: range,
      },
    });
    
    const result = response.data.chart.result[0];
    if (!result || !result.timestamp || !result.indicators) return null;
    
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    const closes = quotes.close;
    const opens = quotes.open;
    const highs = quotes.high;
    const lows = quotes.low;
    const volumes = quotes.volume;
    
    const data = timestamps.map((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000);
      return {
        time: date.toISOString(),
        date: date.toISOString().split('T')[0],
        open: opens[index] || 0,
        high: highs[index] || 0,
        low: lows[index] || 0,
        close: closes[index] || 0,
        volume: volumes[index] || 0,
      };
    }).filter((item: any) => item.close > 0);
    
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching Yahoo chart data:', error);
    return null;
  }
};

export const getMultipleQuotes = async (symbols: string[]): Promise<Quote[]> => {
  try {
    const promises = symbols.map(symbol => 
      Promise.race([
        getQuote(symbol),
        getYahooQuote(symbol),
      ])
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error fetching multiple quotes:', error);
    return [];
  }
};

