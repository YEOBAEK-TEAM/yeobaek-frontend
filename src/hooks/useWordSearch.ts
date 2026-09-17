import { useQuery } from "@tanstack/react-query";
import { searchWord } from "@/api/vocabulary";

export const useWordSearch = (word: string, sentenceId: number) =>
  useQuery({
    queryKey: ["word-search", sentenceId, word],
    queryFn: ({ signal }) => searchWord(word, sentenceId, signal),
    enabled: !!word.trim() && Number.isSafeInteger(sentenceId) && sentenceId > 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
