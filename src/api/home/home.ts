import { api } from "@/api/axios";
import { getMockTodaySentence } from "@/mocks/home/home";

import type { ApiResponse } from "@/types/auth";
import type {
  CurrentReadingResponse,
  RecommendedBookResponse,
  TodaySentence,
} from "@/types/home/home";

// 홈 배너에 보여줄 최근 읽은 책, 읽을 책이 없으면 null
export const getCurrentReading = async (
  signal?: AbortSignal,
): Promise<CurrentReadingResponse | null> => {
  const response = await api.get<ApiResponse<CurrentReadingResponse | null>>(
    "/api/v1/reading-records/current",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 읽은 책 장르 비율을 반영한 추천 10권, 내 서재에 있는 책은 제외
export const getRecommendedBooks = async (
  signal?: AbortSignal,
): Promise<RecommendedBookResponse[]> => {
  const response = await api.get<ApiResponse<RecommendedBookResponse[]>>(
    "/api/v1/reading-records/recommendations/last-read",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 대응 API가 없어 목데이터 유지
export const getTodaySentence = async (): Promise<TodaySentence> => {
  return getMockTodaySentence();
};
