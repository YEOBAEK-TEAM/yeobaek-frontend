import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { createRoomConnection } from "@/api/training/discussion/socket/roomConnection";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import { roomChatKeys } from "@/hooks/training/discussion/useRoomChatQueries";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  RoomChatSessionResponse,
  RoomEndReason,
  RoomMessagePageResponse,
  RoomMessageResponse,
  RoomTimelineMessage,
} from "@/types/training/discussion/roomChat";
import type { RoomConnection } from "@/api/training/discussion/socket/roomConnection";

type MessagesData = InfiniteData<RoomMessagePageResponse, string | null>;

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

const appendUnique = (message: RoomMessageResponse) => (messages: RoomTimelineMessage[]) =>
  messages.some((item) => item.messageId === message.messageId) ? messages : [...messages, message];

const getLatestMessages = (queryClient: QueryClient, roomId: number) =>
  queryClient.getQueryData<MessagesData>(roomChatKeys.messages(roomId))?.pages[0]?.messages ?? [];

export const useRoomChat = (roomId: number, session: RoomChatSessionResponse | undefined) => {
  const queryClient = useQueryClient();

  const connectionRef = useRef<RoomConnection | null>(null);

  const [status, setStatus] = useState<ChatConnectionStatus>("idle");
  const [endReason, setEndReason] = useState<RoomEndReason | null>(null);

  const isReady = session !== undefined;

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

      // 응답이 없으면 실패로 표시
      window.setTimeout(
        () => setMessageStatus(clientMessageId, "sending", "failed"),
        SEND_TIMEOUT_MS,
      );
    },
    [setMessageStatus],
  );

  useEffect(() => {
    if (!isReady) return;

    // 재연결 시 이 id 이후 메시지만 다시 받기 위한 동기화 지점
    const getLastServerMessageId = () =>
      getLatestMessages(queryClient, roomId)
        .filter((message) => !message.clientMessageId || message.status === "sent")
        .at(-1)?.messageId ?? null;

    const connection = createRoomConnection(roomId, getLastServerMessageId);
    connectionRef.current = connection;

    const unsubscribe = connection.subscribe((signal) => {
      if (signal.type === "status") {
        setStatus(signal.status);

        if (signal.status !== "open") return;

        // 연결 전이나 끊긴 동안 보내지 못한 메시지 재전송
        getLatestMessages(queryClient, roomId)
          .filter((message) => message.type === "chat" && message.status === "sending")
          .forEach((message) => {
            if (message.type !== "chat" || !message.clientMessageId) return;
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
        updateLatestMessages(queryClient, roomId, appendUnique(event.message));
        return;
      }

      if (event.type === "message:ack") {
        updateLatestMessages(queryClient, roomId, (messages) =>
          messages.map((message) =>
            message.clientMessageId === event.clientMessageId
              ? { ...event.message, clientMessageId: event.clientMessageId, status: "sent" }
              : message,
          ),
        );
        return;
      }

      if (event.type === "member:kickedMe" || event.type === "room:closed") {
        setEndReason(event.type === "member:kickedMe" ? "kicked" : "closed");
        connection.disconnect();
      }
    });

    connection.connect();

    return () => {
      unsubscribe();
      connection.leave();
      connectionRef.current = null;

      // 마지막 방문 시각이 바뀌므로 참여 중인 토론 카드 재조회
      void queryClient.invalidateQueries({ queryKey: discussionKeys.active() });
    };
  }, [roomId, isReady, queryClient]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!session) return;

      const clientMessageId = `local-${crypto.randomUUID()}`;

      updateLatestMessages(queryClient, roomId, (messages) => [
        ...messages,
        {
          type: "chat",
          messageId: clientMessageId,
          clientMessageId,
          status: "sending",
          sentAt: new Date().toISOString(),
          senderId: session.myUserId,
          senderNickname: "",
          senderProfileImageUrl: null,
          text,
        },
      ]);

      dispatch(clientMessageId, text);
    },
    [session, queryClient, roomId, dispatch],
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
