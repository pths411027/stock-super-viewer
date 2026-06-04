import { NextRequest } from "next/server";
import { INDUSTRY_MAP } from "@/lib/const";
import { getStockTickers } from "@/lib/fugle/tickers";
import { getStockQuote } from "@/lib/fugle/quote";
import { createClient } from "@supabase/supabase-js";

// This route runs on-demand (not pre-rendered) since it reads request URL params.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  const { data } = await getStockTickers();

  const items = await Promise.all(
    data
      .filter(
        (stock) =>
          stock.industry !== "00" &&
          (!q || stock.symbol?.includes(q) || stock.name?.includes(q)),
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

export async function POST() {
  const { data: stocks } = await getStockTickers();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return Response.json(
      {
        ok: false,
        error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY",
      },
      { status: 500 },
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error: deleteError } = await supabaseAdmin
    .from("stocks")
    .delete()
    .not("symbol", "is", null);

  if (deleteError) {
    return Response.json(
      {
        ok: false,
        error: deleteError.message,
      },
      { status: 500 },
    );
  }

  const { error: createError } = await supabaseAdmin
    .from("stocks")
    .insert(stocks.filter(({ industry }) => industry !== "00"))
    .select();

  if (createError) {
    return Response.json(
      {
        ok: false,
        error: createError.message,
      },
      { status: 500 },
    );
  }
  return Response.json({ ok: true });
}
