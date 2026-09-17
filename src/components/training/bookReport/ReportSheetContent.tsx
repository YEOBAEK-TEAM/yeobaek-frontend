import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import SectionState from "@/components/common/section/SectionState";
import ReportCard from "@/components/training/bookReport/ReportCard";
import { REPORT_SHEET_EMPTY_TEXT, REPORT_SHEET_TITLE } from "@/constants/training/bookReportChat";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";

import type { ReadingReport } from "@/types/training/readingReport";

export type ReportSheetContentProps = {
  reports: ReadingReport[];
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  onRetry: () => void;
  onSelect: (report: ReadingReport) => void;
};

// 서버 최근순 목록, 끝에 닿으면 다음 페이지 요청
export default function ReportSheetContent({
  reports,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onRetry,
  onSelect,
}: ReportSheetContentProps) {
  const requestClose = useBottomSheetClose();

  const sentinelRef = useInfiniteSentinel({
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  });

  const renderReports = () => {
    if (isError && reports.length === 0) {
      return <SectionState isError onRetry={onRetry} className="h-40" />;
    }

    if (isPending) {
      return [0, 1, 2].map((item) => (
        <div key={item} className="h-25 animate-pulse rounded-2xl bg-[#EFEDE7]" />
      ));
    }

    if (reports.length === 0) {
      return (
        <p className="py-12 text-center text-[15px] text-[#8F8B85]">{REPORT_SHEET_EMPTY_TEXT}</p>
      );
    }

    return (
      <ul className="flex flex-col gap-3">
        {reports.map((report) => (
          <li key={report.reportId}>
            <ReportCard
              report={report}
              variant="sheet"
              // 시트 닫은 뒤 독후감 선택
              onSelect={(selected) => requestClose(() => onSelect(selected))}
            />
          </li>
        ))}

        {hasNextPage && (
          <li>
            <div ref={sentinelRef} className="h-25 animate-pulse rounded-2xl bg-[#EFEDE7]" />
          </li>
        )}
      </ul>
    );
  };

  return (
    <>
      <div className="px-5 pt-1 pb-5">
        <h2 id="report-sheet-title" className="text-[17px] font-bold text-[#4F4D4E]">
          {REPORT_SHEET_TITLE}
        </h2>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-8">{renderReports()}</div>
    </>
  );
}
