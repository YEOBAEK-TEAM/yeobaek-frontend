import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkContentPage, unbookmarkContentPage } from "@/api/contentPage";
import type { ContentPage } from "@/types/contentPage";

export const useTogglePageBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, bookmarked }: { pageId: number; bookmarked: boolean }) =>
      bookmarked ? unbookmarkContentPage(pageId) : bookmarkContentPage(pageId),
    onSuccess: async (_, { pageId, bookmarked }) => {
      const queryKey = ["content-pages", pageId];
      // A detail request started before this mutation must not overwrite its result.
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData<ContentPage>(queryKey, (page) =>
        page ? { ...page, bookmarked: !bookmarked } : page,
      );
      await queryClient.invalidateQueries({ queryKey: ["activity", "bookmarked-pages"] });
    },
  });
};
