// app/api/stock/candles/[id]/route.ts
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function getStockCandles(stockId: string) {
  const fugleApiKey = process.env.FUGLE_API_KEY;
  if (!fugleApiKey) {
    return { ok: false as const, status: 500, error: "Missing FUGLE_API_KEY" };
  }

  const url = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${encodeURIComponent(
    stockId,
  )}?timeframe=30`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "X-API-KEY": fugleApiKey },
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    return {
      ok: false as const,
      status: 502,
      error: text || `Upstream error: ${response.status}`,
    };
  }

  try {
    return { ok: true as const, data: JSON.parse(text) };
  } catch {
    return { ok: false as const, status: 502, error: "Invalid upstream JSON" };
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await getStockCandles(id);

  if (!result.ok) {
    return Response.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return Response.json({
    ok: true,
    id,
    data: (result.data.data as [{ average: number }]).map((i) => i.average),
  });
}
