import { fugleHandler } from "@/lib/fugle";
import { NextRequest } from "next/server";
import { FugleQuote } from "../hot-stock/route";
import { INDUSTRY_MAP } from "@/lib/const";
import { Tickers } from "@/lib/type";

// This route runs on-demand (not pre-rendered) since it reads request URL params.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  const { data } = await fugleHandler<{
    data: Array<Tickers>;
  }>(
    `/stock/intraday/tickers`,
    { type: "EQUITY", exchange: "TWSE", market: "TSE" },
    { revalidate: 60 * 60 * 24 },
  );

  const items = await Promise.all(
    data
      .filter(
        (stock) =>
          stock.industry !== "00" &&
          (stock.symbol?.includes(q) || stock.name?.includes(q)),
      )
      .slice(0, 10)
      .map(async (stock) => {
        const quote = await fugleHandler<FugleQuote>(
          `/stock/intraday/quote/${stock.symbol}`,
          undefined,
          { revalidate: 60 },
        );
        console.log(stock);
        return {
          ...stock,
          lastPrice: quote.lastPrice,
          industry: INDUSTRY_MAP.get(stock.industry) ?? "ETF",
        };
      }),
  );

  return Response.json({ data: items });
}
