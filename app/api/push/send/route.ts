import webpush from "web-push";
import { NextResponse } from "next/server";
import SupabaseInstance from "@/lib/supabase/instance";
import { FOLLOW_STOCKS, PUSH_SUBSCRIPTIONS } from "@/lib/supabase/const";
import { getStockQuote } from "@/lib/fugle/quote";

webpush.setVapidDetails(
  process.env.WEB_PUSH_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.WEB_PUSH_PRIVATE_KEY!,
);

type FollowStocks = {
  id: number;
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

export async function POST() {
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

  const sendResults = await Promise.allSettled(
    result.map(async (i) => {
      if (!i.subscription) {
        throw new Error(`Missing subscription for user ${i.user_id}`);
      }

      await webpush.sendNotification(
        i.subscription,
        JSON.stringify({
          title: "[股票通知]",
          body: `${i.name}已到 ${i.rule === "gt" ? "高於" : "低於"}達您的目標價格 ${i.price}`,
          url: `https://stockviewer.info/stock/${i.symbol}`,
        }),
      );

      return i.id;
    }),
  );

  const triggeredIds = sendResults
    .filter(
      (item): item is PromiseFulfilledResult<number> =>
        item.status === "fulfilled",
    )
    .map((item) => item.value);

  if (triggeredIds.length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from(FOLLOW_STOCKS)
      .update({ isTrigger: true })
      .in("id", triggeredIds);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    data: {
      triggeredIds,
      sendResults,
    },
  });
}
