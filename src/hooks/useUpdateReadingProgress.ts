import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReadingProgress } from "@/api/readingRecord";

export const useUpdateReadingProgress = (bookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["reading-progress", bookId],
    scope: { id: `reading-progress:${bookId}` },
    mutationFn: (pageId: number) => updateReadingProgress(bookId, pageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-records"] }),
  });
};
