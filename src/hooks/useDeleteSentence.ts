import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSentence } from "@/api/sentence";

export const useDeleteSentence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSentence,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["highlights"],
      });
    },
  });
};
