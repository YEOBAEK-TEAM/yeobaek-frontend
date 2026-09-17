import { AlignJustify } from "lucide-react";
import { useMemo, useState } from "react";

import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import ReportCard from "@/components/training/bookReport/ReportCard";
import { REPORT_SHEET_TITLE, REPORT_SORT_LABEL } from "@/constants/training/bookReportChat";

import type { ReadingReport, ReportSortOrder } from "@/types/training/readingReport";

type ReportSheetContentProps = {
  reports: ReadingReport[];
  onSelect: (report: ReadingReport) => void;
};

export default function ReportSheetContent({ reports, onSelect }: ReportSheetContentProps) {
  const requestClose = useBottomSheetClose();

  const [order, setOrder] = useState<ReportSortOrder>("latest");

  const sortedReports = useMemo(
    () =>
      [...reports].sort((a, b) =>
        order === "latest"
          ? b.createdAt.localeCompare(a.createdAt)
          : a.createdAt.localeCompare(b.createdAt),
      ),
    [reports, order],
  );

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-1 pb-5">
        <h2 id="report-sheet-title" className="text-[17px] font-bold text-[#4F4D4E]">
          {REPORT_SHEET_TITLE}
        </h2>

        <button
          type="button"
          // 정렬 기준 전환
          onClick={() => setOrder((current) => (current === "latest" ? "oldest" : "latest"))}
          aria-label={`정렬 기준 ${REPORT_SORT_LABEL[order]}, 눌러서 변경`}
          className="flex items-center gap-2 text-[15px] text-[#54555A]"
        >
          {REPORT_SORT_LABEL[order]}
          <AlignJustify aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <ul className="flex flex-col gap-3 px-5 pb-8">
        {sortedReports.map((report) => (
          <li key={report.reportId}>
            <ReportCard
              report={report}
              variant="sheet"
              // 시트 닫은 뒤 독후감 선택
              onSelect={(selected) => requestClose(() => onSelect(selected))}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
