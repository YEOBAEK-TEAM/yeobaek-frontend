import { MY_REPORT_SECTION } from "@/constants/library/report";

import type { MyReportView } from "@/types/library/report";

type MyReportCardProps = {
  report: MyReportView;
  onOpen: () => void;
};

export default function MyReportCard({ report, onOpen }: MyReportCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-50 w-28.5 flex-col rounded-lg border border-[#EAE8E3] bg-[#F7F6F1] px-3 pt-3 pb-3 text-left"
    >
      {report.isDraft && (
        <span className="mb-2 self-start rounded-full bg-[#E7E2DC] px-2 py-0.5 text-[12px] font-semibold text-[#60564C]">
          {MY_REPORT_SECTION.draftBadge}
        </span>
      )}

      <p className="line-clamp-2 text-[17px] leading-6 font-bold break-keep text-[#2C2A2B]">
        {report.bookTitle}
      </p>
      <p className="mt-1 text-[14px] leading-5 font-semibold text-[#4F4D4E] tabular-nums">
        {report.dateLabel}
      </p>
      <p className="mt-1 line-clamp-3 text-[15px] leading-5 font-medium break-keep text-[#4F4D4E]">
        {report.quote}
      </p>
    </button>
  );
}
