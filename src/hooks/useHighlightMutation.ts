import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHighlight, updateHighlightColor, deleteSentence } from "@/api/sentence";
import type {
  HighlightRequest,
  HighlightColor,
  SentenceHighlightListItemResponse,
} from "@/types/sentence";

type Action =
  | ({ type: "create" } & HighlightRequest)
  | { type: "color"; sentenceId: number; color: HighlightColor }
  | { type: "delete"; sentenceId: number };

export const useHighlightMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (action: Action) => {
      if (action.type === "delete") return deleteSentence(action.sentenceId).then(() => null);
      if (action.type === "color") return updateHighlightColor(action.sentenceId, action.color);
      return createHighlight({
        sentenceId: action.sentenceId,
        content: action.content,
        color: action.color,
      });
    },
    onSuccess: async (result, action) => {
      await client.cancelQueries({ queryKey: ["highlights"] });
      client.setQueriesData<SentenceHighlightListItemResponse[]>(
        { queryKey: ["highlights"] },
        (items) => {
          if (!items) return items;
          if (action.type === "delete")
            return items.filter((item) => item.sentenceId !== action.sentenceId);
          return items.map((item) =>
            item.sentenceId === action.sentenceId && result ? { ...item, ...result } : item,
          );
        },
      );
      // GET supplies book/page metadata for newly collected sentences as well.
      await client.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
};
