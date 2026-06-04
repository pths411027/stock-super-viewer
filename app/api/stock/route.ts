import { NextRequest } from "next/server";
import { getStockQuote } from "@/lib/fugle/quote";
import { INDUSTRY_MAP } from "@/lib/const";
import { getStockTickers } from "@/lib/fugle/tickers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  const { data } = await getStockTickers();

  console.log("123", data);
  const items = await Promise.all(
    data
      .filter(
        (stock) =>
          stock.industry !== "00" &&
          (stock.symbol?.includes(q) || stock.name?.includes(q)),
      )
      .slice(0, 10)
      .map(async (stock) => {
        const { lastPrice } = await getStockQuote(stock.symbol);
        return {
          ...stock,
          lastPrice,
          industry: INDUSTRY_MAP.get(stock.industry) ?? "ETF",
        };
      }),
  );

  return Response.json({ data: items });
}
