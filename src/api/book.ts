import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/auth";
import type { BookDetail, BookSearchResult } from "@/types/book";

export const searchBooks = async (
  keyword: string,
  signal?: AbortSignal,
): Promise<BookSearchResult[]> => {
  const response = await api.get<ApiResponse<BookSearchResult[]>>("/api/v1/books/search", {
    params: { keyword },
    signal,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getBookDetail = async (bookId: number, signal?: AbortSignal): Promise<BookDetail> => {
  const response = await api.get<ApiResponse<BookDetail>>(`/api/v1/books/${bookId}`, { signal });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
