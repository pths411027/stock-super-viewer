import Image from "next/image";

export default function SearchInput({
  q,
  setQ,
}: {
  q: string;
  setQ: (q: string) => void;
}) {
  return (
    <div
      className="mt-2 flex gap-2 rounded-md border border-[#8A857A] p-2"
      style={{
        background: "rgba(232,184,74,0.18)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <Image
        src={"/icons/search.svg"}
        width={24}
        height={24}
        alt="search"
        className="fill-[#8A857A]"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full text-white outline-none placeholder:text-[#8A857A] focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
        placeholder="請輸入股票代號或名稱"
      />
    </div>
  );
}
