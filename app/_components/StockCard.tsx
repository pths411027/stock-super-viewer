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

  return (
    <div className="flex flex-row items-center gap-2 rounded-md border border-[#FFFFFF10] p-2">
      <div className="size-4 rounded-bl-lg bg-white" />
      <h3 className="flex-1 font-bold text-[#F8FAFC]">{name}</h3>
      {/* <div className="text-[48px] font-bold text-red-500">{lastPrice}</div> */}
      <div className="flex justify-between gap-1 px-1 font-bold text-green-600">
        {/* <p>{change}</p> */}
        <h3 className="flex-1 text-sm font-bold text-[#CBD5E1]">敘述</h3>
        <p>{changePercent} %</p>
      </div>
    </div>
  );
}
