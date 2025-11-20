import { NextRequest, NextResponse } from 'next/server';
import { getQuote, getYahooQuote } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    let quote = await getQuote(symbol);
    
    if (!quote) {
      quote = await getYahooQuote(symbol);
    }

    if (!quote) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

