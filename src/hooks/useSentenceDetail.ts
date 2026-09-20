import { useQuery } from "@tanstack/react-query";
import { getSentenceDetail } from "@/api/sentence";

export const useSentenceDetail = (sentenceId?: number | null) =>
  useQuery({
    // Keep detail objects separate from the highlight-list cache updates.
    queryKey: ["highlight-detail", sentenceId],
    queryFn: ({ signal }) => getSentenceDetail(sentenceId!, signal),
    enabled: typeof sentenceId === "number" && Number.isInteger(sentenceId) && sentenceId > 0,
    retry: false,
  });
