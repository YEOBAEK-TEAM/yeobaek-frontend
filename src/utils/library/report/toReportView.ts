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

const toQuote = (title: string | null) => (title ? `“${title}”` : MY_REPORT_SECTION.untitled);

// 작성 중이면 완독일, 작성 완료면 작성완료 표시
export const toLatestReportView = (
  response: LatestBookReviewResponse | null,
): LatestReportView | null => {
  if (!response) return null;

  const isDraft = response.status === "DRAFT";

  return {
    reportId: response.reviewId,
    isDraft,
    title: response.bookTitle,
    // 저자와 장르를 이어 붙인 책 소개 한 줄
    subtitle: [response.author, response.genre].filter(Boolean).join(" "),
    coverUrl: response.coverImageUrl ?? "",
    quote: isDraft ? undefined : toQuote(response.title),
    completedLabel: isDraft
      ? response.completedAt
        ? `${DRAFT_REPORT.completedPrefix} ${formatReportDate(response.completedAt)}`
        : ""
      : DRAFT_REPORT.reportCompletedLabel,
  };
};

export const toMyReportView = (response: BookReviewListItemResponse): MyReportView => ({
  reportId: response.reviewId,
  bookTitle: response.bookTitle,
  coverUrl: response.coverImageUrl ?? "",
  dateLabel: formatReportDate(response.writtenAt),
  quote: toQuote(response.title),
  isDraft: response.status === "DRAFT",
  isLiked: response.isLiked,
});

// 해금일 최신순
export const toUnlockedBookViews = (responses: UnlockedBookResponse[]): UnlockedBookView[] =>
  [...responses]
    .sort((a, b) => Date.parse(b.quizPassedAt) - Date.parse(a.quizPassedAt))
    .map((response) => ({
      bookId: response.bookId,
      title: response.bookTitle,
      author: response.author,
      coverUrl: response.coverImageUrl ?? "",
      unlockedLabel: formatReportDate(response.quizPassedAt),
    }));

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
