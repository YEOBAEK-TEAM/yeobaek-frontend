import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeContentPage, unlikeContentPage } from "@/api/contentPage";
import type { ContentPage } from "@/types/contentPage";

export const useTogglePageLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, liked }: { pageId: number; liked: boolean }) =>
      liked ? unlikeContentPage(pageId) : likeContentPage(pageId),
    onSuccess: async (_, { pageId, liked }) => {
      const queryKey = ["content-pages", pageId];
      // A detail request started before this mutation must not overwrite its result.
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData<ContentPage>(queryKey, (page) =>
        page ? { ...page, liked: !liked } : page,
      );
    },
  });
};
