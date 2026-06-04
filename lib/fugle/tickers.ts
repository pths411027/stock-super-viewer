import { createClient } from "@supabase/supabase-js";

const API_KEY = process.env.FUGLE_API_KEY;

export type Tickers = {
  symbol: string;
  name: string;
  industry: string;
};

export type FugleTickersResponse = {
  data: Tickers[];
};

export async function getStockTickers(): Promise<FugleTickersResponse> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("there is no key");
  }
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabaseAdmin.from("stocks").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return { data };
}
