// app/api/stock/candles/[id]/route.ts
import { fugleHandler } from "@/lib/fugle";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await fugleHandler<{ data: Array<{ average: number }> }>(
    `/stock/intraday/candles/${id}`,
    { timeframe: 1 },
    { revalidate: 60 },
  );

  return Response.json({
    ok: true,
    id,
    data: (data.data as [{ average: number }]).map((i) => i.average),
  });
}
