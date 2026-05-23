"use client";

import { useQuery } from "@tanstack/react-query";

type HotStockResponse =
  | { ok: true; data: number[] }
  | { ok: false; error: string; code?: string };

async function fetchHotStocks(): Promise<number[]> {
  const res = await fetch("/api/hot-stock", { cache: "no-store" });
  const json = (await res.json().catch(() => null)) as HotStockResponse | null;

  if (!res.ok || !json || !json.ok) {
    throw new Error(json && "error" in json ? json.error : "Failed to load");
  }

  return json.data;
}

export function HotStocksClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["hot-stock"],
    queryFn: fetchHotStocks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>;
}
