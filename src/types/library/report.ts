export type BookReviewStatus = "DRAFT" | "PUBLISHED";

// PUBLIC이면 리티가 학습해 다른 사람의 다른 관점 보기에 요약이 노출됨
export type BookReviewVisibility = "PUBLIC" | "PRIVATE";

type BookReviewBase = {
  reviewId: number;
  bookId: number;
  bookTitle: string;
  title: string | null;
  status: BookReviewStatus;
  // 사용자가 달력에서 고른 날짜, 시간 없이 날짜만
  reportDate: string | null;
  writtenAt: string;
  updatedAt: string;
};

// 좋아요한 독후감이 앞, 그다음 최근 수정·작성순
export type BookReviewListItemResponse = BookReviewBase & {
  coverImageUrl: string | null;
  isLiked: boolean;
  likedAt: string | null;
};

export type BookReviewListResponse = {
  items: BookReviewListItemResponse[];
  // 0부터 시작하는 페이지 번호
  page: number;
  hasNext: boolean;
  totalCount: number;
};

export type BookReviewDetailResponse = BookReviewBase & {
  content: string | null;
  visibility: BookReviewVisibility | null;
};

// 작성 중 독후감이 있으면 그 독후감, 없으면 가장 최근 독후감
export type LatestBookReviewResponse = {
  reviewId: number;
  status: BookReviewStatus;
  title: string | null;
  bookId: number;
  bookTitle: string;
  author: string;
  coverImageUrl: string | null;
  genre: string | null;
  completedAt: string | null;
};

// 이미 독후감을 쓴 책도 포함, 책 한 권에 여러 번 작성 가능
export type UnlockedBookResponse = {
  bookId: number;
  bookTitle: string;
  author: string;
  coverImageUrl: string | null;
  quizPassedAt: string;
};

export type SaveBookReviewBody = {
  title: string;
  content: string;
  status: BookReviewStatus;
  reportDate: string;
  visibility: BookReviewVisibility;
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
  reportId: number;
  isDraft: boolean;
  title: string;
  subtitle: string;
  coverUrl: string;
  quote: string;
  completedAt: string | null;
};

export type MyReportView = {
  reportId: number;
  bookTitle: string;
  coverUrl: string;
  reportTitle: string;
  dateLabel: string;
  updatedAt: string;
  isLiked: boolean;
};

export type UnlockedBookView = {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
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
  visibility: BookReviewVisibility;
};

export type ReportFormValues = Pick<ReportEditorView, "title" | "content" | "visibility">;
