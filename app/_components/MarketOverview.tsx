export function MarketOverview() {
  return (
    <div className="h-16 w-full overflow-hidden rounded-md border border-[rgba(212,175,89,0.12)] bg-[#1F1D16] p-2">
      <div className="flex h-full items-center justify-between">
        <div className="pl-2">
          <p className="mb-1/2 text-xs text-[#5A564E]">台股指數</p>
          <div>
            <span className="mr-1/2 text-lg font-bold text-[#E8B84A]">
              95831
            </span>{" "}
            <span className="text-xs font-bold text-[#3BCB8E]">+1200</span>
          </div>
        </div>
        <div className="h-[80%] w-0.5 bg-[#5A564E]"></div>
        <div className="pl-2">
          <p className="mb-1/2 text-xs text-[#5A564E]">成交金額</p>
          <div>
            <span className="mr-1/2 text-lg font-bold text-[#F5F1E6]">
              $ 1200 億
            </span>{" "}
          </div>
        </div>
        <div className="h-[80%] w-0.5 bg-[#5A564E]"></div>
        <div className="px-2">
          <p className="mb-1/2 text-xs text-[#5A564E]">漲跌家數</p>
          <div>
            <span className="mr-1/2 text-lg font-bold text-[#3BCB8E]">
              300/120
            </span>
          </div>
        </div>
      </div>
      123
    </div>
  );
}
