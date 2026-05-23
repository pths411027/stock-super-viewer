import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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

  if (error) {
    return Response.json(
      { ok: false, error: error.message, code: error.code },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, data: data.map((stock) => stock.stock_id) });
}
