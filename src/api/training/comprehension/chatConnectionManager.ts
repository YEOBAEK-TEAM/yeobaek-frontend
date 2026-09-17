import { createMockSocketTransport } from "@/api/training/comprehension/mockSocketTransport";
import { createWebSocketTransport } from "@/api/training/comprehension/webSocketTransport";

import type {
  ChatClientEvent,
  ChatConnectionStatus,
  ChatSessionPayload,
  ChatSocketListener,
  ChatSocketSignal,
  ChatSocketTransport,
} from "@/types/training/chatSocket";

const MAX_RETRIES = 5;

const BASE_DELAY_MS = 800;

const MAX_DELAY_MS = 10_000;

const PENDING_TIMEOUT_MS = 30_000;

const HEARTBEAT_INTERVAL_MS = 5_000;

// 목 전송과 실제 소켓 전환
const createTransport = (): ChatSocketTransport =>
  import.meta.env.VITE_CHAT_TRANSPORT === "ws"
    ? createWebSocketTransport()
    : createMockSocketTransport();

// 컴포넌트 밖에서 연결을 소유하는 매니저
const createChatConnectionManager = () => {
  const listeners = new Set<ChatSocketListener>();

  let transport: ChatSocketTransport | null = null;
  let unsubscribeTransport: (() => void) | null = null;
  let payload: ChatSessionPayload | null = null;
  let status: ChatConnectionStatus = "idle";
  let retries = 0;
  let retryTimer = 0;
  let heartbeatTimer = 0;
  let pendingSince = 0;
  let suppressReconnect = false;

  // 재연결 시 이 id 이후 메시지만 다시 받기 위한 동기화 지점
  let lastServerMessageId: string | null = null;

  const emit = (signal: ChatSocketSignal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (next: ChatConnectionStatus) => {
    if (status === next) return;

    status = next;
    emit({ type: "status", status: next });
  };

  const stopHeartbeat = () => {
    window.clearInterval(heartbeatTimer);
    heartbeatTimer = 0;
  };

  const teardownTransport = () => {
    suppressReconnect = true;
    unsubscribeTransport?.();
    transport?.disconnect();
    unsubscribeTransport = null;
    transport = null;
    suppressReconnect = false;
  };

  const scheduleReconnect = () => {
    if (suppressReconnect || !payload) return;

    if (retries >= MAX_RETRIES) {
      setStatus("error");
      return;
    }

    retries += 1;
    setStatus("reconnecting");

    // 지수 백오프에 지터 추가
    const delay = Math.min(BASE_DELAY_MS * 2 ** (retries - 1), MAX_DELAY_MS);
    window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(() => openTransport(), delay + Math.random() * delay * 0.3);
  };

  // 응답 대기가 길어지면 끊김으로 판단
  const startHeartbeat = () => {
    stopHeartbeat();

    heartbeatTimer = window.setInterval(() => {
      if (!pendingSince || Date.now() - pendingSince < PENDING_TIMEOUT_MS) return;

      pendingSince = 0;
      teardownTransport();
      scheduleReconnect();
    }, HEARTBEAT_INTERVAL_MS);
  };

  const handleSignal = (signal: ChatSocketSignal) => {
    if (signal.type === "status") {
      if (signal.status === "open") {
        retries = 0;
        setStatus("open");
        return;
      }

      if (signal.status === "closed" || signal.status === "error") {
        setStatus(signal.status);
        scheduleReconnect();
        return;
      }

      setStatus(signal.status);
      return;
    }

    if (signal.event.type === "ai:message" || signal.event.type === "ai:done") {
      lastServerMessageId = signal.event.messageId;
      pendingSince = 0;
    }

    emit(signal);
  };

  function openTransport() {
    if (!payload) return;

    teardownTransport();

    transport = createTransport();
    unsubscribeTransport = transport.subscribe(handleSignal);
    transport.connect(payload);
    startHeartbeat();
  }

  const handleWake = () => {
    if (!payload || status === "open" || status === "connecting") return;

    retries = 0;
    openTransport();
  };

  // 탭 복귀와 네트워크 복구 시 재연결
  if (typeof window !== "undefined") {
    window.addEventListener("online", handleWake);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") handleWake();
    });
  }

  return {
    connect(next: ChatSessionPayload) {
      payload = next;
      retries = 0;
      lastServerMessageId = null;
      openTransport();
    },

    disconnect() {
      window.clearTimeout(retryTimer);
      stopHeartbeat();
      transport?.send({ type: "session:leave" });
      teardownTransport();
      payload = null;
      pendingSince = 0;
      setStatus("idle");
    },

    retry() {
      retries = 0;
      openTransport();
    },

    send(event: ChatClientEvent) {
      if (event.type === "message:send" || event.type === "quickReply:select") {
        pendingSince = Date.now();
      }

      transport?.send(event);
    },

    subscribe(listener: ChatSocketListener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    getStatus: () => status,

    getLastServerMessageId: () => lastServerMessageId,
  };
};

export const chatConnectionManager = createChatConnectionManager();
