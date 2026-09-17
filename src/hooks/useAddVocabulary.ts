import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addVocabulary } from "@/api/vocabulary";

export const useAddVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVocabulary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vocabularies"] }),
  });
};
