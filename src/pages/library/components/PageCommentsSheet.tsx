import { useState } from "react";

import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/common/toast";

import {
  uniqueComments,
  usePageComments,
  useCommentReplies,
  useCommentMutation,
} from "@/hooks/useComments";

import type { Comment, CommentSort } from "@/types/comment";
import type { ContentChapterPage } from "@/types/contentPage";
import type { ReaderComment } from "../utils/useReaderData";

import ReaderCommentsSheet from "./ReaderCommentsSheet";

export default function PageCommentsSheet({
  pageId,
  pageNumber,
  commentCount,
  sentences,
  onClose,
}: {
  pageId: number;
  pageNumber: number;
  commentCount: number;
  sentences: ContentChapterPage["sentences"];
  onClose: () => void;
}) {
  const userId = useAuthStore((state) => state.userId);
  const showToast = useToastStore((state) => state.showToast);

  const [sort, setSort] = useState<CommentSort>("LATEST");
  const [parentId, setParentId] = useState<number>();

  // Only successful actions in this open sheet are known;
  // no server reaction flag exists.
  const [reactions, setReactions] = useState<
    Record<string, Partial<Record<"like" | "dislike", boolean>>>
  >({});

  const commentsQuery = usePageComments(pageId, sort);
  const repliesQuery = useCommentReplies(pageId, parentId ?? NaN);
  const mutation = useCommentMutation();

  const comments = uniqueComments(commentsQuery.data?.pages);
  const replies = uniqueComments(repliesQuery.data?.pages);

  const query = parentId === undefined ? commentsQuery : repliesQuery;

  const find = (id: string) =>
    [...comments, ...replies].find((item) => String(item.commentId) === id);

  const toView = (comment: Comment, reply = false): ReaderComment => ({
    id: String(comment.commentId),
    page: pageNumber,
    text: comment.content,
    createdAt: comment.createdAt,
    quote:
      reply || comment.sentenceId == null
        ? undefined
        : sentences.find((sentence) => sentence.sentenceId === comment.sentenceId)?.content,

    user: {
      id: comment.userId,
      nickname: comment.nickname,
      profileImage: comment.profileImageUrl,
    },

    likes: comment.likeCount,
    dislikes: comment.dislikeCount,
    replyCount: comment.replyCount,

    ...(reply
      ? {
          parentCommentId: String(parentId),
        }
      : {}),
  });

  return (
    <ReaderCommentsSheet
      comments={comments.map((item) => toView(item))}
      replies={replies.map((item) => toView(item, true))}
      pageNumber={pageNumber}
      onClose={onClose}
      reportedCommentIds={[]}
      onReport={() => {}}
      onSubmit={async (content, replyTo) => {
        if (replyTo === undefined) {
          const success = await mutation.run({ type: "create", pageId, content });
          if (success) showToast("댓글이 등록되었습니다.", "success");
          return success;
        }
        const parent = replyTo && find(replyTo);

        if (!parent) return false;

        return mutation.run({
          type: "reply",
          pageId,
          sentenceId: parent.sentenceId,
          commentId: parent.commentId,
          content,
        });
      }}
      onEdit={async (id, content) => {
        const item = find(id);

        if (!item || item.userId !== userId) return false;

        const base = {
          pageId,
          sentenceId: item.sentenceId,
          content,
        };

        return parentId !== undefined && replies.some((reply) => reply.commentId === item.commentId)
          ? mutation.run({
              ...base,
              type: "editReply",
              commentId: parentId,
              replyId: item.commentId,
            })
          : mutation.run({
              ...base,
              type: "edit",
              commentId: item.commentId,
            });
      }}
      onDelete={async (id) => {
        const item = find(id);

        if (!item || item.userId !== userId) return false;

        const base = {
          pageId,
          sentenceId: item.sentenceId,
        };

        return parentId !== undefined && replies.some((reply) => reply.commentId === item.commentId)
          ? mutation.run({
              ...base,
              type: "deleteReply",
              commentId: parentId,
              replyId: item.commentId,
            })
          : mutation.run({
              ...base,
              type: "delete",
              commentId: item.commentId,
            });
      }}
      onVote={async (id, vote) => {
        const item = find(id);

        if (!item) return;

        const cancel = reactions[id]?.[vote] === true;

        const type = cancel ? (vote === "like" ? "unlike" : "undislike") : vote;

        if (
          await mutation.run({
            type,
            pageId,
            sentenceId: item.sentenceId,
            commentId: item.commentId,
            parentCommentId: replies.some((reply) => reply.commentId === item.commentId)
              ? parentId
              : undefined,
          })
        ) {
          setReactions((previous) => ({
            ...previous,
            [id]: {
              ...previous[id],
              [vote]: !cancel,
              ...(!cancel ? { [vote === "like" ? "dislike" : "like"]: false } : {}),
            },
          }));
        }
      }}
      apiState={{
        currentUserId: userId,
        pending: mutation.isPending,
        loading: query.isPending,
        error: query.isError || mutation.isError,

        onRetry: () => {
          void query.refetch();
        },

        hasNext: query.hasNextPage,
        loadingMore: query.isFetchingNextPage,

        onLoadMore: () => {
          if (!query.isFetching) {
            void query.fetchNextPage();
          }
        },

        onSortChange: setSort,

        onThreadChange: (id) => {
          setParentId(id === undefined ? undefined : Number(id));

          mutation.reset();
        },

        reaction: (id, vote) => reactions[id]?.[vote],

        total: commentCount,
      }}
    />
  );
}
