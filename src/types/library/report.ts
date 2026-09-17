export type BookReviewStatus = "DRAFT" | "PUBLISHED";

export type BookReviewListItemResponse = {
  reviewId: number;
  bookId: number;
  bookTitle: string;
  title: string | null;
  status: BookReviewStatus;
  writtenAt: string;
  updatedAt: string;
};

export type BookReviewListResponse = {
  items: BookReviewListItemResponse[];
  // 0부터 시작하는 페이지 번호
  page: number;
  hasNext: boolean;
  totalCount: number;
};

export type BookReviewDetailResponse = BookReviewListItemResponse & {
  content: string | null;
};

// 작성 중 독후감이 있으면 그 책, 없으면 가장 최근 독후감의 책
export type LatestBookReviewResponse = {
  bookTitle: string;
  author: string;
  completedAt: string | null;
};

// 해금됐지만 아직 독후감을 쓰지 않은 책
export type UnlockedBookResponse = {
  bookId: number;
  bookTitle: string;
  quizPassedAt: string;
};

export type SaveBookReviewBody = {
  title: string;
  content: string;
  status: BookReviewStatus;
};

export type CreateBookReviewRequest = SaveBookReviewBody & {
  bookId: number;
};

// 새 독후감이면 reviewId가 null
export type SaveBookReviewRequest = SaveBookReviewBody & {
  reviewId: number | null;
  bookId: number;
};

export type LatestReportView = {
  title: string;
  subtitle: string;
  completedLabel: string;
};

export type MyReportView = {
  reportId: number;
  bookTitle: string;
  dateLabel: string;
  quote: string;
  isDraft: boolean;
};

export type UnlockedBookView = {
  bookId: number;
  title: string;
  unlockedAt: string;
  unlockedLabel: string;
};

export type ReportEditorView = {
  reportId: number | null;
  bookId: number;
  bookTitle: string;
  title: string;
  content: string;
  status: BookReviewStatus | null;
  dateLabel: string;
};

export type ReportFormValues = Pick<ReportEditorView, "title" | "content">;
