import webpush, { type PushSubscription } from "web-push";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  process.env.WEB_PUSH_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.WEB_PUSH_PRIVATE_KEY!,
);

type SendPushBody = {
  subscription: PushSubscription;
  payload: {
    title: string;
    body: string;
    url?: string;
  };
};

export async function POST(req: Request) {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return Response.json(
      {
        error:
          "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
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

  const { data: myData } = await supabaseAdmin
    .from("push_subscriptions")
    .select("*");
  console.log(myData);

  try {
    // const { payload } = (await req.json()) as SendPushBody;
    // console.log(myData);
    const subscription = {
      endpoint: myData?.[0].endpoint,

      expirationTime: null,
      keys: {
        p256dh: myData?.[0].p256dh,
        auth: myData?.[0].auth,
      },
    };

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { ok: false, message: "Missing subscription" },
        { status: 400 },
      );
    }

    const data = await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "mock title",
        body: "mock body",
        url: "https://swag.live",
      }),
    );
    console.log("74", data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send push error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to send push" },
      { status: 500 },
    );
  }
}
