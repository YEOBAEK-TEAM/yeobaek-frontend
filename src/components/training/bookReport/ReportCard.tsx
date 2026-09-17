import { formatReportDate } from "@/utils/training/formatReportDate";

import type { ReadingReport } from "@/types/training/readingReport";

type ReportCardProps = {
  report: ReadingReport;
  variant: "message" | "sheet";
  onSelect?: (report: ReadingReport) => void;
};

export default function ReportCard({ report, variant, onSelect }: ReportCardProps) {
  const isSheet = variant === "sheet";

  // 노출 위치별 부제목 색
  const subTextColor = isSheet ? "text-[#8F8F8F]" : "text-[#4F4D4E]";

  // 노출 위치별 제목 크기
  const titleSize = isSheet ? "text-[17px]" : "text-[15px]";
  const subtitleSize = isSheet ? "text-[15px]" : "text-[13px]";

  const content = (
    <>
      <img
        src={report.coverUrl}
        alt=""
        className={`shrink-0 rounded-sm object-cover ${isSheet ? "h-19 w-13" : "h-16 w-11"}`}
      />

      <div className="min-w-0 flex-1">
        <p className={`truncate font-bold text-[#4F4D4E] ${titleSize}`}>{report.bookTitle}</p>

        <p className={`mt-0.5 truncate ${subtitleSize} ${subTextColor}`}>{report.reportTitle}</p>

        <p className={`mt-1 text-[13px] ${subTextColor}`}>{formatReportDate(report.createdAt)}</p>
      </div>
    </>
  );

  if (!isSheet) {
    return (
      <div className="flex w-full items-center gap-3 rounded-2xl border border-[#C4BFB6] bg-white p-3">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(report)}
      // 목록 카드 눌림 상태
      className="flex w-full items-center gap-3 rounded-2xl border border-[#C4BFB6] bg-white p-3 text-left active:border-[#BCB7AD] active:bg-[#E7E2DC]"
    >
      {content}
    </button>
  );
}
