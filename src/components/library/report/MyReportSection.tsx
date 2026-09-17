import { ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import SectionState from "@/components/common/section/SectionState";
import MyReportCard from "@/components/library/report/MyReportCard";
import ReportToast from "@/components/library/report/ReportToast";
import { MY_REPORT_SECTION, REPORT_LIKE_ERROR_TEXT } from "@/constants/library/report";
import { useMyReports } from "@/hooks/library/report/useReportQueries";
import { useStableOrder } from "@/hooks/library/report/useStableOrder";
import { useToggleReportLike } from "@/hooks/library/report/useToggleReportLike";
import { sortReportsByLike } from "@/utils/library/report/sortReportsByLike";
import { toMyReportView } from "@/utils/library/report/toReportView";

import type { MyReportResponse } from "@/types/library/report";

type MyReportSectionProps = {
  onWrite: () => void;
  onOpenReport: (reportId: number) => void;
};

const SKELETON_ITEMS = [0, 1, 2];

const getReportId = (report: MyReportResponse) => report.reportId;

export default function MyReportSection({ onWrite, onOpenReport }: MyReportSectionProps) {
  const { data, isPending, isError, refetch } = useMyReports();

  const [isLikeErrorVisible, setIsLikeErrorVisible] = useState(false);
  const hideLikeError = useCallback(() => setIsLikeErrorVisible(false), []);

  const toggleLike = useToggleReportLike(() => setIsLikeErrorVisible(true));

  const sortedReports = useMemo(() => (data ? sortReportsByLike(data) : undefined), [data]);

  // 하트를 누른 자리에서 카드가 튀지 않도록 재정렬은 다음 진입 때 반영
  const reports = useStableOrder(sortedReports, getReportId) ?? [];

  const renderList = () => {
    if (isError) {
      return (
        <div className="px-4">
          <SectionState isError onRetry={() => void refetch()} className="h-50" />
        </div>
      );
    }

    if (!isPending && reports.length === 0) {
      return (
        <p className="py-14 text-center text-[15px] text-[#8F8B85]">
          {MY_REPORT_SECTION.emptyText}
        </p>
      );
    }

    return (
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isPending
          ? SKELETON_ITEMS.map((item) => (
              <li key={item} className="shrink-0 snap-start">
                <div className="h-50 w-28.5 animate-pulse rounded-lg bg-[#EFEDE7]" />
              </li>
            ))
          : reports.map((report) => (
              <li key={report.reportId} className="shrink-0 snap-start">
                <MyReportCard
                  report={toMyReportView(report)}
                  onOpen={() => onOpenReport(report.reportId)}
                  onToggleLike={() => toggleLike(report.reportId)}
                />
              </li>
            ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby="my-report-title" className="mt-1">
      <div className="flex items-center justify-between pr-2 pl-6">
        <h2 id="my-report-title" className="text-[17px] font-bold text-[#4F4D4E]">
          {MY_REPORT_SECTION.title}
        </h2>

        <button
          type="button"
          onClick={onWrite}
          className="flex h-10 items-center gap-0.5 px-2 text-[15px] text-[#54555A]"
        >
          {MY_REPORT_SECTION.writeLabel}
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2">{renderList()}</div>

      {isLikeErrorVisible && (
        <ReportToast message={REPORT_LIKE_ERROR_TEXT} onClose={hideLikeError} />
      )}
    </section>
  );
}
