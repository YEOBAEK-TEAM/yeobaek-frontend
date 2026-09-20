export default function CalendarDay({
  day,
  pages,
  currentMonth,
  onSelect,
}: {
  day: number;
  pages: number;
  currentMonth: boolean;
  onSelect: () => void;
}) {
  const color =
    pages > 100
      ? "bg-[#60664C] text-white"
      : pages > 60
        ? "bg-[#9FA789] text-black"
        : pages > 30
          ? "bg-[#BFC6A5] text-black"
          : pages > 0
            ? "bg-[#DFE5C8] text-black"
            : "text-black";
  return (
    <div className="flex h-13 items-center justify-center">
      <button
        type="button"
        disabled={!currentMonth || pages === 0}
        onClick={onSelect}
        aria-label={`${day}일, ${pages ? `${pages}페이지 읽음` : "독서 기록 없음"}`}
        className={`flex size-9 items-center justify-center rounded-full text-base font-semibold ${currentMonth ? color : "text-[#AAA]"}`}
      >
        {day}
      </button>
    </div>
  );
}
