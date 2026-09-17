import BookCover from "@/components/common/bookCover/BookCover";
import { REPORT_STATUS_LABEL } from "@/constants/home/home";

import type { RecentReport } from "@/types/home/home";

type ReportPanelProps = {
  nickname: string;
  report: RecentReport;
};

export default function ReportPanel({ nickname, report }: ReportPanelProps) {
  return (
    <div className="flex h-full items-center gap-4 px-4 py-3">
      <BookCover src={report.coverUrl} className="h-full max-h-24 w-17 shrink-0 rounded-sm" />

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-[#4F4D4E]">{nickname}님의 독후감</p>

        <p className="mt-1 truncate text-[20px] font-bold text-[#2C2A2B]">{report.bookTitle}</p>

        <p className="truncate text-[14px] font-semibold text-[#4F4D4E]">{report.reportTitle}</p>

        <p className="mt-2 text-[13px] font-bold text-[#4F4D4E]">
          {REPORT_STATUS_LABEL[report.status]}
        </p>
      </div>
    </div>
  );
}
