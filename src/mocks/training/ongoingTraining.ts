import type { OngoingTraining } from "@/types/training/ongoingTraining";

// 배너 상태별 확인용 목데이터
export const mockOngoingTrainings = {
  bookReportInProgress: {
    trainingId: 1,
    status: "in-progress",
    programId: "book-report",
    bookTitle: "데미안",
  },
  comprehensionInProgress: {
    trainingId: 2,
    status: "in-progress",
    programId: "comprehension",
    bookTitle: "급류",
  },
  bookReportCompleted: {
    trainingId: 3,
    status: "completed",
    programId: "book-report",
    bookTitle: "급류",
  },
  comprehensionCompleted: {
    trainingId: 4,
    status: "completed",
    programId: "comprehension",
    bookTitle: "급류",
  },
  empty: {
    trainingId: null,
    status: "empty",
    programId: null,
    bookTitle: null,
  },
} satisfies Record<string, OngoingTraining>;

export const mockOngoingTraining: OngoingTraining = mockOngoingTrainings.bookReportInProgress;
