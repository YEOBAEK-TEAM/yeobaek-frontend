import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReadingDay } from "@/types/my";
import { dayPages } from "../myUtils";
import CalendarDay from "./CalendarDay";
import CalendarLegend from "./CalendarLegend";
export default function ReadingCalendar({
  month,
  days,
  onMonthChange,
  onSelect,
}: {
  month: Date;
  days: ReadingDay[];
  onMonthChange: (offset: number) => void;
  onSelect: (day: ReadingDay) => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const count = Math.ceil((firstWeekday + new Date(year, monthIndex + 1, 0).getDate()) / 7) * 7;
  return (
    <section className="px-4 pt-12">
      <div className="mb-10 flex items-center justify-between px-6">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => onMonthChange(-1)}
          className="flex size-10 items-center justify-center"
        >
          <ChevronLeft />
        </button>
        <h2 aria-live="polite" className="text-xl font-bold text-black">
          {year}년 {monthIndex + 1}월
        </h2>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => onMonthChange(1)}
          className="flex size-10 items-center justify-center"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {Array.from("일월화수목금토").map((day) => (
          <span key={day} className="pb-4 text-sm font-semibold text-[#555]">
            {day}
          </span>
        ))}
        {Array.from({ length: count }, (_, index) => {
          const date = new Date(year, monthIndex, index - firstWeekday + 1);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          const record = days.find((day) => day.date === key);
          return (
            <CalendarDay
              key={key}
              day={date.getDate()}
              currentMonth={date.getMonth() === monthIndex}
              pages={record ? dayPages(record) : 0}
              onSelect={() => {
                if (record) onSelect(record);
              }}
            />
          );
        })}
      </div>
      <CalendarLegend />
    </section>
  );
}
