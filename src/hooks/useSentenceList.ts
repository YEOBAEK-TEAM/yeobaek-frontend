import { useQuery } from "@tanstack/react-query";

import { getSentenceList } from "@/api/sentence";

export const useSentenceList = (enabled = true, bookId?: number) => {
  return useQuery({
    queryKey: bookId === undefined ? ["highlights"] : ["highlights", bookId],
    queryFn: ({ signal }) => getSentenceList(bookId, signal),
    enabled,
  });
};
