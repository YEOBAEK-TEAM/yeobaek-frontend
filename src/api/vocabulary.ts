import { api } from "@/api/axios";

import type {
  VocabularyDetailResponse,
  VocabularyListResponse,
  WordSearchResponse,
  AddVocabularyRequest,
} from "@/types/vocabulary";
import type { ApiResponse } from "@/types/auth";

export const searchWord = async (
  word: string,
  sentenceId: number,
  signal?: AbortSignal,
): Promise<WordSearchResponse> => {
  const response = await api.get<ApiResponse<WordSearchResponse>>("/api/v1/words", {
    params: { word, sentenceId },
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const addVocabulary = async (
  snapshot: AddVocabularyRequest,
): Promise<VocabularyDetailResponse> => {
  const response = await api.post<ApiResponse<VocabularyDetailResponse>>(
    "/api/v1/vocabularies",
    snapshot,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

type GetVocabularyListParams = {
  choseong?: string;
  page?: number;
};

// 단어장 목록 조회
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

// 단어 상세 조회
export const getVocabularyDetail = async (
  vocabularyId: number,
): Promise<VocabularyDetailResponse> => {
  const response = await api.get<ApiResponse<VocabularyDetailResponse>>(
    `/api/v1/vocabularies/${vocabularyId}`,
  );

  return response.data.data;
};

// 단어 삭제
export const deleteVocabulary = async (vocabularyId: number): Promise<void> => {
  await api.delete(`/api/v1/vocabularies/${vocabularyId}`);
};
