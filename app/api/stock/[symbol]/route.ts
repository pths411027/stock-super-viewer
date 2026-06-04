// app/api/stock/candles/[id]/route.ts
import { getStockQuote } from "@/lib/fugle/quote";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;

  const data = await getStockQuote(symbol);

  return Response.json({
    ok: true,
    data,
  });
}
