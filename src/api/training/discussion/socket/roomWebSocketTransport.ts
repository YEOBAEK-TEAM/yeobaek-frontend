import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { toRoomMessage } from "@/utils/training/discussion/toRoomMessage";

import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  ChatMessageResponse,
  RoomClientEvent,
  RoomSocketListener,
  RoomSocketTransport,
} from "@/types/training/discussion/roomChat";

const SOCKET_PATH = "/ws";

// 경로가 바뀌면 이 표만 수정
const DESTINATION = {
  roomMessages: (roomId: number) => `/sub/rooms/${roomId}`,
  myNotice: "/user/sub/queue/enter",
  publish: (roomId: number) => `/pub/rooms/${roomId}`,
};

const readMessage = (body: string) => {
  try {
    return toRoomMessage(JSON.parse(body) as ChatMessageResponse);
  } catch {
    return null;
  }
};

// STOMP over SockJS 구현체, 재연결은 상위 연결 매니저가 담당
export const createRoomWebSocketTransport = (): RoomSocketTransport => {
  const listeners = new Set<RoomSocketListener>();

  let client: Client | null = null;
  let currentRoomId: number | null = null;

  const emit: RoomSocketListener = (signal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (status: ChatConnectionStatus) => emit({ type: "status", status });

  return {
    connect(roomId) {
      currentRoomId = roomId;
      setStatus("connecting");

      const accessToken = localStorage.getItem("accessToken") ?? "";
      const base = String(import.meta.env.VITE_API_BASE_URL ?? "");

      client = new Client({
        // 개인 알림 대상은 handshake 토큰으로 정해져 쿼리와 헤더 모두 전달
        webSocketFactory: () =>
          new SockJS(`${base}${SOCKET_PATH}?token=${encodeURIComponent(accessToken)}`),
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
        reconnectDelay: 0,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 0,

        onConnect: () => {
          setStatus("open");

          client?.subscribe(DESTINATION.roomMessages(roomId), (frame) => {
            const message = readMessage(frame.body);
            if (message) emit({ type: "event", event: { type: "message:new", message } });
          });

          client?.subscribe(DESTINATION.myNotice, () =>
            emit({ type: "event", event: { type: "room:joined" } }),
          );
        },

        // 멤버가 아니면 구독이 거부되어 여기로 들어옴
        onStompError: (frame) =>
          emit({ type: "event", event: { type: "error", message: frame.headers.message ?? "" } }),

        onWebSocketError: () => setStatus("error"),

        onWebSocketClose: () => setStatus("closed"),
      });

      client.activate();
    },

    disconnect() {
      void client?.deactivate();
      client = null;
      currentRoomId = null;
    },

    send(event: RoomClientEvent) {
      if (!client?.connected || currentRoomId === null) return;

      client.publish({
        destination: DESTINATION.publish(currentRoomId),
        body: JSON.stringify({ content: event.text }),
      });
    },

    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};
