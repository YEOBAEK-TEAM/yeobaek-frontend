import { mockOngoingTraining } from "@/mocks/training/ongoingTraining";

import type { OngoingTraining } from "@/types/training/ongoingTraining";

// 진행 중 훈련 조회
export const getOngoingTraining = async (): Promise<OngoingTraining> => {
  return mockOngoingTraining;
};
