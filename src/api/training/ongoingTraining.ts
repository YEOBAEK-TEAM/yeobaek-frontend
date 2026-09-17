import { mockOngoingTraining } from "@/mocks/training/ongoingTraining";

import type { OngoingTraining } from "@/types/training/ongoingTraining";

// API 연동 전 더미 응답, 추후 api.get<ApiResponse<OngoingTraining>>("/api/v1/trainings/ongoing")로 교체
export const getOngoingTraining = async (): Promise<OngoingTraining> => {
  return mockOngoingTraining;
};
