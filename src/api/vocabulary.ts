import { api } from "@/api/axios";

import type { VocabularyListResponse } from "@/types/vocabulary";

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
