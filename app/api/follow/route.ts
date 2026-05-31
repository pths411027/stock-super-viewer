import { createSupabaseServerClient } from "@/lib/supabase/server";

type CreateFollowPayload = {
  symbol?: string;
  price?: number;
  rule?: string;
  percent?: number;
  isTrigger?: boolean;
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(session);

  console.log("authError", authError);
  console.log("user", user);

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateFollowPayload;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const symbol = body.symbol?.trim();
  const price =
    typeof body.price === "number" && Number.isFinite(body.price)
      ? body.price
      : null;
  const rule = body.rule?.trim();
  const percent =
    typeof body.percent === "number" && Number.isFinite(body.percent)
      ? body.percent
      : null;
  const isTrigger = body.isTrigger ?? false;

  if (!symbol) {
    return Response.json({ error: "symbol is required" }, { status: 400 });
  }

  if (!rule) {
    return Response.json({ error: "rule is required" }, { status: 400 });
  }

  if (typeof isTrigger !== "boolean") {
    return Response.json(
      { error: "isTrigger must be a boolean" },
      { status: 400 },
    );
  }

  console.log(user?.id);

  const { data, error } = await supabase
    .from("follow_stock")
    .insert({
      symbol,
      price,
      rule,
      percent,
      isTrigger,
    })
    .select();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
