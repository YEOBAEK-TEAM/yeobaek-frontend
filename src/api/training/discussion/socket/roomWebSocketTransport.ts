import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  RoomClientEvent,
  RoomServerEvent,
  RoomSocketListener,
  RoomSocketTransport,
} from "@/types/training/discussion/roomChat";

const SERVER_EVENT_TYPES = new Set<string>([
  "room:joined",
  "message:new",
  "message:ack",
  "member:kickedMe",
  "room:closed",
  "error",
]);

// 서버 이벤트명이 바뀌면 이 목록만 수정, 형식이 맞지 않으면 버림
const toRoomServerEvent = (raw: unknown): RoomServerEvent | null =>
  typeof raw === "object" &&
  raw !== null &&
  "type" in raw &&
  typeof raw.type === "string" &&
  SERVER_EVENT_TYPES.has(raw.type)
    ? (raw as RoomServerEvent)
    : null;

// 백엔드 스펙 확정 시 사용할 브라우저 WebSocket 구현체
export const createRoomWebSocketTransport = (): RoomSocketTransport => {
  const listeners = new Set<RoomSocketListener>();

  let socket: WebSocket | null = null;

  const emit: RoomSocketListener = (signal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (status: ChatConnectionStatus) => emit({ type: "status", status });

  const send = (event: RoomClientEvent) => {
    if (socket?.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(event));
  };

  return {
    connect(roomId, afterMessageId) {
      setStatus("connecting");

      const base = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/^http/, "ws");
      socket = new WebSocket(`${base}/ws/v1/discussion/rooms/${roomId}`);

      socket.onopen = () => {
        setStatus("open");

        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) socket?.send(JSON.stringify({ type: "auth", accessToken }));

        // 재연결 시 마지막으로 받은 메시지 이후만 다시 수신
        send({ type: "room:join", roomId, afterMessageId });
      };

      socket.onmessage = (message) => {
        const event = toRoomServerEvent(JSON.parse(String(message.data)));
        if (event) emit({ type: "event", event });
      };

      socket.onerror = () => setStatus("error");

      socket.onclose = () => setStatus("closed");
    },

    disconnect() {
      socket?.close();
      socket = null;
    },

    send,

    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};
