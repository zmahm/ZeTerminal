export interface Quote {
  symbol?: string;
  '01. symbol'?: string;
  '02. open'?: string;
  '03. high'?: string;
  '04. low'?: string;
  '05. price'?: string;
  '06. volume'?: string;
  '08. previous close'?: string;
  '09. change'?: string;
  '10. change percent'?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

export interface ChartDataPoint {
  time?: string;
  date?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source?: { name: string };
  urlToImage?: string;
}

export interface SearchResult {
  '1. symbol': string;
  '2. name': string;
  '4. region': string;
  '8. currency': string;
}

export interface Position {
  symbol: string;
  shares: number;
  avgPrice: number;
}

