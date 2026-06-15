"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
const TABS = ["行情", "個股", "新增", "我的"] as const;

function TabIndicator({
  tabLength,
  activeTab,
}: {
  tabLength: number;
  activeTab: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-1.5 left-1.5 rounded-full bg-[#2a3440] transition-transform duration-300 ease-out"
      style={{
        width: `calc((100% - 0.75rem) / ${tabLength})`,
        transform: `translateX(calc(${activeTab} * 100%))`,
      }}
    />
  );
}

export function Footer() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="mx-auto w-full max-w-120 p-2">
        <div className="relative flex justify-between rounded-full bg-[#323e4b] p-1.5">
          <TabIndicator tabLength={TABS.length} activeTab={activeTab} />
          {TABS.map((tab, index) => (
            <button
              key={tab}
              className={cn(
                "relative z-10 flex-1 rounded-full py-2 text-center",
                index === activeTab
                  ? "font-bold text-yellow-500"
                  : "text-zinc-600",
              )}
              onClick={() => {
                setActiveTab(index);
                switch (tab) {
                  case "新增":
                    router.push("/follow");
                    break;
                  default:
                    router.push("/");
                    break;
                }
              }}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
