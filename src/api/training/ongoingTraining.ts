import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type { TrainingRecommendResponse } from "@/types/training/ongoingTraining";

// 훈련 화면 상단 카드, 진행중 훈련부터 추천 독후감까지 우선순위대로 한 건
export const getOngoingTraining = async (
  signal?: AbortSignal,
): Promise<TrainingRecommendResponse> => {
  const response = await api.get<ApiResponse<TrainingRecommendResponse>>(
    "/api/v1/trainings/recommend",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
