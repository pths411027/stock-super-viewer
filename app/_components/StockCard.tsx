export function StockCard({
  name,
  referencePrice,
  lastPrice,
}: {
  name: string;
  referencePrice: number;
  lastPrice: number;
}) {
  const change = (lastPrice - referencePrice).toFixed(2);
  const changePercent = ((lastPrice - referencePrice) / referencePrice).toFixed(
    2,
  );

  console.log(change, changePercent);
  return (
    <div className="flex flex-col items-center border border-red-500">
      <h3 className="w-full bg-gray-300 text-center text-2xl font-bold">
        {name}
      </h3>
      <div className="text-[48px] font-bold text-red-500">{lastPrice}</div>
      <div className="flex w-full justify-between px-1 text-xl text-red-500">
        <p>{change}</p>
        <p>{changePercent} %</p>
      </div>
    </div>
  );
}
