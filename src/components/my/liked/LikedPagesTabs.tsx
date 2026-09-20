export default function LikedPagesTabs({
  active,
  onChange,
}: {
  active: "all" | "books";
  onChange: (tab: "all" | "books") => void;
}) {
  return (
    <div role="tablist" aria-label="좋아요 페이지 보기 방식" className="mx-7 flex">
      {(["all", "books"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`flex-1 border-b-4 py-3 text-sm font-bold ${active === tab ? "border-[#4C513C] text-[#4C513C]" : "border-[#E5E5E5] text-[#BBB]"}`}
        >
          {tab === "all" ? "전체" : "책별보기"}
        </button>
      ))}
    </div>
  );
}
