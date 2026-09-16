import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReadingDay } from "@/types/my";
import { monthSummary } from "./myUtils";
export default function MonthlyReadingSummary({
  month,
  days,
}: {
  month: number;
  days: ReadingDay[];
}) {
  const summary = monthSummary(days);
  return (
    <Link to="/my/calendar" className="mt-10 block px-8">
      <h2 className="flex items-center gap-3 text-base font-bold">
        {month}월의 독서기록 <CalendarDays size={22} />
      </h2>
      <dl className="mt-4 grid grid-cols-3 text-center">
        {[
          [summary.completed, "권", "완독했어요"],
          [summary.pages.toLocaleString(), "p", "읽었어요"],
          [Math.round(summary.minutes / 60), "시간", "함께했어요"],
        ].map(([value, unit, label]) => (
          <div key={label}>
            <dd className="text-2xl font-bold text-black">
              {value}
              <span className="text-sm">{unit}</span>
            </dd>
            <dt className="mt-1 text-xs font-semibold text-[#808080]">{label}</dt>
          </div>
        ))}
      </dl>
    </Link>
  );
}
