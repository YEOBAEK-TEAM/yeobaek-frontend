import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSentenceMemo } from "@/api/sentence";

export const useUpdateSentenceMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sentenceId, memo }: { sentenceId: number; memo: string }) =>
      updateSentenceMemo(sentenceId, memo),
    onSuccess: async (sentence, { sentenceId }) => {
      const queryKey = ["highlight-detail", sentenceId];
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData(queryKey, sentence);
      await queryClient.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
};
