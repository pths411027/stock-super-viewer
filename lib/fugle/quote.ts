const API_KEY = process.env.FUGLE_API_KEY;

export type FugleQuote = {
  date: string;
  type: string;
  exchange: string;
  market: string;

  symbol: string;
  name: string;

  referencePrice?: number;
  previousClose?: number;

  openPrice?: number;
  openTime?: number;

  highPrice?: number;
  highTime?: number;

  lowPrice?: number;
  lowTime?: number;

  closePrice?: number;
  closeTime?: number;

  avgPrice?: number;

  change?: number;
  changePercent?: number;
  amplitude?: number;

  lastPrice?: number;
  lastSize?: number;

  bids?: {
    price: number;
    size: number;
  }[];

  asks?: {
    price: number;
    size: number;
  }[];

  total?: {
    tradeValue?: number;
    tradeVolume?: number;
    tradeVolumeAtBid?: number;
    tradeVolumeAtAsk?: number;
    transaction?: number;
    time?: number;
  };

  lastTrade?: {
    bid?: number;
    ask?: number;
    price?: number;
    size?: number;
    time?: number;
    serial?: number;
  };

  lastTrial?: {
    bid?: number;
    ask?: number;
    price?: number;
    size?: number;
    time?: number;
    serial?: number;
  };

  isClose?: boolean;

  serial?: number;
  lastUpdated?: number;
};

export async function getStockQuote(
  symbol: string,
  revalidate = 60,
): Promise<FugleQuote> {
  const res = await fetch(
    `https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/${symbol}`,
    {
      headers: {
        "X-API-KEY": API_KEY!,
      },
      next: {
        revalidate,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Fugle API Error: ${res.status}`);
  }

  return res.json();
}
