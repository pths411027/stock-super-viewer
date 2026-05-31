// app/api/stock/candles/[id]/route.ts
import { fugleHandler } from "@/lib/fugle";
import { FugleQuoteResponse } from "@/lib/type";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await fugleHandler<FugleQuoteResponse>(
    `/stock/intraday/quote/${id}`,
    { revalidate: 60 },
  );

  return Response.json({
    ok: true,
    data,
  });
}
