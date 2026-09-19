import type { Comment } from "@/types/comment";
import type { ContentChapterPage } from "@/types/contentPage";
import type { ReaderComment } from "../types/readerComment";

export const toReaderComment = (
  comment: Comment,
  {
    pageNumber,
    sentences,
    parentId,
    reply = false,
  }: {
    pageNumber: number;
    sentences: ContentChapterPage["sentences"];
    parentId?: number;
    reply?: boolean;
  },
): ReaderComment => ({
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
