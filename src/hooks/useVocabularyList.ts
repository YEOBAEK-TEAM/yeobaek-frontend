import { useQuery } from "@tanstack/react-query";

import { getVocabularyList } from "@/api/vocabulary";

export const useVocabularyList = (choseong: string, enabled = true) => {
  return useQuery({
    queryKey: ["vocabularies", choseong],
    queryFn: () =>
      getVocabularyList({
        choseong,
        page: 0,
      }),
    enabled,
  });
};
