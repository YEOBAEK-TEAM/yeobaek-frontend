import { useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/comment";
import type { CommentListResponse, CommentSort } from "@/types/comment";

export const commentKeys = {
  page: (pageId: number) => ["page-comments", pageId] as const,
  replies: (pageId: number, commentId: number) =>
    ["page-comments", "replies", pageId, commentId] as const,
  sentence: (sentenceId: number) => ["page-comments", "sentence", sentenceId] as const,
};
const validId = (id: number) => Number.isSafeInteger(id) && id > 0;
const nextCursor = (
  last: CommentListResponse,
  _pages: CommentListResponse[],
  cursor: number | undefined,
  cursors: (number | undefined)[],
) =>
  last.hasNext &&
  last.nextCursor !== null &&
  last.nextCursor !== cursor &&
  !cursors.includes(last.nextCursor)
    ? last.nextCursor
    : undefined;

export const usePageComments = (pageId: number, sort: CommentSort = "LATEST", enabled = true) =>
  useInfiniteQuery({
    queryKey: [...commentKeys.page(pageId), sort],
    queryFn: ({ pageParam, signal }) =>
      api.getPageComments(
        pageId,
        sort === "POPULAR" ? { sort, page: pageParam } : { sort, cursor: pageParam },
        signal,
      ),
    initialPageParam: (sort === "POPULAR" ? 0 : undefined) as number | undefined,
    getNextPageParam: (last, pages, param, params) =>
      sort === "POPULAR"
        ? last.hasNext
          ? last.page + 1
          : undefined
        : nextCursor(last, pages, param, params),
    enabled: enabled && validId(pageId),
  });

export const useCommentReplies = (pageId: number, commentId: number) =>
  useInfiniteQuery({
    queryKey: commentKeys.replies(pageId, commentId),
    queryFn: ({ pageParam, signal }) =>
      api.getCommentReplies(pageId, commentId, { cursor: pageParam, size: 50 }, signal),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: nextCursor,
    enabled: validId(pageId) && validId(commentId),
  });

export const useMySentenceComments = (sentenceId: number, enabled = true) =>
  useInfiniteQuery({
    queryKey: commentKeys.sentence(sentenceId),
    queryFn: ({ pageParam, signal }) =>
      api.getMySentenceComments(sentenceId, { cursor: pageParam, size: 50 }, signal),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: nextCursor,
    enabled: enabled && validId(sentenceId),
  });

export const uniqueComments = (pages?: CommentListResponse[]) => [
  ...new Map(
    pages?.flatMap((page) => page.comments).map((comment) => [comment.commentId, comment]),
  ).values(),
];

type CommentAction = { pageId: number; sentenceId?: number | null } & (
  | { type: "create"; content: string }
  | { type: "reply" | "edit"; commentId: number; content: string }
  | { type: "delete"; commentId: number }
  | { type: "editReply"; commentId: number; replyId: number; content: string }
  | { type: "deleteReply"; commentId: number; replyId: number }
  | {
      type: "like" | "unlike" | "dislike" | "undislike";
      commentId: number;
      parentCommentId?: number;
    }
);

export const useCommentMutation = () => {
  const client = useQueryClient();
  const pending = useRef(false);
  const mutation = useMutation({
    mutationFn: async (action: CommentAction) => {
      const { pageId } = action;
      switch (action.type) {
        case "create":
          return api.createPageComment(pageId, {
            ...(action.sentenceId != null ? { sentenceId: action.sentenceId } : {}),
            content: action.content,
          });
        case "reply":
          return api.createCommentReply(pageId, action.commentId, { content: action.content });
        case "edit":
          return api.updatePageComment(pageId, action.commentId, { content: action.content });
        case "delete":
          return api.deletePageComment(pageId, action.commentId);
        case "editReply":
          return api.updateCommentReply(pageId, action.commentId, action.replyId, {
            content: action.content,
          });
        case "deleteReply":
          return api.deleteCommentReply(pageId, action.commentId, action.replyId);
        case "like":
          return api.likeComment(pageId, action.commentId);
        case "unlike":
          return api.unlikeComment(pageId, action.commentId);
        case "dislike":
          return api.dislikeComment(pageId, action.commentId);
        case "undislike":
          return api.undislikeComment(pageId, action.commentId);
      }
    },
    onSuccess: async (_result, action) => {
      const updates = [client.invalidateQueries({ queryKey: commentKeys.page(action.pageId) })];
      updates.push(client.invalidateQueries({ queryKey: ["activity", "liked-comments"] }));
      if (action.sentenceId != null)
        updates.push(
          client.invalidateQueries({ queryKey: commentKeys.sentence(action.sentenceId) }),
        );
      if ("commentId" in action)
        updates.push(
          client.invalidateQueries({
            queryKey: commentKeys.replies(
              action.pageId,
              "parentCommentId" in action
                ? (action.parentCommentId ?? action.commentId)
                : action.commentId,
            ),
          }),
        );
      if (["create", "reply", "delete", "deleteReply"].includes(action.type)) {
        // Refetch the existing page detail (including commentCount when supplied).
        updates.push(
          client.invalidateQueries({ queryKey: ["content-pages", action.pageId], exact: true }),
        );
      }
      await Promise.all(updates);
    },
  });
  const run = async (action: CommentAction) => {
    if (pending.current) return false;
    pending.current = true;
    try {
      await mutation.mutateAsync(action);
      return true;
    } catch {
      return false;
    } finally {
      pending.current = false;
    }
  };
  return { run, isPending: mutation.isPending, isError: mutation.isError, reset: mutation.reset };
};
