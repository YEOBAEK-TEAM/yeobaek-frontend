import { useInfiniteQuery } from "@tanstack/react-query";

import { getTrainingRooms } from "@/api/training/bookReportTraining";
import { getUnderstandRooms } from "@/api/training/comprehension/understandApi";
import { formatReportDate } from "@/utils/training/formatReportDate";
import { formatPageRange } from "@/utils/training/formatPageRange";

import type { TrainingHistoryItem } from "@/types/training/trainingHistory";

const PAGE_SIZE = 20;

export const trainingHistoryKeys = {
  bookReport: ["trainings", "history", "book-report"] as const,
  comprehension: ["trainings", "history", "understand"] as const,
};

export const useBookReportHistory = (enabled: boolean) =>
  useInfiniteQuery({
    queryKey: trainingHistoryKeys.bookReport,
    queryFn: ({ pageParam, signal }) =>
      getTrainingRooms({ cursor: pageParam, size: PAGE_SIZE, signal }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    select: (data): TrainingHistoryItem[] =>
      data.pages.flatMap((page) =>
        page.items.map((item) => ({
          roomId: item.trainingRoomId,
          programId: "book-report" as const,
          title: item.bookTitle,
          // 독후감 제목을 따옴표로 감싸 부제로 사용
          subtitle: item.reviewTitle ? `“${item.reviewTitle}”` : "",
          coverUrl: item.coverImageUrl ?? "",
          dateLabel: formatReportDate(item.createdAt),
        })),
      ),
    enabled,
  });

export const useComprehensionHistory = (enabled: boolean) =>
  useInfiniteQuery({
    queryKey: trainingHistoryKeys.comprehension,
    queryFn: ({ pageParam, signal }) => getUnderstandRooms(pageParam, signal),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    select: (data): TrainingHistoryItem[] =>
      data.pages.flatMap((page) =>
        page.items.map((item) => ({
          roomId: item.understandRoomId,
          programId: "comprehension" as const,
          title: item.bookTitle,
          // 페이지 범위가 없으면 책 전체 기준 방
          subtitle:
            item.startPageNumber === null || item.endPageNumber === null
              ? "책 전체"
              : formatPageRange(item.startPageNumber, item.endPageNumber),
          coverUrl: item.bookImageUrl ?? "",
          dateLabel: "",
        })),
      ),
    enabled,
  });
