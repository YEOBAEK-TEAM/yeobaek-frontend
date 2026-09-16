import { api } from "@/api/axios";

import type { SentenceHighlightListItemResponse } from "@/types/sentence";

type ApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T;
};

// 수집한 문장 목록 조회
export const getSentenceList = async (
  bookId?: number,
): Promise<SentenceHighlightListItemResponse[]> => {
  const response = await api.get<ApiResponse<SentenceHighlightListItemResponse[]>>(
    "/api/v1/highlights",
    {
      params: {
        bookId,
      },
    },
  );

  return response.data.data;
};

// 수집한 문장 삭제
export const deleteSentence = async (sentenceId: number): Promise<void> => {
  await api.delete(`/api/v1/highlights/${sentenceId}`);
};
