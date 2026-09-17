import { api } from "@/api/axios";

import type {
  SentenceHighlightListItemResponse,
  SentenceDetailResponse,
  HighlightRequest,
  HighlightResponse,
  HighlightColor,
} from "@/types/sentence";
import type { ApiResponse } from "@/types/auth";

export const getSentenceDetail = async (sentenceId: number, signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<SentenceDetailResponse>>(
    `/api/v1/highlights/${sentenceId}`,
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const createHighlight = async (body: HighlightRequest): Promise<HighlightResponse> => {
  const response = await api.post<ApiResponse<HighlightResponse>>("/api/v1/highlights", body);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const updateHighlightColor = async (
  sentenceId: number,
  color: HighlightColor,
): Promise<HighlightResponse> => {
  const response = await api.patch<ApiResponse<HighlightResponse>>(
    `/api/v1/highlights/${sentenceId}`,
    { color },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 수집한 문장 목록 조회
export const getSentenceList = async (
  bookId?: number,
  signal?: AbortSignal,
): Promise<SentenceHighlightListItemResponse[]> => {
  const response = await api.get<ApiResponse<SentenceHighlightListItemResponse[]>>(
    "/api/v1/highlights",
    {
      signal,
      params: {
        bookId,
      },
    },
  );

  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 수집한 문장 삭제
export const deleteSentence = async (sentenceId: number): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/api/v1/highlights/${sentenceId}`);
  if (!response.data.success) throw new Error(response.data.message);
};
