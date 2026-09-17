import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getContentChapter } from "@/api/contentPage";

export const useContentChapter = (pageId: number) =>
  useQuery({
    queryKey: ["content-pages", "chapter", pageId],
    queryFn: ({ signal }) => getContentChapter(pageId, signal),
    enabled: Number.isSafeInteger(pageId) && pageId > 0,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
