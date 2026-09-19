import type { TrainingProgramId } from "@/types/training/trainingProgram";

// 방이 없으면 null, 4·5순위에 해당
export type TrainingRoomType = "TRAINING" | "UNDERSTAND";

export type TrainingRoomStatus = "IN_PROGRESS" | "COMPLETED";

export type TrainingRecommendResponse = {
  roomType: TrainingRoomType | null;
  roomId: number | null;
  bookId: number | null;
  bookTitle: string | null;
  // roomType이 TRAINING이거나 추천일 때만 채워짐
  reviewId: number | null;
  bookmarkId: number | null;
  status: TrainingRoomStatus | null;
};

export type TrainingStatus = "in-progress" | "completed" | "empty";

export type OngoingTraining = {
  roomId: number | null;
  reviewId: number | null;
  status: TrainingStatus;
  programId: TrainingProgramId | null;
  bookTitle: string | null;
};

// 배너 표시용 데이터
export type OngoingTrainingView = {
  label: string | null;
  title: string;
  description: string;
  character: string;
  characterClassName: string;
  // 이어서 진행할 수 있을 때만 노출
  actionLabel: string | null;
};
