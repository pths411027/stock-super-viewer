"use client";
import { Header } from "../_components/Header";
import { TargetTable } from "../_components/TargetTable";
import { MarketOverview } from "../_components/MarketOverview";

export default function Home() {
  return (
    <main>
      <div className="px-2">
        <MarketOverview />
        <TargetTable />
      </div>
    </main>
  );
}
