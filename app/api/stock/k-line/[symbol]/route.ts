import { getStockCandles } from "@/lib/fugle/candles";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;
  const data = await getStockCandles(symbol);

  return Response.json({
    data: data.data.map((item) => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    })),
  });
}
