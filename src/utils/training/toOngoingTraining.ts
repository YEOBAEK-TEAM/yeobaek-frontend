import type { OngoingTraining, TrainingRecommendResponse } from "@/types/training/ongoingTraining";

const PROGRAM_ID = {
  TRAINING: "book-report",
  UNDERSTAND: "comprehension",
} as const;

// 방이 없으면 추천만 있거나 아무것도 없는 상태
export const toOngoingTraining = (response: TrainingRecommendResponse): OngoingTraining => ({
  roomId: response.roomId,
  reviewId: response.reviewId,
  status:
    response.roomType === null || response.status === null
      ? "empty"
      : response.status === "IN_PROGRESS"
        ? "in-progress"
        : "completed",
  programId: response.roomType ? PROGRAM_ID[response.roomType] : null,
  bookTitle: response.bookTitle,
});
