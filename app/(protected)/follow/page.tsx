"use client";

import { useState } from "react";
import Image from "next/image";

import { useDebounce } from "ahooks";
import { useQuery } from "@tanstack/react-query";

import SearchInput from "@/app/_components/SearchInput";
import { apiClient } from "@/lib/http";
import { Tickers } from "@/lib/type";
import { StockDrawer } from "@/app/_components/StockDrawer";

function StockCard({
  id,
  name,
  type,
  price,
  isSelected,
  onClick,
}: {
  id: string;
  name: string;
  type: string;
  price: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="mt-2 flex w-full items-center gap-2 rounded-md border p-3 py-2"
      style={{
        background: isSelected
          ? "rgba(232,184,74,0.18)"
          : "rgba(212,175,89,0.12)",
        borderColor: isSelected ? "#E8B84A" : "rgba(212,175,89,0.12)",
      }}
      onClick={onClick}
    >
      <div
        className="size-8 rounded-lg text-center text-xs leading-8 font-bold text-[#F5F1E6]"
        style={{ backgroundColor: "#D52B1E" }}
      >
        {id}
      </div>
      <div className="w-16 flex-1">
        <div className="font-bold text-[#F5F1E6]">{name}</div>
        <div className="text-xs text-[#8A857A]">
          {id} · {type}
        </div>
      </div>
      <div className="font-bold text-[#F5F1E6]">{price}</div>
      {isSelected && (
        <div className="rounded-full bg-[#E8B84A] p-0.5">
          {" "}
          <Image src={"/icons/tick.svg"} width={16} height={16} alt="tick" />
        </div>
      )}
    </div>
  );
}

export default function Follow() {
  const [q, setQ] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const debouncedQ = useDebounce(q, {
    wait: 500,
  });
  const { data } = useQuery({
    queryKey: ["stocks", debouncedQ],
    queryFn: async () => {
      const res = apiClient.get<
        Array<Tickers & { lastPrice: number; industry: string }>
      >("/api/stock", {
        params: { q: debouncedQ },
      });
      return res;
    },
    enabled: !!debouncedQ && debouncedQ !== "",
  });

  return (
    <div>
      <SearchInput
        q={q}
        setQ={(nextQ) => {
          setQ(nextQ);
          setSelectedIndex(-1);
        }}
      />
      <p className="text-sm text-[#E8B84A]">選擇股票</p>
      {data?.map(({ symbol, name, industry, lastPrice }, index) => (
        <StockCard
          key={symbol}
          id={symbol}
          name={name}
          price={lastPrice}
          type={industry}
          isSelected={index === selectedIndex}
          onClick={() => {
            setSelectedIndex(index);
            setOpen(true);
          }}
        />
      ))}
      <StockDrawer
        open={open}
        onOpenChange={setOpen}
        id={data?.[selectedIndex]?.symbol}
      />
    </div>
  );
}
