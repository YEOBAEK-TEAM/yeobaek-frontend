export type Comment = {
  commentId: number;
  pageId: number;
  sentenceId: number;
  userId: number;
  nickname: string;
  content: string;
  status: string;
  createdAt: string;
  parentCommentId: number;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
};

export type CommentListResponse = {
  comments: Comment[];
  nextCursor: number | null;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type CommentSort = "LATEST" | "POPULAR";
export type CommentCursorParams = { cursor?: number; size?: number };
export type PageCommentParams = CommentCursorParams & { sort?: CommentSort; page?: number };
export type CreateCommentRequest = { sentenceId: number; content: string };
export type CommentContentRequest = { content: string };
