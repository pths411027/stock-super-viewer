"use client";
import { cn } from "@/lib/utils";
import { PriceLineChart } from "./PriceLineChart";
import { useQuery } from "@tanstack/react-query";

const PALETTE = [
  "#D52B1E",
  "#0046A8",
  "#0A6E34",
  "#005EA8",
  "#E8B84A",
  "#9D3F8C",
] as const;

function hashToIndex6(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h % 6;
}

export function colorForId(id: string) {
  return PALETTE[hashToIndex6(id)];
}

export function TargetTable() {
  const { data } = useQuery({
    queryKey: ["hot-stock"],
    queryFn: async () => {
      const res = await fetch("/api/hot-stock", { cache: "no-store" });
      const json = await res.json();
      return json.data as Array<{
        id: string;
        name: string;
        referencePrice: number;
        lastPrice: number;
        total: number;
        change: number;
        changePercent: number;
      }>;
    },
    refetchInterval: 60_000,
  });

  console.log(data);
  return (
    <div className="relative mt-2 h-100 w-full overflow-scroll rounded-2xl">
      <div className="sticky top-0 z-2 flex w-full bg-[#0e0d0b] px-2 py-1 text-sm text-[#5A564E]">
        {["股名", "24h走勢", "最新價格", "漲跌"].map((i, index) => (
          <div
            key={i}
            className={cn(
              index === 0 && "w-24 flex-1 pl-12",
              index === 1 && "w-15 text-center",
              index === 2 && "w-24 px-2",
              index === 3 && "w-15 text-center",
            )}
          >
            {i}
          </div>
        ))}
      </div>
      {data?.map((i) => (
        <div key={i.id} className={cn("z-1 flex w-full items-center p-1 px-2")}>
          <div className="flex flex-1">
            <div
              className="text-cream size-8 rounded-sm text-center text-xs leading-8 font-bold"
              style={{ backgroundColor: colorForId(i.id) }}
            >
              {i.id}
            </div>
            <div className="w-16 flex-1 pl-3">
              <div className="text-cream font-bold">{i.id}</div>
              <div className="text-xs text-[#5A564E]">{i.name}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <PriceLineChart id={i.id} change={i.change} />
          </div>
          <div className="w-24 px-2 font-bold">
            <div
              className={cn(
                "text-down font-bold",
                i.change >= 0 ? "text-down" : "text-up",
              )}
            >
              {i.lastPrice}
            </div>
            <div className="text-xs text-[#5A564E]">{`成交${i.total}張`}</div>
          </div>
          <div className="w-15">
            <div
              className={cn(
                "rounded-sm p-1 text-center text-sm font-bold",
                i.change >= 0 ? "bg-down" : "bg-up",
              )}
            >
              {`${i.changePercent}%`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
