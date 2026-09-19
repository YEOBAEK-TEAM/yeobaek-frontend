import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type {
  OtherPerspectiveResponse,
  SendTrainingMessageRequest,
  SendTrainingMessageResponse,
  StartTrainingResponse,
  TrainingRoomListResponse,
  TrainingMessageListResponse,
  TrainingReviewItemResponse,
  TrainingReviewListResponse,
  TrainingSummationResponse,
} from "@/types/training/bookReportTraining";

// AI 응답을 기다리는 요청만 길게 대기
const AI_REQUEST_TIMEOUT_MS = 60_000;

const MESSAGE_PAGE_SIZE = 50;

// 훈련방 생성과 첫 질문 생성이 한 요청
export const startTraining = async (reviewId: number): Promise<StartTrainingResponse> => {
  const response = await api.post<ApiResponse<StartTrainingResponse>>(
    `/api/v1/trainings/${reviewId}`,
    undefined,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 다른 관점 보기, 선택과 관점 카드가 모두 이력에 남음
export const showOtherPerspective = async (
  trainingRoomId: number,
): Promise<OtherPerspectiveResponse[]> => {
  const response = await api.post<ApiResponse<OtherPerspectiveResponse[]>>(
    `/api/v1/trainings/${trainingRoomId}/other-perspective`,
    undefined,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 괜찮아요, 요약 미리보기만 받고 저장은 요약 생성에서 처리
export const skipOtherPerspective = async (
  trainingRoomId: number,
): Promise<TrainingSummationResponse> => {
  const response = await api.post<ApiResponse<TrainingSummationResponse>>(
    `/api/v1/trainings/${trainingRoomId}/skip-perspective`,
    undefined,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getTrainingMessages = async ({
  trainingRoomId,
  cursor,
  signal,
}: {
  trainingRoomId: number;
  cursor: number | null;
  signal?: AbortSignal;
}): Promise<TrainingMessageListResponse> => {
  const response = await api.get<ApiResponse<TrainingMessageListResponse>>(
    `/api/v1/trainings/${trainingRoomId}/messages`,
    { params: { cursor: cursor ?? undefined, size: MESSAGE_PAGE_SIZE }, signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 내 메시지 저장 후 AI 답변 생성까지 한 번에 처리
export const sendTrainingMessage = async ({
  trainingRoomId,
  content,
  signal,
}: SendTrainingMessageRequest): Promise<SendTrainingMessageResponse> => {
  const response = await api.post<ApiResponse<SendTrainingMessageResponse>>(
    `/api/v1/trainings/${trainingRoomId}/messages`,
    { content, type: "TEXT" },
    { signal, timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 방마다 한 번만 생성, 이미 있으면 409
export const createTrainingSummation = async (
  trainingRoomId: number,
): Promise<TrainingSummationResponse> => {
  const response = await api.post<ApiResponse<TrainingSummationResponse>>(
    `/api/v1/trainings/${trainingRoomId}/summation`,
    undefined,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 아직 만들지 않았으면 404
export const getTrainingSummation = async (
  trainingRoomId: number,
  signal?: AbortSignal,
): Promise<TrainingSummationResponse> => {
  const response = await api.get<ApiResponse<TrainingSummationResponse>>(
    `/api/v1/trainings/${trainingRoomId}/summation`,
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 최근 생성순, 같은 종류의 진행 중 방은 하나뿐이라 첫 항목이 가장 최신 상태
export const getTrainingRooms = async (signal?: AbortSignal): Promise<TrainingRoomListResponse> => {
  const response = await api.get<ApiResponse<TrainingRoomListResponse>>("/api/v1/trainings/list", {
    params: { size: 1 },
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 훈련할 독후감 목록 조회, 작성 완료한 것만
export const getTrainingReviews = async (
  page: number,
  signal?: AbortSignal,
): Promise<TrainingReviewListResponse> => {
  const response = await api.get<ApiResponse<TrainingReviewListResponse>>("/api/v1/book-reviews", {
    params: { page, status: "PUBLISHED" },
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 분석 카드와 상단 고정 영역용 독후감 조회
export const getTrainingReview = async (
  reviewId: number,
  signal?: AbortSignal,
): Promise<TrainingReviewItemResponse> => {
  const response = await api.get<ApiResponse<TrainingReviewItemResponse>>(
    `/api/v1/book-reviews/${reviewId}`,
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
