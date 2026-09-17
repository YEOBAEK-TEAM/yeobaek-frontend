import { mockLearningSummary, mockReadingReports } from "@/mocks/training/readingReports";

import type { LearningSummary, ReadingReport } from "@/types/training/readingReport";

// 독후감 목록 조회
export const getReadingReports = async (): Promise<ReadingReport[]> => {
  return mockReadingReports;
};

// 학습 요약 조회
export const getLearningSummary = async (): Promise<LearningSummary> => {
  return mockLearningSummary;
};
