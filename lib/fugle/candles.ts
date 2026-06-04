const API_KEY = process.env.FUGLE_API_KEY;

export type FugleIntradayCandle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  average: number;
};

export type FugleIntradayCandlesResponse = {
  date: string;
  type: string;
  exchange: string;
  market?: string;
  symbol: string;
  timeframe: string;
  data: FugleIntradayCandle[];
};
export async function getStockCandles(
  symbol: string,
  revalidate = 60,
): Promise<FugleIntradayCandlesResponse> {
  const res = await fetch(
    // exchange: "TWSE", market: "TSE"
    `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${symbol}`,
    {
      headers: {
        "X-API-KEY": API_KEY!,
      },
      next: {
        revalidate,
      },
    },
  );
  console.log(res);
  if (!res.ok) {
    throw new Error(`Fugle API Error: ${res.status}`);
  }
  return res.json();
}
