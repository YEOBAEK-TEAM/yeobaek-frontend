import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { createRoomConnection } from "@/api/training/discussion/socket/roomConnection";
import { ROOM_MESSAGE_MAX_LENGTH } from "@/constants/training/discussion/roomChat";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import { roomChatKeys } from "@/hooks/training/discussion/useRoomChatQueries";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  ChatCursor,
  RoomEndReason,
  RoomMessagePageResponse,
  RoomMessageResponse,
  RoomTimelineMessage,
} from "@/types/training/discussion/roomChat";
import type { RoomConnection } from "@/api/training/discussion/socket/roomConnection";

type MessagesData = InfiniteData<RoomMessagePageResponse, ChatCursor | null>;

const SEND_TIMEOUT_MS = 10_000;

// 가장 최근 페이지 끝에 실시간 메시지 반영
const updateLatestMessages = (
  queryClient: QueryClient,
  roomId: number,
  update: (messages: RoomTimelineMessage[]) => RoomTimelineMessage[],
) =>
  queryClient.setQueryData<MessagesData>(roomChatKeys.messages(roomId), (data) => {
    if (!data || data.pages.length === 0) return data;

    const [latest, ...older] = data.pages;

    return { ...data, pages: [{ ...latest, messages: update(latest.messages) }, ...older] };
  });

// 전송 확인이 없어 브로드캐스트로 돌아온 내 메시지가 임시 메시지를 대체
const applyIncoming =
  (message: RoomMessageResponse, myUserId: number) => (messages: RoomTimelineMessage[]) => {
    if (messages.some((item) => item.messageId === message.messageId)) return messages;

    if (message.type === "chat" && message.senderId === myUserId) {
      const pendingIndex = messages.findIndex(
        (item) => item.type === "chat" && item.status === "sending" && item.text === message.text,
      );

      if (pendingIndex >= 0) {
        const next = [...messages];
        next[pendingIndex] = { ...message, status: "sent" };

        return next;
      }
    }

    return [...messages, message];
  };

const getLatestMessages = (queryClient: QueryClient, roomId: number) =>
  queryClient.getQueryData<MessagesData>(roomChatKeys.messages(roomId))?.pages[0]?.messages ?? [];

export const useRoomChat = (roomId: number, myUserId: number | undefined) => {
  const queryClient = useQueryClient();

  const connectionRef = useRef<RoomConnection | null>(null);
  const hasConnectedRef = useRef(false);

  const [status, setStatus] = useState<ChatConnectionStatus>("idle");
  const [endReason, setEndReason] = useState<RoomEndReason | null>(null);

  const setMessageStatus = useCallback(
    (clientMessageId: string, from: RoomTimelineMessage["status"], to: "sending" | "failed") =>
      updateLatestMessages(queryClient, roomId, (messages) =>
        messages.map((message) =>
          message.clientMessageId === clientMessageId && message.status === from
            ? { ...message, status: to }
            : message,
        ),
      ),
    [queryClient, roomId],
  );

  const dispatch = useCallback(
    (clientMessageId: string, text: string) => {
      connectionRef.current?.send({ type: "message:send", clientMessageId, text });

      // 전송 확인이 없어 브로드캐스트가 돌아오지 않으면 실패로 표시
      window.setTimeout(
        () => setMessageStatus(clientMessageId, "sending", "failed"),
        SEND_TIMEOUT_MS,
      );
    },
    [setMessageStatus],
  );

  useEffect(() => {
    if (myUserId === undefined) return;

    const connection = createRoomConnection(roomId);
    connectionRef.current = connection;

    const unsubscribe = connection.subscribe((signal) => {
      if (signal.type === "status") {
        setStatus(signal.status);

        if (signal.status !== "open") return;

        // 끊겨 있던 동안 놓친 메시지는 히스토리로 다시 채움
        if (hasConnectedRef.current) {
          void queryClient.invalidateQueries({ queryKey: roomChatKeys.messages(roomId) });
        }
        hasConnectedRef.current = true;

        // 연결 전에 보내지 못한 메시지 재전송
        getLatestMessages(queryClient, roomId).forEach((message) => {
          if (message.type !== "chat" || message.status !== "sending") return;
          if (!message.clientMessageId) return;

          connection.send({
            type: "message:send",
            clientMessageId: message.clientMessageId,
            text: message.text,
          });
        });
        return;
      }

      const { event } = signal;

      if (event.type === "message:new") {
        const { message } = event;

        updateLatestMessages(queryClient, roomId, applyIncoming(message, myUserId));

        // 내가 대상인 강퇴이거나 방이 삭제되면 더 머무를 수 없음
        if (message.type === "roomDeleted") setEndReason("closed");
        if (message.type === "memberKicked" && message.userId === myUserId) {
          setEndReason("kicked");
        }
        return;
      }

      // 참여 상태가 바뀌면 그룹 목록도 함께 갱신
      if (event.type === "room:joined") {
        void queryClient.invalidateQueries({ queryKey: [...discussionKeys.all, "groups"] });
        return;
      }

      // 구독이 거부되면 멤버가 아니게 된 것
      setEndReason("kicked");
      connection.disconnect();
    });

    connection.connect();

    return () => {
      unsubscribe();
      connection.disconnect();
      connectionRef.current = null;
      hasConnectedRef.current = false;

      // 마지막 방문 시각이 바뀌므로 참여 중인 토론 카드 재조회
      void queryClient.invalidateQueries({ queryKey: discussionKeys.groups("joined") });
    };
  }, [roomId, myUserId, queryClient]);

  const sendMessage = useCallback(
    (input: string) => {
      if (myUserId === undefined) return;

      const text = input.trim().slice(0, ROOM_MESSAGE_MAX_LENGTH);
      if (!text) return;

      const clientMessageId = `local-${crypto.randomUUID()}`;

      updateLatestMessages(queryClient, roomId, (messages) => [
        ...messages,
        {
          type: "chat",
          messageId: clientMessageId,
          clientMessageId,
          status: "sending",
          sentAt: new Date().toISOString(),
          senderId: myUserId,
          senderNickname: "",
          senderProfileImageUrl: null,
          senderIsHost: false,
          text,
        },
      ]);

      dispatch(clientMessageId, text);
    },
    [myUserId, queryClient, roomId, dispatch],
  );

  const retryMessage = useCallback(
    (clientMessageId: string, text: string) => {
      setMessageStatus(clientMessageId, "failed", "sending");
      dispatch(clientMessageId, text);
    },
    [setMessageStatus, dispatch],
  );

  return {
    status,
    endReason,
    sendMessage,
    retryMessage,
    retryConnection: () => connectionRef.current?.retry(),
  };
};
