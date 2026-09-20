import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { getRoomDetail } from "@/api/training/discussion/room";
import { getRoomMessages, markRoomRead } from "@/api/training/discussion/roomChat";
import { roomKeys } from "@/hooks/training/discussion/useRoomQueries";

import type { DiscussionRoomResponse } from "@/types/training/discussion/room";
import type { ChatCursor, RoomChatSession } from "@/types/training/discussion/roomChat";

export const roomChatKeys = {
  messages: (roomId: number) => [...roomKeys.all, "chat", roomId, "messages"] as const,
};

// 채팅 세션 전용 API가 없어 방 상세로 조립
export const useRoomChatSession = (roomId: number) =>
  useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: ({ signal }) => getRoomDetail(roomId, signal),
    enabled: Number.isInteger(roomId),
    select: (room: DiscussionRoomResponse): RoomChatSession => ({
      roomId: room.roomId,
      roomTitle: room.title,
      isHost: room.isHost,
    }),
  });

// 실시간 메시지는 소켓으로 캐시에 붙이므로 자동 재조회 끔
export const useRoomMessages = (roomId: number, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: roomChatKeys.messages(roomId),
    queryFn: ({ pageParam, signal }) => getRoomMessages(roomId, pageParam, signal),
    initialPageParam: null as ChatCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime: Infinity,
    // 재진입 때마다 새 메시지와 읽음 위치를 다시 받음
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

export const useMarkRoomRead = () => useMutation({ mutationFn: markRoomRead, retry: 0 });
