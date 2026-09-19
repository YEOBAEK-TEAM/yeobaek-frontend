import { contentPageKeys } from "@/hooks/queryKeys/contentPageKeys";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { getContentChapter } from "@/api/contentPage";

export const contentChapterQueryOptions = (bookId: number, pageNumber: number) =>
  queryOptions({
    queryKey: contentPageKeys.chapter(bookId, pageNumber),
    queryFn: ({ signal }) => getContentChapter(bookId, pageNumber, signal),
    enabled:
      Number.isSafeInteger(bookId) &&
      bookId > 0 &&
      Number.isSafeInteger(pageNumber) &&
      pageNumber > 0,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

export const useContentChapter = (bookId: number, pageNumber: number) =>
  useQuery(contentChapterQueryOptions(bookId, pageNumber));
