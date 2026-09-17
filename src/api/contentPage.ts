import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/auth";
import type { ContentChapter, ContentPage } from "@/types/contentPage";

export const likeContentPage = async (pageId: number): Promise<string> => {
  const response = await api.post<ApiResponse<string>>(`/api/v1/cutton-pages/${pageId}/like`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const unlikeContentPage = async (pageId: number): Promise<string> => {
  const response = await api.delete<ApiResponse<string>>(`/api/v1/cutton-pages/${pageId}/like`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const bookmarkContentPage = async (pageId: number): Promise<string> => {
  const response = await api.post<ApiResponse<string>>(`/api/v1/cutton-pages/${pageId}/bookmark`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const unbookmarkContentPage = async (pageId: number): Promise<string> => {
  const response = await api.delete<ApiResponse<string>>(`/api/v1/cutton-pages/${pageId}/bookmark`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getContentPage = async (
  pageId: number,
  signal?: AbortSignal,
): Promise<ContentPage> => {
  const response = await api.get<ApiResponse<ContentPage>>(`/api/v1/cutton-pages/${pageId}`, {
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getContentChapter = async (
  pageId: number,
  signal?: AbortSignal,
): Promise<ContentChapter> => {
  const response = await api.get<ApiResponse<ContentChapter>>(
    `/api/v1/cutton-pages/${pageId}/chapter`,
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
