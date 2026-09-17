import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/auth";
import type {
  ActivityPageList,
  ActivityPageParams,
  LikedActivityBook,
  BookmarkedActivityBook,
} from "@/types/activity";

export const getLikedPages = async (
  params: ActivityPageParams = {},
  signal?: AbortSignal,
): Promise<ActivityPageList> => {
  const response = await api.get<ApiResponse<ActivityPageList>>("/api/v1/activity/page/likes", {
    params,
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getLikedPagesByBook = async (signal?: AbortSignal): Promise<LikedActivityBook[]> => {
  const response = await api.get<ApiResponse<LikedActivityBook[]>>(
    "/api/v1/activity/page/likes/book",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getBookmarkedPages = async (
  params: ActivityPageParams = {},
  signal?: AbortSignal,
): Promise<ActivityPageList> => {
  const response = await api.get<ApiResponse<ActivityPageList>>("/api/v1/activity/page/bookmarks", {
    params,
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getBookmarkedPagesByBook = async (
  signal?: AbortSignal,
): Promise<BookmarkedActivityBook[]> => {
  const response = await api.get<ApiResponse<BookmarkedActivityBook[]>>(
    "/api/v1/activity/page/bookmarks/book",
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
