import { useInfiniteQuery } from "@tanstack/react-query";

import { getVocabularyList } from "@/api/vocabulary";

export const useVocabularyList = (choseong: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ["vocabularies", choseong],

    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      getVocabularyList({
        choseong,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),

    enabled,
  });
};
