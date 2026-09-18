import { useEffect, useMemo, useState } from "react";

import SectionState from "@/components/common/section/SectionState";
import ReportListItem from "@/components/library/report/ReportListItem";
import ReportSortMenu from "@/components/library/report/ReportSortMenu";
import ReportStatusTabs from "@/components/library/report/ReportStatusTabs";
import { REPORT_LIKE_ERROR_TEXT, REPORT_STATUS_TABS } from "@/constants/library/report";
import { useMyReports } from "@/hooks/library/report/useReportQueries";
import { useToggleReportLike } from "@/hooks/library/report/useToggleReportLike";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";
import { useToastStore } from "@/stores/common/toast";

import type { ReportSortOrder, ReportStatusTab } from "@/constants/library/report";

type ReportListSectionProps = {
  onOpenReport: (reportId: number) => void;
};

const SKELETON_ITEMS = [0, 1, 2];

export default function ReportListSection({ onOpenReport }: ReportListSectionProps) {
  const [tab, setTab] = useState<ReportStatusTab>("DRAFT");
  const [order, setOrder] = useState<ReportSortOrder>("latest");

  const draftQuery = useMyReports("DRAFT");
  const publishedQuery = useMyReports("PUBLISHED");

  const activeQuery = tab === "DRAFT" ? draftQuery : publishedQuery;
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    activeQuery;

  const showToast = useToastStore((state) => state.showToast);

  const toggleLike = useToggleReportLike(() => showToast(REPORT_LIKE_ERROR_TEXT, "error"));

  // 서버가 최근순만 주어 오래된순은 전체를 받아 온 뒤 정렬
  const isLoadingAll = order === "oldest" && hasNextPage;

  useEffect(() => {
    if (order !== "oldest" || !hasNextPage || isFetchingNextPage) return;

    void fetchNextPage();
  }, [order, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 좋아요한 독후감은 항상 위, 그 안에서 날짜 순서만 전환
  const reports = useMemo(() => {
    const loaded = data?.reports ?? [];

    return order === "latest"
      ? loaded
      : [...loaded].sort(
          (a, b) =>
            Number(b.isLiked) - Number(a.isLiked) ||
            Date.parse(a.updatedAt) - Date.parse(b.updatedAt),
        );
  }, [data?.reports, order]);

  const sentinelRef = useInfiniteSentinel({
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  });

  const activeTab = REPORT_STATUS_TABS.find((item) => item.id === tab);

  const renderList = () => {
    if (isError && reports.length === 0) {
      return <SectionState isError onRetry={() => void refetch()} className="h-40" />;
    }

    if (isPending || isLoadingAll) {
      return SKELETON_ITEMS.map((item) => (
        <div key={item} className="h-25 animate-pulse rounded-2xl bg-[#EFEDE7]" />
      ));
    }

    if (reports.length === 0) {
      return <p className="py-14 text-center text-[15px] text-[#8F8B85]">{activeTab?.emptyText}</p>;
    }

    return (
      <ul className="flex flex-col gap-3">
        {reports.map((report) => (
          <li key={report.reportId}>
            <ReportListItem
              report={report}
              datePrefix={activeTab?.datePrefix ?? ""}
              onOpen={() => onOpenReport(report.reportId)}
              // 좋아요는 작성 완료한 독후감에만
              onToggleLike={tab === "PUBLISHED" ? () => toggleLike(report.reportId) : undefined}
            />
          </li>
        ))}

        {hasNextPage && order === "latest" && (
          <li>
            <div ref={sentinelRef} className="h-25 animate-pulse rounded-2xl bg-[#EFEDE7]" />
          </li>
        )}
      </ul>
    );
  };

  return (
    <section aria-label="내가 쓴 독후감" className="mt-6 px-5">
      <ReportStatusTabs
        tab={tab}
        counts={{
          DRAFT: draftQuery.data?.totalCount ?? 0,
          PUBLISHED: publishedQuery.data?.totalCount ?? 0,
        }}
        onChange={setTab}
      />

      <div className="mt-2 flex justify-end">
        <ReportSortMenu order={order} onChange={setOrder} />
      </div>

      <div className="mt-1 flex flex-col gap-3 pb-6">{renderList()}</div>
    </section>
  );
}
