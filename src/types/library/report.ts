export type DraftReportResponse = {
  reportId: number;
  bookId: number;
  bookTitle: string;
  // 저자와 장르를 합친 표기, 예: 유혜영 장편소설
  bookSubtitle: string;
  coverUrl: string;
  completedAt: string;
};

export type MyReportResponse = {
  reportId: number;
  bookId: number;
  bookTitle: string;
  coverUrl: string;
  reportTitle: string;
  createdAt: string;
  isLiked: boolean;
  // 작성 중인 독후감이 없을 때 상단 배너 표시용
  bookSubtitle: string;
  completedAt: string;
};

// 독후감을 쓸 수 있게 해금된 책, 이미 쓴 책도 남아 여러 번 작성 가능
export type UnlockedBookResponse = {
  bookId: number;
  bookTitle: string;
  author: string;
  coverUrl: string;
  unlockedAt: string;
};

export type UnlockedBookSortOrder = "latest" | "oldest";

// 새 독후감이면 reportId가 null
export type ReportEditorResponse = {
  reportId: number | null;
  bookId: number;
  bookTitle: string;
  title: string;
  reportDate: string;
  content: string;
};

export type ReportFormValues = Pick<ReportEditorResponse, "title" | "reportDate" | "content">;

export type SaveReportRequest = ReportFormValues & {
  reportId: number | null;
  bookId: number;
};

export type SaveReportResponse = {
  reportId: number;
};

export type DraftReportView = {
  reportId: number;
  title: string;
  subtitle: string;
  coverUrl: string;
  completedLabel: string;
  // 완료된 독후감을 보여줄 때만 있는 독후감 부제목
  quote?: string;
};

export type MyReportView = {
  reportId: number;
  bookTitle: string;
  coverUrl: string;
  dateLabel: string;
  quote: string;
  isLiked: boolean;
};

export type UnlockedBookView = {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  unlockedAt: string;
  unlockedLabel: string;
};
