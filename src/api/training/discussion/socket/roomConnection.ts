import { createMockRoomSocketTransport } from "@/api/training/discussion/socket/mockRoomSocketTransport";
import { createRoomWebSocketTransport } from "@/api/training/discussion/socket/roomWebSocketTransport";

import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  RoomClientEvent,
  RoomSocketListener,
  RoomSocketSignal,
  RoomSocketTransport,
} from "@/types/training/discussion/roomChat";

const MAX_RETRIES = 5;

const BASE_DELAY_MS = 800;

const MAX_DELAY_MS = 10_000;

// 목 전송과 실제 소켓 전환
const createTransport = (): RoomSocketTransport =>
  import.meta.env.VITE_CHAT_TRANSPORT === "ws"
    ? createRoomWebSocketTransport()
    : createMockRoomSocketTransport();

export type RoomConnection = ReturnType<typeof createRoomConnection>;

// 토론방 한 곳의 연결 수명과 재연결 관리
export const createRoomConnection = (roomId: number, getLastMessageId: () => string | null) => {
  const listeners = new Set<RoomSocketListener>();

  let transport: RoomSocketTransport | null = null;
  let unsubscribeTransport: (() => void) | null = null;
  let status: ChatConnectionStatus = "idle";
  let retries = 0;
  let retryTimer = 0;
  let isStopped = false;

  const emit = (signal: RoomSocketSignal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (next: ChatConnectionStatus) => {
    if (status === next) return;

    status = next;
    emit({ type: "status", status: next });
  };

  const teardownTransport = () => {
    unsubscribeTransport?.();
    transport?.disconnect();
    unsubscribeTransport = null;
    transport = null;
  };

  const scheduleReconnect = () => {
    if (isStopped) return;

    if (retries >= MAX_RETRIES) {
      setStatus("error");
      return;
    }

    retries += 1;
    setStatus("reconnecting");

    // 지수 백오프에 지터 추가
    const delay = Math.min(BASE_DELAY_MS * 2 ** (retries - 1), MAX_DELAY_MS);
    window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(openTransport, delay + Math.random() * delay * 0.3);
  };

  const handleSignal = (signal: RoomSocketSignal) => {
    if (signal.type === "event") {
      emit(signal);
      return;
    }

    if (signal.status === "open") {
      retries = 0;
      setStatus("open");
      return;
    }

    if (signal.status === "closed" || signal.status === "error") {
      teardownTransport();
      scheduleReconnect();
      return;
    }

    setStatus(signal.status);
  };

  function openTransport() {
    if (isStopped) return;

    teardownTransport();

    transport = createTransport();
    unsubscribeTransport = transport.subscribe(handleSignal);
    transport.connect(roomId, getLastMessageId());
  }

  // 탭 복귀와 네트워크 복구 시 재연결
  const handleWake = () => {
    if (isStopped || status === "open" || status === "connecting") return;

    retries = 0;
    openTransport();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") handleWake();
  };

  const stop = () => {
    isStopped = true;
    window.clearTimeout(retryTimer);
    window.removeEventListener("online", handleWake);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    teardownTransport();
    setStatus("idle");
  };

  return {
    connect() {
      isStopped = false;
      window.addEventListener("online", handleWake);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      openTransport();
    },

    // 채팅 화면만 닫는 일시 퇴장, 참여 상태는 유지
    leave() {
      transport?.send({ type: "room:leave" });
      stop();
    },

    disconnect: stop,

    retry() {
      retries = 0;
      openTransport();
    },

    send(event: RoomClientEvent) {
      if (status !== "open" || !transport) return false;

      transport.send(event);
      return true;
    },

    subscribe(listener: RoomSocketListener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};
