import { DRAFT_REPORT, MY_REPORT_SECTION } from "@/constants/library/report";
import { formatReportDate } from "@/utils/training/formatReportDate";

import type {
  BookReviewDetailResponse,
  BookReviewListItemResponse,
  LatestBookReviewResponse,
  LatestReportView,
  MyReportView,
  ReportEditorView,
  UnlockedBookResponse,
  UnlockedBookView,
} from "@/types/library/report";

export const toLatestReportView = (
  response: LatestBookReviewResponse | null,
): LatestReportView | null =>
  response && {
    title: response.bookTitle,
    subtitle: response.author,
    completedLabel: response.completedAt
      ? `${DRAFT_REPORT.completedPrefix} ${formatReportDate(response.completedAt)}`
      : "",
  };

export const toMyReportView = (response: BookReviewListItemResponse): MyReportView => ({
  reportId: response.reviewId,
  bookTitle: response.bookTitle,
  dateLabel: formatReportDate(response.writtenAt),
  quote: response.title ? `“${response.title}”` : MY_REPORT_SECTION.untitled,
  isDraft: response.status === "DRAFT",
});

// 해금일 최신순
export const toUnlockedBookViews = (responses: UnlockedBookResponse[]): UnlockedBookView[] =>
  responses
    .map((response) => ({
      bookId: response.bookId,
      title: response.bookTitle,
      unlockedAt: response.quizPassedAt,
      unlockedLabel: formatReportDate(response.quizPassedAt),
    }))
    .sort((a, b) => Date.parse(b.unlockedAt) - Date.parse(a.unlockedAt));

export const toReportEditorView = (response: BookReviewDetailResponse): ReportEditorView => ({
  reportId: response.reviewId,
  bookId: response.bookId,
  bookTitle: response.bookTitle,
  title: response.title ?? "",
  content: response.content ?? "",
  status: response.status,
  dateLabel: formatReportDate(response.writtenAt),
});

export const toNewReportEditorView = (bookId: number, bookTitle: string): ReportEditorView => ({
  reportId: null,
  bookId,
  bookTitle,
  title: "",
  content: "",
  status: null,
  dateLabel: formatReportDate(new Date().toLocaleDateString("sv-SE")),
});
