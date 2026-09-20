import type { TrainingProgramId } from "@/types/training/trainingProgram";

export type TrainingStatus = "in-progress" | "completed";

// 훈련 종류별 최근 방 하나
export type OngoingTraining = {
  roomId: number;
  // 같은 내용으로 다시 시작하는지 판단하는 값
  targetKey: string;
  status: TrainingStatus;
  programId: TrainingProgramId;
  bookTitle: string;
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
