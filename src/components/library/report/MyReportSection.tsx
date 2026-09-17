import { ChevronRight } from "lucide-react";

import SectionState from "@/components/common/section/SectionState";
import MyReportCard from "@/components/library/report/MyReportCard";
import { MY_REPORT_SECTION } from "@/constants/library/report";
import { useMyReports } from "@/hooks/library/report/useReportQueries";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";

type MyReportSectionProps = {
  onWrite: () => void;
  onOpenReport: (reportId: number) => void;
};

const SKELETON_ITEMS = [0, 1, 2];

const SKELETON_CARD_CLASS = "h-50 w-28.5 animate-pulse rounded-lg bg-[#EFEDE7]";

export default function MyReportSection({ onWrite, onOpenReport }: MyReportSectionProps) {
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useMyReports();

  const reports = data ?? [];

  // 가로 목록 끝에 닿으면 다음 페이지 요청
  const sentinelRef = useInfiniteSentinel({
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  });

  const renderList = () => {
    if (isError && reports.length === 0) {
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
                <div className={SKELETON_CARD_CLASS} />
              </li>
            ))
          : reports.map((report) => (
              <li key={report.reportId} className="shrink-0 snap-start">
                <MyReportCard report={report} onOpen={() => onOpenReport(report.reportId)} />
              </li>
            ))}

        {hasNextPage && (
          <li className="shrink-0">
            <div ref={sentinelRef} className={SKELETON_CARD_CLASS} />
          </li>
        )}
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
    </section>
  );
}
