"use client";
import { StockCard } from "./_components/StockCard";
import { Header } from "./_components/Header";
import { useQuery } from "@tanstack/react-query";

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

  console.log(data);
  return (
    <main>
      <Header />
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-4 px-1">
          {data?.map(({ id, name, referencePrice, lastPrice }) => (
            <StockCard
              key={id}
              name={name}
              referencePrice={referencePrice}
              lastPrice={lastPrice}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
