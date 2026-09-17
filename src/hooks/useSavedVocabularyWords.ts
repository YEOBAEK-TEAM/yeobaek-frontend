import { useEffect, useMemo } from "react";
import { useVocabularyList } from "./useVocabularyList";
import { normalizeSavedWord } from "@/pages/library/utils/contentSavedWords";

export function useSavedVocabularyWords(active: boolean) {
  const query = useVocabularyList("", active);
  const { hasNextPage, isFetching, isError, fetchNextPage } = query;
  useEffect(() => {
    if (active && hasNextPage && !isFetching && !isError) void fetchNextPage();
  }, [active, hasNextPage, isFetching, isError, fetchNextPage]);
  const words = useMemo(
    () =>
      new Set(
        (query.data?.pages ?? []).flatMap((page) =>
          page.items.map((item) => normalizeSavedWord(item.word)),
        ),
      ),
    [query.data],
  );
  return {
    words,
    ready: query.isSuccess && !hasNextPage && !isFetching,
    isError,
    retry: query.refetch,
  };
}
