import { api } from "@/api/axios";

import type { VocabularyDetailResponse, VocabularyListResponse } from "@/types/vocabulary";

type ApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T;
};

type GetVocabularyListParams = {
  choseong?: string;
  page?: number;
};

export const getVocabularyList = async ({
  choseong,
  page = 0,
}: GetVocabularyListParams): Promise<VocabularyListResponse> => {
  const response = await api.get<ApiResponse<VocabularyListResponse>>("/api/v1/vocabularies", {
    params: {
      choseong,
      page,
    },
  });

  return response.data.data;
};

export const getVocabularyDetail = async (
  vocabularyId: number,
): Promise<VocabularyDetailResponse> => {
  const response = await api.get<ApiResponse<VocabularyDetailResponse>>(
    `/api/v1/vocabularies/${vocabularyId}`,
  );

  return response.data.data;
};
