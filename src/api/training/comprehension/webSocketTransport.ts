import { toServerEvent, toServerPayload } from "@/api/training/comprehension/socketEventMap";

import type {
  ChatClientEvent,
  ChatConnectionStatus,
  ChatSessionPayload,
  ChatSocketListener,
  ChatSocketTransport,
} from "@/types/training/chatSocket";

const SOCKET_PATH = "/ws/v1/trainings/comprehension";

// 토큰 노출을 피하기 위한 연결 직후 인증 이벤트 주입 지점
const buildAuthEvent = () => {
  const accessToken = localStorage.getItem("accessToken");

  return accessToken ? JSON.stringify({ type: "auth", accessToken }) : null;
};

// 백엔드 스펙 확정 시 사용할 브라우저 WebSocket 구현체
export const createWebSocketTransport = (): ChatSocketTransport => {
  const listeners = new Set<ChatSocketListener>();

  let socket: WebSocket | null = null;
  let status: ChatConnectionStatus = "idle";

  const emit: ChatSocketListener = (signal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (next: ChatConnectionStatus) => {
    status = next;
    emit({ type: "status", status: next });
  };

  return {
    connect(payload: ChatSessionPayload) {
      setStatus("connecting");

      const base = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/^http/, "ws");
      socket = new WebSocket(`${base}${SOCKET_PATH}`);

      socket.onopen = () => {
        setStatus("open");

        const auth = buildAuthEvent();
        if (auth) socket?.send(auth);

        socket?.send(
          toServerPayload({
            type: "session:join",
            bookId: payload.bookId,
            bookmarkId: payload.bookmarkId,
            afterMessageId: null,
          }),
        );
      };

      socket.onmessage = (message) => {
        const event = toServerEvent(JSON.parse(String(message.data)));
        if (event) emit({ type: "event", event });
      };

      socket.onerror = () => setStatus("error");

      socket.onclose = () => setStatus("closed");
    },

    disconnect() {
      socket?.close();
      socket = null;
      setStatus("closed");
    },

    send(event: ChatClientEvent) {
      if (socket?.readyState !== WebSocket.OPEN) return;

      socket.send(toServerPayload(event));
    },

    subscribe(listener: ChatSocketListener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    getStatus: () => status,
  };
};
