"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { PriceLineChart } from "./PriceLineChart";

export function TargetTable() {
  const [activeIndex, setActiveIndex] = useState(0);

  // console.log(activeIndex);
  return (
    <div className="relative mt-2 h-100 w-full overflow-scroll rounded-2xl">
      <div className="sticky top-0 z-2 flex w-full bg-[#0e0d0b] px-2 py-1 text-sm text-[#5A564E]">
        {["股名", "24h走勢", "最新價格", "漲跌"].map((i, index) => (
          <div
            key={i}
            className={cn(
              index === 0 && "w-24 pr-4 text-end",
              index === 1 && "w-20 text-center",
              index === 2 && "w-24",
              index === 3 && "text-center",
            )}
          >
            {i}
          </div>
        ))}
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i, index) => (
        <div
          key={i}
          className={cn(
            "z-1 flex w-full items-center p-1 px-2",
            index === activeIndex && "bg-[rgba(59,203,142,.12)]",
          )}
        >
          <div className="size-8 rounded-sm bg-[#D52B1E] text-center text-xs leading-8 font-bold text-[#F5F1E6]">
            2330
          </div>
          <div className="w-16 flex-1 px-3">
            <div className="font-bold text-[#F5F1E6]">3481</div>
            <div className="text-xs text-[#5A564E]">群創</div>
          </div>

          {/* <div className="flex-1"></div> */}
          <PriceLineChart />
          <div className="w-24 px-3 font-bold">
            <div className="font-bold text-[#3BCB8E]">2330.5</div>
            <div className="text-xs text-[#5A564E]">成交1500張</div>
          </div>
          <div className="w-15">
            <div className="rounded-sm bg-[#3BCB8E] p-1 text-center text-sm font-bold">
              +3.2%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
