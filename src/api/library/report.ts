import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type {
  BookReviewDetailResponse,
  BookReviewStatus,
  BookReviewListResponse,
  CreateBookReviewRequest,
  LatestBookReviewResponse,
  SaveBookReviewBody,
  UnlockedBookResponse,
} from "@/types/library/report";

// 내가 쓴 독후감 목록 조회, 임시저장 포함 좋아요 우선 10개씩
export const getBookReviews = async ({
  page,
  status,
  signal,
}: {
  page: number;
  status?: BookReviewStatus;
  signal?: AbortSignal;
}): Promise<BookReviewListResponse> => {
  const response = await api.get<ApiResponse<BookReviewListResponse>>("/api/v1/book-reviews", {
    params: { page, status },
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 서재 메인 배너용 독후감 조회, 독후감이 없으면 null
export const getLatestBookReview = async (
  signal?: AbortSignal,
): Promise<LatestBookReviewResponse | null> => {
  const response = await api.get<ApiResponse<LatestBookReviewResponse | null>>(
    "/api/v1/book-reviews/latest",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 독후감 작성이 해금된 책 조회
export const getUnlockedBooks = async (signal?: AbortSignal): Promise<UnlockedBookResponse[]> => {
  const response = await api.get<ApiResponse<UnlockedBookResponse[]>>(
    "/api/v1/book-reviews/unlocked",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getBookReviewDetail = async (
  reviewId: number,
  signal?: AbortSignal,
): Promise<BookReviewDetailResponse> => {
  const response = await api.get<ApiResponse<BookReviewDetailResponse>>(
    `/api/v1/book-reviews/${reviewId}`,
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 독후감 작성, status로 임시저장과 제출 구분
export const createBookReview = async (
  body: CreateBookReviewRequest,
): Promise<BookReviewDetailResponse> => {
  const response = await api.post<ApiResponse<BookReviewDetailResponse>>(
    "/api/v1/book-reviews",
    body,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const updateBookReview = async (
  reviewId: number,
  body: SaveBookReviewBody,
): Promise<BookReviewDetailResponse> => {
  const response = await api.patch<ApiResponse<BookReviewDetailResponse>>(
    `/api/v1/book-reviews/${reviewId}`,
    body,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const likeBookReview = async (reviewId: number): Promise<void> => {
  const response = await api.post<ApiResponse<null>>(`/api/v1/book-reviews/${reviewId}/like`);
  if (!response.data.success) throw new Error(response.data.message);
};

export const unlikeBookReview = async (reviewId: number): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/api/v1/book-reviews/${reviewId}/like`);
  if (!response.data.success) throw new Error(response.data.message);
};
