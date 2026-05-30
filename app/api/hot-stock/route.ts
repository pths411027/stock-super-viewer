import { fugleHandler } from "@/lib/fugle";
export const dynamic = "force-dynamic";

export type FugleQuote = {
  name: string;
  referencePrice: number;
  lastPrice: number;
  total: {
    tradeVolume: number;
  };
  change: number;
  changePercent: number;
};

export type FugleSnapshotActives = {
  data: Array<{
    type: string;
    symbol: string;
  }>;
};

async function GetMostPoppularStocks() {
  const data = await fugleHandler<FugleSnapshotActives>(
    `/snapshot/actives/TSE`,
    {
      trade: "volume",
      type: "COMMONSTOCK",
    },
  );

  return data;
}

async function GetStockPrice(stockID: string) {
  const data = await fugleHandler<FugleQuote>(
    `/stock/intraday/quote/${stockID}`,
    undefined,
    { revalidate: 60 },
  );

  return {
    id: stockID,
    name: data.name,
    referencePrice: data.referencePrice,
    lastPrice: data.lastPrice,
    total: data.total.tradeVolume,
    change: data.change,
    changePercent: data.changePercent,
  };
}

export async function GET() {
  const { data } = await GetMostPoppularStocks();
  let stockList = [];
  try {
    stockList = await Promise.all(
      data.slice(0, 10).map(({ symbol }) => GetStockPrice(symbol)),
    );
  } catch (e) {
    return { error: e };
  }

  return Response.json({ ok: true, data: stockList });
}
