import type { TrainingProgramId } from "@/types/training/trainingProgram";

export type TrainingStatus = "in-progress" | "completed" | "empty";

export type OngoingTraining = {
  trainingId: number | null;
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
};
