import { HotStocksClient } from "./hot-stocks-client";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Hot Stocks</h1>
      <div className="mt-4">
        <HotStocksClient />
      </div>
    </main>
  );
}
