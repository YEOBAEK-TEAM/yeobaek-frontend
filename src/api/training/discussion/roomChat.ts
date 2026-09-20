import { api } from "@/api/axios";
import { requestRoomApi } from "@/api/training/discussion/room";
import { toRoomMessage } from "@/utils/training/discussion/toRoomMessage";

import type { ApiResponse } from "@/types/auth";
import type {
  ChatCursor,
  ChatHistoryResponse,
  RoomMessagePageResponse,
} from "@/types/training/discussion/roomChat";

// 최신순 커서 조회, 화면은 오래된 순으로 쌓아 표시
export const getRoomMessages = async (
  roomId: number,
  cursor: ChatCursor | null,
  signal?: AbortSignal,
): Promise<RoomMessagePageResponse> => {
  const data = await requestRoomApi(
    () =>
      api.get<ApiResponse<ChatHistoryResponse>>(`/api/v1/discussion-rooms/${roomId}/messages`, {
        params: cursor
          ? { cursorCreatedAt: cursor.createdAt, cursorMessageId: cursor.messageId }
          : undefined,
        signal,
      }),
    "NOT_MEMBER",
  );

  return {
    messages: data.items.toReversed().map(toRoomMessage),
    myUserId: data.myUserId,
    nextCursor: data.hasNext ? data.nextCursor : null,
    lastReadAt: data.lastReadAt,
  };
};

// 채팅방을 열거나 맨 아래까지 봤을 때 읽음 위치 저장
export const markRoomRead = (roomId: number) =>
  requestRoomApi(() =>
    api.post<ApiResponse<void>>(`/api/v1/discussion-rooms/${roomId}/messages/read`),
  );
