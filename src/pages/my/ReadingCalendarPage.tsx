import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/header/Header";
import ReadingCalendar from "@/components/my/calendar/ReadingCalendar";
import ReadingRecordSheet from "@/components/my/calendar/ReadingRecordSheet";
import { monthSummary } from "@/components/my/myUtils";
import { mockReadingDays, myReferenceDate } from "@/mocks/my";
import type { ReadingDay } from "@/types/my";
export default function ReadingCalendarPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => new Date(`${myReferenceDate.slice(0, 7)}-01T12:00:00`));
  const [selected, setSelected] = useState<ReadingDay | null>(null);
  const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const days = mockReadingDays.filter((day) => day.date.startsWith(monthKey));
  const summary = monthSummary(days);
  return (
    <main className="pb-10 text-[#30201D]">
      <Header title="독서 달력" onBack={() => navigate("/my")} />
      <ReadingCalendar
        month={month}
        days={days}
        onMonthChange={(offset) => {
          setSelected(null);
          setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
        }}
        onSelect={setSelected}
      />
      <dl className="mx-4 mt-9 grid grid-cols-3 divide-x divide-[#DDD9D2] rounded-xl bg-[#F0ECE3] py-6 text-center">
        {[
          ["총 페이지", `${summary.pages.toLocaleString()}p`],
          ["독서한 날", `${summary.days}일`],
          ["일 평균", `${summary.average}p`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-md font-semibold text-[#888]">{label}</dt>
            <dd className="mt-2 text-xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      {selected && <ReadingRecordSheet day={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
