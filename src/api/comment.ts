import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/auth";
import type {
  Comment,
  CommentListResponse,
  CommentCursorParams,
  PageCommentParams,
  CreateCommentRequest,
  CommentContentRequest,
} from "@/types/comment";

const unwrap = <T>(response: { data: ApiResponse<T> }): T => {
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
const path = (pageId: number, commentId?: number) =>
  `/api/v1/page-comments/${pageId}${commentId === undefined ? "" : `/${commentId}`}`;

export const getPageComments = async (
  pageId: number,
  { sort = "LATEST", page = 0, size = 50, cursor }: PageCommentParams = {},
  signal?: AbortSignal,
) =>
  unwrap(
    await api.get<ApiResponse<CommentListResponse>>(path(pageId), {
      params: { sort, page, size, cursor },
      signal,
    }),
  );

export const createPageComment = async (pageId: number, body: CreateCommentRequest) =>
  unwrap(await api.post<ApiResponse<Comment>>(path(pageId), body));

export const getCommentReplies = async (
  pageId: number,
  commentId: number,
  params: CommentCursorParams = {},
  signal?: AbortSignal,
) =>
  unwrap(
    await api.get<ApiResponse<CommentListResponse>>(path(pageId, commentId), { params, signal }),
  );

export const createCommentReply = async (
  pageId: number,
  commentId: number,
  body: CommentContentRequest,
) => unwrap(await api.post<ApiResponse<Comment>>(path(pageId, commentId), body));
export const updatePageComment = async (
  pageId: number,
  commentId: number,
  body: CommentContentRequest,
) => unwrap(await api.patch<ApiResponse<Comment>>(path(pageId, commentId), body));
export const deletePageComment = async (pageId: number, commentId: number) =>
  unwrap(await api.delete<ApiResponse<string>>(path(pageId, commentId)));
export const updateCommentReply = async (
  pageId: number,
  commentId: number,
  replyId: number,
  body: CommentContentRequest,
) => unwrap(await api.patch<ApiResponse<Comment>>(`${path(pageId, commentId)}/${replyId}`, body));
export const deleteCommentReply = async (pageId: number, commentId: number, replyId: number) =>
  unwrap(await api.delete<ApiResponse<string>>(`${path(pageId, commentId)}/${replyId}`));

export const likeComment = async (pageId: number, commentId: number) =>
  unwrap(await api.post<ApiResponse<string>>(`${path(pageId, commentId)}/like`));
export const unlikeComment = async (pageId: number, commentId: number) =>
  unwrap(await api.delete<ApiResponse<string>>(`${path(pageId, commentId)}/like`));
export const dislikeComment = async (pageId: number, commentId: number) =>
  unwrap(await api.post<ApiResponse<string>>(`${path(pageId, commentId)}/dislike`));
export const undislikeComment = async (pageId: number, commentId: number) =>
  unwrap(await api.delete<ApiResponse<string>>(`${path(pageId, commentId)}/dislike`));

export const getMySentenceComments = async (
  sentenceId: number,
  params: CommentCursorParams = {},
  signal?: AbortSignal,
) =>
  unwrap(
    await api.get<ApiResponse<CommentListResponse>>(
      `/api/v1/page-comments/sentence/${sentenceId}`,
      { params, signal },
    ),
  );
