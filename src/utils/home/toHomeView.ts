import { formatReportDate } from "@/utils/training/formatReportDate";

import type {
  CurrentReadingResponse,
  ReadingProgressView,
  RecentReportView,
  RecommendedBookResponse,
  TasteBook,
} from "@/types/home/home";
import type { LatestBookReviewResponse } from "@/types/library/report";

// 서버 진행률을 0~100 정수로 보정
const toPercent = (progressRate: number) =>
  Number.isFinite(progressRate) ? Math.min(100, Math.max(0, Math.round(progressRate))) : 0;

export const toReadingProgressView = (
  response: CurrentReadingResponse | null,
): ReadingProgressView | null =>
  response && {
    bookId: response.bookId,
    bookTitle: response.bookTitle,
    coverUrl: response.coverImageUrl ?? "",
    // 독후감을 쓰지 않았어도 끝까지 읽었으면 완독
    percent: response.status === "REVIEW_NEEDED" ? 100 : toPercent(response.progressRate),
    remainingPages: response.status === "REVIEW_NEEDED" ? 0 : Math.max(0, response.remainingPages),
  };

export const toRecentReportView = (
  response: LatestBookReviewResponse | null,
): RecentReportView | null =>
  response && {
    reportId: response.reviewId,
    bookTitle: response.bookTitle,
    coverUrl: response.coverImageUrl ?? "",
    reportTitle: response.title ? `“${response.title}”` : "",
    status: response.status === "DRAFT" ? "writing" : "completed",
  };

export const toTasteBooks = (responses: RecommendedBookResponse[]): TasteBook[] =>
  responses.map((response) => ({
    bookId: response.bookId,
    title: response.title,
    author: response.author ?? "",
    publisher: response.publisher ?? "",
    publishedAt: response.createdAt ? formatReportDate(response.createdAt) : "",
    coverUrl: response.coverImageUrl ?? "",
  }));
