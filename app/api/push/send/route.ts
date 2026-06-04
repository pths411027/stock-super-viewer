import webpush, { type PushSubscription } from "web-push";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import SupabaseInstance from "@/lib/supabase/instance";
import { FOLLOW_STOCKS, PUSH_SUBSCRIPTIONS } from "@/lib/supabase/const";
import { getStockQuote } from "@/lib/fugle/quote";

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

type FollowStocks = {
  user_id: string;
  symbol: string;
  price: number;
  rule: "gt" | "lt";
  percent: number | null;
  isTrigger: boolean;
};

type Subscriptions = {
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string;
};

export async function POST(req: Request) {
  const supabaseAdmin = SupabaseInstance();

  const { data: follow_stocks } = await supabaseAdmin
    .from(FOLLOW_STOCKS)
    .select("*");

  const { data: subscriptions } = await supabaseAdmin
    .from(PUSH_SUBSCRIPTIONS)
    .select("*");

  const subscriptionHashMap = new Map();

  (subscriptions as Array<Subscriptions>)?.forEach((i) => {
    subscriptionHashMap.set(i.user_id, {
      endpoint: i.endpoint,
      expirationTime: null,
      keys: {
        p256dh: i.p256dh,
        auth: i.auth,
      },
    });
  });

  const result: Array<
    FollowStocks & {
      name: string;
      change: number;
      changePercent: number;
      lastPrice: number;
      subscription: {
        endpoint: string;
        expirationTime: number | null;
        keys: {
          p256dh: string;
          auth: string;
        };
      };
    }
  > = [];

  for (const stock of follow_stocks as Array<FollowStocks>) {
    if (stock.isTrigger) continue;

    const { name, lastPrice, change, changePercent } = await getStockQuote(
      stock.symbol,
    );

    if (stock.rule === "gt" && lastPrice && lastPrice >= stock.price) {
      result.push({
        ...stock,
        name,
        change: change ?? 0,
        changePercent: changePercent ?? 0,
        lastPrice: lastPrice ?? 0,
        subscription: subscriptionHashMap.get(stock.user_id) ?? null,
      });
    }

    if (stock.rule === "lt" && lastPrice && lastPrice <= stock.price) {
      result.push({
        ...stock,
        name,
        change: change ?? 0,
        changePercent: changePercent ?? 0,
        lastPrice: lastPrice ?? 0,
        subscription: subscriptionHashMap.get(stock.user_id) ?? null,
      });
    }
  }

  const sendResult = await Promise.all(
    result.map(async (i) => {
      await webpush.sendNotification(
        i.subscription,
        JSON.stringify({
          title: "[股票通知]",
          body: `${i.name}已到 ${i.rule === "gt" ? "高於" : "低於"}達您的目標價格 ${i.price}`,
          url: `https://stockviewer.info/stock/${i.symbol}`,
        }),
      );
    }),
  );

  return NextResponse.json({ ok: true, data: sendResult });
}
