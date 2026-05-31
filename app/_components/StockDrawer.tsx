"use client";
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  // DrawerDescription,
  DrawerFooter,
  // DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { apiClient } from "@/lib/http";
import { FugleQuoteResponse } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

function Content() {
  const [value, setValue] = useState(1200);
  return (
    <div className="mx-auto mt-2 w-full max-w-sm">
      <div className="h-16 w-full overflow-hidden rounded-md border border-[rgba(212,175,89,0.12)] bg-[#1F1D16] p-2">
        <div className="flex h-full items-center justify-around">
          <div className="flex-1 pl-2">
            <p className="mb-1/2 text-xs text-[#F5F1E6]">現價</p>
            <div className="mr-1/2 text-lg font-bold text-[#F5F1E6]">95831</div>
          </div>
          <div className="h-[80%] w-0.5 bg-[rgba(212,175,89,0.12)]"></div>
          <div className="flex-1 px-2">
            <p className="mb-1/2 text-xs text-[#F5F1E6]">差距</p>
            <div>
              <span className="mr-1/2 text-up text-lg font-bold">
                +120 (2.4%)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <p className="text-sm text-[#E8B84A]">選擇股票</p>
        <div
          className="rounded-md p-1"
          style={{ background: "rgba(232,184,74,0.18)" }}
        >
          <div className="bg-background rounded-md">
            <div
              className="flex items-center justify-between gap-2 rounded-md border border-[#E8B84A] p-3 py-2"
              style={{
                background: "rgba(232,184,74,0.12)",

                borderColor: "#E8B84A", // : "rgba(212,175,89,0.12)",
              }}
              // onClick={onClick}
            >
              <button
                className="size-8 rounded-sm bg-[#1F1D16] text-center leading-8 font-bold text-[#E8B84A]"
                style={{ background: "rgba(212,175,89,0.12)" }}
                onClick={() => setValue((prev) => Math.max(0, prev - 1))}
                disabled={value <= 0}
              >
                <Image
                  src={"/icons/minus.svg"}
                  width={24}
                  height={24}
                  alt="search"
                  className="fill-[#8A857A]"
                />
              </button>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="[appearance:textfield] text-center text-[#E8B84A] outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="請輸入股票代號或名稱"
              />
              <button
                className="size-8 rounded-sm bg-[#1F1D16] text-center leading-8 font-bold text-[#E8B84A]"
                style={{ background: "rgba(212,175,89,0.12)" }}
                onClick={() => setValue((prev) => Math.max(0, prev + 1))}
              >
                <Image
                  src={"/icons/plus.svg"}
                  width={24}
                  height={24}
                  alt="search"
                  className="fill-[#8A857A]"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {[-10, -5, 0, 5, 10].map((percent) => (
            <div
              key={percent}
              className={cn(
                "w-full overflow-hidden rounded-md border border-[rgba(212,175,89,0.12)] bg-[#1F1D16] p-2 py-3 text-center font-bold",
                percent > 0 && "text-up",
                percent === 0 && "text-[#F5F1E6]",
                percent < 0 && "text-down",
              )}
            >
              {percent}%
            </div>
          ))}
        </div>

        <div className="flex h-20">
          <div className="p-2">
            <div className="bg-background border-up size-4 overflow-hidden rounded-full border-6"></div>
            <div className="text-up">
              股價漲到
              <Image
                src={"/icons/up.svg"}
                width={24}
                height={24}
                alt="search"
                className="text-[#8A857A]"
              />
            </div>
          </div>
        </div>
        <DrawerFooter></DrawerFooter>
      </div>
    </div>
  );
}

export function StockDrawer({
  id,
  open,
  onOpenChange,
  title = "Move Goal",
  description = "Set your daily activity goal.",
}: {
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
}) {
  const { data } = useQuery({
    queryKey: ["stock", id],
    queryFn: async () => {
      const res = apiClient.get<FugleQuoteResponse>(`/api/stock/${id}`);
      return res;
    },
    enabled: !!id,
  });

  console.log(data);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      modal={true}
      noBodyStyles
      shouldScaleBackground={false}
    >
      <DrawerTitle className="hidden">Title</DrawerTitle>
      <DrawerContent className="bg-background">
        <Content />
      </DrawerContent>
    </Drawer>
  );
}
