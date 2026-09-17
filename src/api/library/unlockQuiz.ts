import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type {
  CompleteReadingResponse,
  SubmitUnlockQuizRequest,
  SubmitUnlockQuizResponse,
  UnlockQuizResponse,
} from "@/types/library/unlockQuiz";

// 도서별 해금 퀴즈 조회, 없으면 서버에서 생성
export const getUnlockQuiz = async (
  bookId: number,
  signal?: AbortSignal,
): Promise<UnlockQuizResponse> => {
  const response = await api.get<ApiResponse<UnlockQuizResponse>>(`/api/v1/books/${bookId}/quiz`, {
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 퀴즈 답안 제출과 채점
export const submitUnlockQuiz = async ({
  bookId,
  body,
}: {
  bookId: number;
  body: SubmitUnlockQuizRequest;
}): Promise<SubmitUnlockQuizResponse> => {
  const response = await api.post<ApiResponse<SubmitUnlockQuizResponse>>(
    `/api/v1/books/${bookId}/quiz/submit`,
    body,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 책 완독 처리, 여러 번 호출해도 최초 완독 시각 유지
export const completeReading = async (bookId: number): Promise<CompleteReadingResponse> => {
  const response = await api.post<ApiResponse<CompleteReadingResponse>>(
    `/api/v1/reading-records/${bookId}/complete`,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
