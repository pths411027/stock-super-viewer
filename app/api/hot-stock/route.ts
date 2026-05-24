import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

async function GetStockPrice(stockID: string) {
  const url = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/${stockID}`;
  const FUGLE_API_KEY = process.env.FUGLE_API_KEY as string;
  const options = {
    method: "get",
    headers: {
      "X-API-KEY": FUGLE_API_KEY,
    },
    muteHttpExceptions: true,
  };

  const response = await fetch(url, options);

  const data = await response.json();

  return {
    id: stockID,
    name: data.name,
    referencePrice: data.referencePrice,
    lastPrice: data.lastPrice,
  };
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return Response.json(
      { ok: false, error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.from("hot_stock").select("*");

  const stockList = await Promise.all(
    (data as { stock_id: string }[]).map((row) =>
      GetStockPrice(String(row.stock_id)),
    ),
  );

  console.log(stockList);

  if (error) {
    return Response.json(
      { ok: false, error: error.message, code: error.code },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, data: stockList });
}
