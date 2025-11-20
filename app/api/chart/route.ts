import { NextRequest, NextResponse } from 'next/server';
import { getIntradayData, getDailyData, getYahooChartData } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval') || 'intraday';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    let data;
    if (interval === 'daily') {
      data = await getDailyData(symbol);
      if (!data || data.length === 0) {
        data = await getYahooChartData(symbol, 'daily');
      }
    } else {
      data = await getIntradayData(symbol, '5min');
      if (!data || data.length === 0) {
        data = await getYahooChartData(symbol, 'intraday');
      }
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No chart data available' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}

