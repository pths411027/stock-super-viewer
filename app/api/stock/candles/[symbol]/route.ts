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
    ok: true,
    symbol,
    data: data.data.map((i) => i.average),
  });
}
