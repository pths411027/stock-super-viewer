import { FugleQuote } from "./fugle/quote";

export type HotStockResponse = {
  symbol: string;
  name: string;
  referencePrice: number;
  lastPrice: number;
  total: number;
  change: number;
  changePercent: number;
};

export type StockQueryResponse = {
  symbol: string;
  industry: string;
  name: string;
  lastPrice: number;
};

export type StockQuotaResponse = FugleQuote;

export type StockCandlesRouteResponse = number[];

export type StockKLineCandle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type StockKLineRouteResponse = StockKLineCandle[];
