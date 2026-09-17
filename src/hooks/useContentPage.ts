import { useQuery } from "@tanstack/react-query";
import { getContentPage } from "@/api/contentPage";

export const useContentPage = (pageId: number) =>
  useQuery({
    queryKey: ["content-pages", pageId],
    queryFn: ({ signal }) => getContentPage(pageId, signal),
    enabled: Number.isSafeInteger(pageId) && pageId > 0,
  });
