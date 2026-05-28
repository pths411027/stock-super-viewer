"use client";
import { StockCard } from "../_components/StockCard";
import { Header } from "../_components/Header";
import { useQuery } from "@tanstack/react-query";
import { TargetTable } from "../_components/TargetTable";
import { MarketOverview } from "../_components/MarketOverview";

export default function Home() {
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
      }>;
    },
    refetchInterval: 60_000,
  });

  return (
    <main>
      <Header />
      <div className="px-2">
        <MarketOverview />
      </div>

      <div className="mt-4 px-2">
        <div className="grid grid-cols-1 gap-2">
          {data?.map(({ id, name, referencePrice, lastPrice }) => (
            <StockCard
              key={id}
              name={name}
              referencePrice={referencePrice}
              lastPrice={lastPrice}
            />
          ))}
        </div>
        <TargetTable />
      </div>
    </main>
  );
}
