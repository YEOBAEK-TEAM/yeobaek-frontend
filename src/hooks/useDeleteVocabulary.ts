import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteVocabulary } from "@/api/vocabulary";

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVocabulary,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["vocabularies"],
      });
    },
  });
};
