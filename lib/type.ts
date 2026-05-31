export type FugleSnapshotActives = {
  data: Array<{
    type: string;
    symbol: string;
  }>;
};

export type Tickers = {
  symbol: string;
  name: string;
  industry: string;
};

export type QuoteLevel = {
  price: number;
  size: number;
};

export type QuoteTotal = {
  tradeValue: number;
  tradeVolume: number;
  tradeVolumeAtBid: number;
  tradeVolumeAtAsk: number;
  transaction: number;
  time: number;
};

export type LastTrade = {
  bid: number;
  ask: number;
  price: number;
  size: number;
  time: number;
  serial: number;
};

export type LastTrial = {
  bid: number;
  ask: number;
  price: number;
  size: number;
  time: number;
};

export type FugleQuoteResponse = {
  date: string;
  type: string;
  exchange: string;
  market: string;
  symbol: string;
  name: string;

  referencePrice: number;
  previousClose: number;

  openPrice: number;
  openTime: number;

  highPrice: number;
  highTime: number;

  lowPrice: number;
  lowTime: number;

  closePrice: number;
  closeTime: number;

  avgPrice: number;

  change: number;
  changePercent: number;
  amplitude: number;

  lastPrice: number;
  lastSize: number;

  bids: QuoteLevel[];
  asks: QuoteLevel[];

  total: QuoteTotal;

  lastTrade: LastTrade;

  lastTrial: LastTrial;

  isClose: boolean;

  serial: number;
  lastUpdated: number;
};
