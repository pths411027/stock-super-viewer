const API_KEY = process.env.FUGLE_API_KEY;

export type FugleActivesMarket = "TSE" | "OTC" | "ESB" | "TIB" | "PSB";

export type FugleActivesTrade = "volume" | "value";

export type FugleActivesType = "ALLBUT0999" | "COMMONSTOCK";

export type FugleActiveItem = {
  type: string;
  symbol: string;
  name: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  change: number;
  changePercent: number;
  tradeVolume: number;
  tradeValue: number;
  lastUpdated: number;
};

export type FugleActivesResponse = {
  date: string;
  time: string;
  market: FugleActivesMarket;
  trade: FugleActivesTrade;
  data: FugleActiveItem[];
};

export async function getSnapshot(
  revalidate = 60,
): Promise<FugleActivesResponse> {
  const res = await fetch(
    `https://api.fugle.tw/marketdata/v1.0/snapshot/actives/TSE?trade=volume&type=COMMONSTOCK`,
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
