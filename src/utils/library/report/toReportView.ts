import { REPORT_STATUS_TABS, REPORT_UNTITLED } from "@/constants/library/report";
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

const toQuote = (title: string | null) => (title ? `“${title}”` : REPORT_UNTITLED);

// 저장하는 날이 작성일이 되므로 기기 시간대 기준 오늘 날짜
export const todayReportDate = () => new Date().toLocaleDateString("sv-SE");

// 작성 중이면 완독일, 작성 완료면 작성완료 표시
export const toLatestReportView = (
  response: LatestBookReviewResponse | null,
): LatestReportView | null => {
  if (!response) return null;

  return {
    reportId: response.reviewId,
    isDraft: response.status === "DRAFT",
    title: response.bookTitle,
    // 저자와 장르를 이어 붙인 책 소개 한 줄
    subtitle: [response.author, response.genre].filter(Boolean).join(" "),
    coverUrl: response.coverImageUrl ?? "",
    quote: toQuote(response.title),
    completedAt: response.completedAt,
  };
};

export const toMyReportView = (response: BookReviewListItemResponse): MyReportView => ({
  reportId: response.reviewId,
  bookTitle: response.bookTitle,
  coverUrl: response.coverImageUrl ?? "",
  reportTitle: response.title ?? REPORT_UNTITLED,
  // 마지막으로 저장한 날, 날짜만 내려오지 않는 예전 독후감은 수정 시각으로
  dateLabel: formatReportDate(response.reportDate ?? response.updatedAt),
  updatedAt: response.updatedAt,
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
  // 수정해서 저장하면 그날로 다시 기록됨
  dateLabel: formatReportDate(todayReportDate()),
  visibility: response.visibility ?? "PUBLIC",
});

export const toNewReportEditorView = (bookId: number, bookTitle: string): ReportEditorView => ({
  reportId: null,
  bookId,
  bookTitle,
  title: "",
  content: "",
  status: null,
  dateLabel: formatReportDate(todayReportDate()),
  visibility: "PUBLIC",
});

// 배너 날짜는 목록의 수정 시각, 목록에 없으면 완독일
export const toBannerDateLabel = (report: LatestReportView, updatedAt?: string) => {
  const tab = REPORT_STATUS_TABS.find((item) => (item.id === "DRAFT") === report.isDraft);

  if (updatedAt) return `${tab?.datePrefix} ${formatReportDate(updatedAt)}`;

  return report.completedAt ? `완독 ${formatReportDate(report.completedAt)}` : "";
};
