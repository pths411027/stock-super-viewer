import { getStockQuote } from "@/lib/fugle/quote";
import { getSnapshot } from "@/lib/fugle/Snapshot";
import { getStockTickers } from "@/lib/fugle/tickers";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data } = await getSnapshot();

  try {
    const stockList = await Promise.all(
      data
        // .filter((stock) => stock. .industry !== "00")
        .slice(0, 10)
        .map(async ({ symbol }) => {
          const {
            name,
            referencePrice,
            lastPrice,
            total,
            change,
            changePercent,
          } = await getStockQuote(symbol);
          return {
            symbol,
            name,
            referencePrice,
            lastPrice,
            total: total?.tradeVolume,
            change: change,
            changePercent: changePercent,
          };
        }),
    );
    return Response.json({ ok: true, data: stockList });
  } catch (e) {
    return Response.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
