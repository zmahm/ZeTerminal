import { Quote, ChartDataPoint, NewsArticle, SearchResult } from './types';

export const getQuote = async (symbol: string): Promise<Quote | null> => {
  try {
    const response = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
};

export const getIntradayData = async (symbol: string): Promise<ChartDataPoint[] | null> => {
  try {
    const response = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}&interval=intraday`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error) {
        console.error('API Error:', errorData.error);
      }
      return null;
    }
    const data = await response.json();
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    return null;
  }
};

export const getDailyData = async (symbol: string): Promise<ChartDataPoint[] | null> => {
  try {
    const response = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}&interval=daily`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily data:', error);
    return null;
  }
};

export const getSearchResults = async (keywords: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(keywords)}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

export const getNews = async (symbol?: string): Promise<NewsArticle[]> => {
  try {
    const url = symbol 
      ? `/api/news?symbol=${encodeURIComponent(symbol)}`
      : '/api/news';
    const response = await fetch(url);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getMultipleQuotes = async (symbols: string[]): Promise<Quote[]> => {
  try {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols }),
    });
    
    if (!response.ok) {
      const promises = symbols.map(symbol => getQuote(symbol));
      const results = await Promise.all(promises);
      return results.filter(Boolean).map((quote: Quote, index) => ({
        ...quote,
        symbol: quote.symbol || quote['01. symbol'] || symbols[index],
      }));
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching multiple quotes:', error);
    return [];
  }
};

