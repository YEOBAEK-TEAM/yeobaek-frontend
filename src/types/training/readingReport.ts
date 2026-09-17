export type ReadingReport = {
  reportId: number;
  bookId: number;
  bookTitle: string;
  coverUrl: string;
  reportTitle: string;
  createdAt: string;
};

export type ReportSortOrder = "latest" | "oldest";

export type LearningSummary = {
  bookTitle: string;
  topic: string;
  growthPoint: string;
};
