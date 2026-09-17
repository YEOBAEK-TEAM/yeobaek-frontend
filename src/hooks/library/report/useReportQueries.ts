import { queryOptions, useQuery } from "@tanstack/react-query";

import { getDraftReport, getMyReports, getUnlockedBooks } from "@/api/library/report";
import { toDraftReportView, toUnlockedBookViews } from "@/utils/library/report/toReportView";

const STALE_TIME = 30_000;

// 서재 독후감 query key 팩토리
export const libraryReportKeys = {
  all: ["library", "reports"] as const,
  draft: () => [...libraryReportKeys.all, "draft"] as const,
  mine: () => [...libraryReportKeys.all, "mine"] as const,
  unlockedBooks: () => [...libraryReportKeys.all, "unlocked-books"] as const,
};

export const draftReportQuery = queryOptions({
  queryKey: libraryReportKeys.draft(),
  queryFn: getDraftReport,
  staleTime: STALE_TIME,
});

export const useDraftReport = () =>
  useQuery({
    ...draftReportQuery,
    select: toDraftReportView,
  });

export const useMyReports = () =>
  useQuery({
    queryKey: libraryReportKeys.mine(),
    queryFn: getMyReports,
    staleTime: STALE_TIME,
  });

export const useUnlockedBooks = (enabled: boolean) =>
  useQuery({
    queryKey: libraryReportKeys.unlockedBooks(),
    queryFn: getUnlockedBooks,
    select: toUnlockedBookViews,
    staleTime: STALE_TIME,
    enabled,
  });
