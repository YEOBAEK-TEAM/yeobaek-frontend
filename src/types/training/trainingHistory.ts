import type { TrainingProgramId } from "@/types/training/trainingProgram";

// 훈련 기록 목록 항목, 두 훈련이 같은 카드를 공유
export type TrainingHistoryItem = {
  roomId: number;
  programId: TrainingProgramId;
  title: string;
  subtitle: string;
  coverUrl: string;
  dateLabel: string;
};

export type TrainingHistoryTab = TrainingProgramId;
