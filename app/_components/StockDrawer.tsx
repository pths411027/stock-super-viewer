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
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";

function Content() {
  const [value, setValue] = useState(1200);
  const [rule, setRule] = useState("gt");

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: "2330",
          price: value,
          rule,
          percent: null,
          isTrigger: false,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error ?? "建立關注失敗");
      }

      return res.json();
    },
    // onSuccess: (data) => {
    //   console.log("建立成功", data);
    // },
    // onError: (error) => {
    //   console.error("建立失敗", error);
    // },
  });
  return (
    <div className="mx-auto mt-2 w-full max-w-sm">
      <div className="h-16 w-full overflow-hidden rounded-md border border-[rgba(212,175,89,0.12)] bg-[#1F1D16] p-2">
        <div className="flex h-full items-center justify-around">
          <div className="flex-1 pl-2">
            <p className="mb-1/2 text-cream text-xs">現價</p>
            <div className="mr-1/2 text-cream text-lg font-bold">95831</div>
          </div>
          <div className="h-[80%] w-0.5 bg-[rgba(212,175,89,0.12)]"></div>
          <div className="flex-1 px-2">
            <p className="mb-1/2 text-cream text-xs">差距</p>
            <div>
              <span className="mr-1/2 text-up text-lg font-bold">
                +120 (2.4%)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <p className="text-primary text-sm">選擇股票</p>
        <div
          className="rounded-md p-1"
          style={{ background: "rgba(232,184,74,0.18)" }}
        >
          <div className="bg-background rounded-md">
            <div
              className="border-primary flex items-center justify-between gap-2 rounded-md border p-3 py-2"
              style={{
                background: "rgba(232,184,74,0.12)",

                borderColor: "#E8B84A", // : "rgba(212,175,89,0.12)",
              }}
              // onClick={onClick}
            >
              <button
                className="text-primary size-8 rounded-sm bg-[#1F1D16] p-2 font-bold"
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
                className="text-primary [appearance:textfield] text-center outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="請輸入股票代號或名稱"
              />
              <button
                className="text-primary size-8 rounded-sm bg-[#1F1D16] p-2 font-bold"
                style={{ background: "rgba(212,175,89,0.12)" }}
                onClick={() => setValue((prev) => Math.max(0, prev + 1))}
              >
                <Image
                  src={"/icons/plus.svg"}
                  width={16}
                  height={16}
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
                percent === 0 && "text-cream",
                percent < 0 && "text-down",
              )}
            >
              {percent}%
            </div>
          ))}
        </div>

        <div className="flex h-20 gap-2">
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border p-2",
              rule === "gt" ? "border-up" : "border-[#8A857A]",
            )}
            onClick={() => {
              setRule("gt");
            }}
          >
            {rule === "gt" ? (
              <div
                className={cn(
                  "bg-background border-up size-4 overflow-hidden rounded-full border-5",
                )}
              />
            ) : (
              <div className="bg-background size-4 overflow-hidden rounded-full border-2 border-[#8A857A]" />
            )}

            <div
              className={cn(
                "text-up font-bold",
                rule === "gt" ? "text-up" : "text-cream",
              )}
            >
              股價漲到 ⬆
            </div>
          </div>
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border p-2",
              rule === "lt" ? "border-down" : "border-[#8A857A]",
            )}
            onClick={() => {
              setRule("lt");
            }}
          >
            {rule === "lt" ? (
              <div
                className={cn(
                  "bg-background border-down size-4 overflow-hidden rounded-full border-5",
                )}
              />
            ) : (
              <div className="bg-background size-4 overflow-hidden rounded-full border-2 border-[#8A857A]" />
            )}

            <div
              className={cn(
                "text-up font-bold",
                rule === "lt" ? "text-down" : "text-cream",
              )}
            >
              股價跌到 ⬇
            </div>
          </div>
        </div>
        <DrawerFooter>
          <button
            className="bg-primary rounded-lg py-2 text-lg font-bold shadow-[0_0_30px_rgba(232,184,74,0.5)]"
            onClick={() => mutate()}
          >
            加入關注並設定提醒
          </button>
        </DrawerFooter>
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
