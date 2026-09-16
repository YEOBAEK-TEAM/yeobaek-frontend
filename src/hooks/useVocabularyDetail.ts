import { useQuery } from "@tanstack/react-query";

import { getVocabularyDetail } from "@/api/vocabulary";

export const useVocabularyDetail = (vocabularyId: number) => {
  return useQuery({
    queryKey: ["vocabularies", "detail", vocabularyId],
    queryFn: () => getVocabularyDetail(vocabularyId),
    enabled: vocabularyId > 0,
  });
};
