import { NextRequest, NextResponse } from 'next/server';
import { getQuote, getYahooQuote } from '@/lib/api';
import { Quote } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { symbols } = await request.json();
    
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json({ error: 'Symbols array is required' }, { status: 400 });
    }

    const promises = symbols.map(async (symbol: string) => {
      let quote = await getQuote(symbol);
      if (!quote) {
        quote = await getYahooQuote(symbol);
      }
      return quote ? { ...quote, symbol: quote.symbol || quote['01. symbol'] || symbol } : null;
    });

    const results = await Promise.all(promises);
    const quotes = results.filter((quote): quote is Quote => quote !== null);

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching multiple quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

