export type ReadingProgress = {
  bookId: number;
  bookTitle: string;
  coverUrl: string;
  currentPage: number;
  totalPages: number;
};

export type ReportStatus = "writing" | "completed";

export type RecentReport = {
  reportId: number;
  bookId: number;
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
