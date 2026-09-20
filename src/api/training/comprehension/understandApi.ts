import { api } from "@/api/axios";

import type { ApiResponse } from "@/types/auth";
import type {
  BookmarkListResponse,
  UnderstandMessageListResponse,
  UnderstandMessageResponse,
  UnderstandRoomListResponse,
  UnderstandStartResponse,
  UnderstandSummationResponse,
} from "@/types/training/comprehension";

// AI 응답을 기다리는 요청만 길게 대기
const AI_REQUEST_TIMEOUT_MS = 60_000;

const MESSAGE_PAGE_SIZE = 50;

const BOOKMARK_PAGE_SIZE = 20;

// 연속된 페이지가 한 묶음으로 내려와 그대로 훈련 범위가 됨
export const getBookmarks = async ({
  cursorSavedAt,
  cursorId,
  signal,
}: {
  cursorSavedAt?: string;
  cursorId?: number;
  signal?: AbortSignal;
}): Promise<BookmarkListResponse> => {
  const response = await api.get<ApiResponse<BookmarkListResponse>>(
    "/api/v1/activity/page/bookmarks",
    { params: { cursorSavedAt, cursorId, size: BOOKMARK_PAGE_SIZE }, signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 방 생성과 첫 질문·예시 질문 생성이 한 요청
export const createUnderstandRoom = async (
  targetIds: number[],
): Promise<UnderstandStartResponse> => {
  const response = await api.post<ApiResponse<UnderstandStartResponse>>(
    "/api/v1/understand",
    { targetIds },
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getUnderstandMessages = async ({
  understandRoomId,
  cursor,
  signal,
}: {
  understandRoomId: number;
  cursor: number | null;
  signal?: AbortSignal;
}): Promise<UnderstandMessageListResponse> => {
  const response = await api.get<ApiResponse<UnderstandMessageListResponse>>(
    `/api/v1/understand/${understandRoomId}/messages`,
    { params: { cursor: cursor ?? undefined, size: MESSAGE_PAGE_SIZE }, signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 내 메시지 저장 후 AI 답변 생성까지 한 번에 처리
export const sendUnderstandMessage = async ({
  understandRoomId,
  content,
  signal,
}: {
  understandRoomId: number;
  content: string;
  signal?: AbortSignal;
}): Promise<UnderstandMessageResponse> => {
  const response = await api.post<ApiResponse<UnderstandMessageResponse>>(
    `/api/v1/understand/${understandRoomId}/messages`,
    { content, type: "TEXT" },
    { signal, timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 아직 만들지 않았으면 404
export const getUnderstandSummation = async (
  understandRoomId: number,
  signal?: AbortSignal,
): Promise<UnderstandSummationResponse> => {
  const response = await api.get<ApiResponse<UnderstandSummationResponse>>(
    `/api/v1/understand/${understandRoomId}/summation`,
    { signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// 방마다 한 번만 생성, 이미 있으면 409
export const createUnderstandSummation = async (
  understandRoomId: number,
): Promise<UnderstandSummationResponse> => {
  const response = await api.post<ApiResponse<UnderstandSummationResponse>>(
    `/api/v1/understand/${understandRoomId}/summation`,
    undefined,
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getUnderstandRooms = async (
  cursor: number | null,
  signal?: AbortSignal,
): Promise<UnderstandRoomListResponse> => {
  const response = await api.get<ApiResponse<UnderstandRoomListResponse>>(
    "/api/v1/understand/list",
    { params: { cursor: cursor ?? undefined }, signal },
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
