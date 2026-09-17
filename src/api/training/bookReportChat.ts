import type { ReadingReport } from "@/types/training/readingReport";

// 훈련 세션 시작
export const startBookReportSession = async (report: ReadingReport): Promise<{ id: string }> => {
  return { id: `mock-session-${report.reportId}` };
};

// 대화 내용 독후감 반영
export const applyChatToReport = async (): Promise<void> => {};

// 대화 저장 후 세션 종료
export const endBookReportSession = async (): Promise<void> => {};
