import { CalendarDays } from "lucide-react";

import { formatReportDate } from "@/utils/training/formatReportDate";

type ReportDateFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ReportDateField({ id, value, onChange }: ReportDateFieldProps) {
  return (
    <div className="relative flex h-16.5 items-center justify-between rounded-2xl border-2 border-[#D3D0C3] bg-[#F9FAFB] pr-5 pl-5 focus-within:border-[#A89F94]">
      <span aria-hidden="true" className="text-[22px] text-[#4F4D4E] tabular-nums">
        {formatReportDate(value)}
      </span>

      <CalendarDays aria-hidden="true" strokeWidth={1.75} className="h-7 w-7 text-[#4F4D4E]" />

      {/* 영역 전체를 눌러 달력 열기 */}
      <input
        id={id}
        type="date"
        value={value}
        required
        onChange={(event) => event.target.value && onChange(event.target.value)}
        onClick={(event) => event.currentTarget.showPicker?.()}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
