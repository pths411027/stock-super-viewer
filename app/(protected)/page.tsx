"use client";
import { Header } from "../_components/Header";
import { TargetTable } from "../_components/TargetTable";
import { MarketOverview } from "../_components/MarketOverview";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="px-2">
        <MarketOverview />
      </div>

      <div className="mt-4 px-2">
        <TargetTable />
      </div>
    </main>
  );
}
