import { DRAFT_REPORT } from "@/constants/library/report";
import { formatReportDate } from "@/utils/training/formatReportDate";

import type {
  DraftReportResponse,
  DraftReportView,
  MyReportResponse,
  MyReportView,
  UnlockedBookResponse,
  UnlockedBookSortOrder,
  UnlockedBookView,
} from "@/types/library/report";

const toBannerView = (
  response: Pick<
    DraftReportResponse,
    "reportId" | "bookTitle" | "bookSubtitle" | "coverUrl" | "completedAt"
  >,
): DraftReportView => ({
  reportId: response.reportId,
  title: response.bookTitle,
  subtitle: response.bookSubtitle,
  coverUrl: response.coverUrl,
  completedLabel: `${DRAFT_REPORT.completedPrefix} ${formatReportDate(response.completedAt)}`,
});

export const toDraftReportView = (response: DraftReportResponse | null): DraftReportView | null =>
  response && toBannerView(response);

// 작성일 기준 가장 최근에 쓴 독후감
export const toLatestReportView = (reports: MyReportResponse[]): DraftReportView | null => {
  const latest = reports.reduce<MyReportResponse | null>(
    (prev, current) =>
      !prev || Date.parse(current.createdAt) > Date.parse(prev.createdAt) ? current : prev,
    null,
  );

  return (
    latest && {
      ...toBannerView(latest),
      completedLabel: DRAFT_REPORT.reportCompletedLabel,
      quote: `“${latest.reportTitle}”`,
    }
  );
};

export const toMyReportView = (response: MyReportResponse): MyReportView => ({
  reportId: response.reportId,
  bookTitle: response.bookTitle,
  coverUrl: response.coverUrl,
  dateLabel: formatReportDate(response.createdAt),
  quote: `“${response.reportTitle}”`,
  isLiked: response.isLiked,
});

export const toUnlockedBookViews = (responses: UnlockedBookResponse[]): UnlockedBookView[] =>
  responses.map((response) => ({
    bookId: response.bookId,
    title: response.bookTitle,
    author: response.author,
    coverUrl: response.coverUrl,
    unlockedAt: response.unlockedAt,
    unlockedLabel: formatReportDate(response.unlockedAt),
  }));

export const sortUnlockedBooks = (books: UnlockedBookView[], order: UnlockedBookSortOrder) =>
  [...books].sort((a, b) =>
    order === "latest"
      ? Date.parse(b.unlockedAt) - Date.parse(a.unlockedAt)
      : Date.parse(a.unlockedAt) - Date.parse(b.unlockedAt),
  );
