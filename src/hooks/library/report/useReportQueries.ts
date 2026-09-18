import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getBookReviews, getLatestBookReview, getUnlockedBooks } from "@/api/library/report";
import {
  toLatestReportView,
  toMyReportView,
  toUnlockedBookViews,
} from "@/utils/library/report/toReportView";

const STALE_TIME = 30_000;

// 서재 독후감 query key 팩토리
export const libraryReportKeys = {
  all: ["library", "reports"] as const,
  latest: () => [...libraryReportKeys.all, "latest"] as const,
  mine: () => [...libraryReportKeys.all, "mine"] as const,
  detail: (reviewId: number) => [...libraryReportKeys.all, "detail", reviewId] as const,
  unlockedBooks: () => [...libraryReportKeys.all, "unlocked-books"] as const,
  pendingUnlockBooks: () => [...libraryReportKeys.all, "pending-unlock-books"] as const,
};

export const latestReportQuery = queryOptions({
  queryKey: libraryReportKeys.latest(),
  queryFn: ({ signal }) => getLatestBookReview(signal),
  staleTime: STALE_TIME,
});

export const useLatestReport = () =>
  useQuery({
    ...latestReportQuery,
    select: toLatestReportView,
  });

export const useMyReports = () =>
  useInfiniteQuery({
    queryKey: libraryReportKeys.mine(),
    queryFn: ({ pageParam, signal }) => getBookReviews(pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    select: (data) => data.pages.flatMap((page) => page.items.map(toMyReportView)),
    staleTime: STALE_TIME,
  });

export const useUnlockedBooks = (enabled: boolean) =>
  useQuery({
    queryKey: libraryReportKeys.unlockedBooks(),
    queryFn: ({ signal }) => getUnlockedBooks(signal),
    select: toUnlockedBookViews,
    staleTime: STALE_TIME,
    enabled,
  });
