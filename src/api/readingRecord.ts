import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type {
  AddReadingRecordResponse,
  ReadingRecordList,
  ReadingRecordParams,
  UpdateReadingProgressRequest,
  UpdateReadingProgressResponse,
} from "@/types/readingRecord";

export const updateReadingProgress = async (
  bookId: number,
  pageId: number,
): Promise<UpdateReadingProgressResponse> => {
  const body: UpdateReadingProgressRequest = { pageId };
  const response = await api.patch<ApiResponse<UpdateReadingProgressResponse>>(
    `/api/v1/reading-records/${bookId}/progress`,
    body,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const addReadingRecord = async (bookId: number): Promise<AddReadingRecordResponse> => {
  const response = await api.post<ApiResponse<AddReadingRecordResponse>>(
    "/api/v1/reading-records",
    {
      bookId,
    },
  );

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getReadingRecords = async (
  { status = "ALL", cursor, size = 20 }: ReadingRecordParams = {},
  signal?: AbortSignal,
): Promise<ReadingRecordList> => {
  const response = await api.get<ApiResponse<ReadingRecordList>>("/api/v1/reading-records", {
    params: { status, cursor, size },
    signal,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};
