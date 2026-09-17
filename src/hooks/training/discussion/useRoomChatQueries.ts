import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RoomApiError } from "@/api/training/discussion/room";
import {
  getRoomChatSession,
  getRoomMessages,
  kickRoomMember,
  leaveRoom,
} from "@/api/training/discussion/roomChat";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import { roomKeys } from "@/hooks/training/discussion/useRoomQueries";

export const roomChatKeys = {
  session: (roomId: number) => [...roomKeys.all, "chat", roomId, "session"] as const,
  messages: (roomId: number) => [...roomKeys.all, "chat", roomId, "messages"] as const,
};

// 입장 가능 여부처럼 확정된 서버 거절은 재시도하지 않음
const retryUnlessRejected = (failureCount: number, error: Error) =>
  !(error instanceof RoomApiError) && failureCount < 2;

export const useRoomChatSession = (roomId: number) =>
  useQuery({
    queryKey: roomChatKeys.session(roomId),
    queryFn: () => getRoomChatSession(roomId),
    enabled: Number.isInteger(roomId),
    staleTime: Infinity,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retry: retryUnlessRejected,
  });

// 실시간 메시지는 소켓으로 캐시에 붙이므로 자동 재조회 끔
export const useRoomMessages = (roomId: number, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: roomChatKeys.messages(roomId),
    queryFn: ({ pageParam }) => getRoomMessages(roomId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

export const useLeaveRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveRoom,
    onSuccess: () =>
      [discussionKeys.all, roomKeys.all].forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      ),
  });
};

export const useKickMember = () => useMutation({ mutationFn: kickRoomMember });
