export type CurrentReadingStatus = "READING" | "REVIEW_NEEDED";

// 읽을 책이 없으면 data가 null
export type CurrentReadingResponse = {
  status: CurrentReadingStatus;
  recordId: number;
  bookId: number;
  bookTitle: string;
  coverImageUrl: string | null;
  progressRate: number;
  remainingPages: number;
  completedAt: string | null;
};

export type RecommendedBookResponse = {
  bookId: number;
  title: string;
  author: string | null;
  publisher: string | null;
  coverImageUrl: string | null;
  createdAt: string | null;
};

export type ReadingProgressView = {
  bookId: number;
  bookTitle: string;
  coverUrl: string;
  percent: number;
  remainingPages: number;
};

export type ReportStatus = "writing" | "completed";

export type RecentReportView = {
  reportId: number;
  bookTitle: string;
  coverUrl: string;
  reportTitle: string;
  status: ReportStatus;
};

export type TodaySentence = {
  content: string;
  author: string;
  genre: string;
  bookTitle: string;
};

export type TasteBook = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  coverUrl: string;
};

export type FolderTabId = "reading" | "report";
