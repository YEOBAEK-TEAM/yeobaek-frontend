import { CalendarDays } from "lucide-react";

type ReportDateFieldProps = {
  id: string;
  label: string;
};

// 작성일은 서버 기록 기준으로 표시만
export default function ReportDateField({ id, label }: ReportDateFieldProps) {
  return (
    <div
      id={id}
      className="flex h-16.5 items-center justify-between rounded-2xl border-2 border-[#D3D0C3] bg-[#F9FAFB] pr-5 pl-5"
    >
      <span className="text-[22px] text-[#4F4D4E] tabular-nums">{label}</span>

      <CalendarDays aria-hidden="true" strokeWidth={1.75} className="h-7 w-7 text-[#4F4D4E]" />
    </div>
  );
}
