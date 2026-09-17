import {
  CONFIRM_END_TURN,
  mockComprehensionFallback,
  mockComprehensionReplies,
} from "@/mocks/training/comprehensionChatScript";

import type {
  ChatClientEvent,
  ChatConnectionStatus,
  ChatSocketListener,
  ChatSocketTransport,
} from "@/types/training/chatSocket";

const CONNECT_DELAY_MS = 500;

const ACK_DELAY_MS = 200;

const THINKING_DELAY_MS = 450;

const REPLY_DELAY_MS = 1500;

const CONFIRM_END_DELAY_MS = 500;

// 서버 없이 시안 흐름을 재현하는 목 구현체
export const createMockSocketTransport = (): ChatSocketTransport => {
  const listeners = new Set<ChatSocketListener>();
  const timers = new Set<number>();

  let status: ChatConnectionStatus = "idle";
  let turn = 0;

  const emit: ChatSocketListener = (signal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (next: ChatConnectionStatus) => {
    status = next;
    emit({ type: "status", status: next });
  };

  const later = (run: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      run();
    }, delay);

    timers.add(timer);
  };

  const clearTimers = () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
  };

  const replyTo = (clientMessageId: string) => {
    const currentTurn = turn;
    turn += 1;

    later(
      () =>
        emit({
          type: "event",
          event: {
            type: "message:ack",
            clientMessageId,
            messageId: `mock-${clientMessageId}`,
            sentAt: new Date().toISOString(),
          },
        }),
      ACK_DELAY_MS,
    );

    later(() => emit({ type: "event", event: { type: "ai:thinking" } }), THINKING_DELAY_MS);

    later(() => {
      emit({
        type: "event",
        event: {
          type: "ai:message",
          messageId: `mock-ai-${currentTurn}`,
          text: mockComprehensionReplies[currentTurn] ?? mockComprehensionFallback,
          sentAt: new Date().toISOString(),
        },
      });

      if (currentTurn !== CONFIRM_END_TURN) return;

      later(
        () => emit({ type: "event", event: { type: "session:confirmEnd" } }),
        CONFIRM_END_DELAY_MS,
      );
    }, REPLY_DELAY_MS);
  };

  return {
    connect() {
      clearTimers();
      turn = 0;
      setStatus("connecting");

      later(() => {
        setStatus("open");
        emit({ type: "event", event: { type: "session:ready", sessionId: "mock-session" } });
      }, CONNECT_DELAY_MS);
    },

    disconnect() {
      clearTimers();
      setStatus("closed");
    },

    send(event: ChatClientEvent) {
      if (event.type === "message:send" || event.type === "quickReply:select") {
        replyTo(event.clientMessageId);
        return;
      }

      if (event.type === "session:confirmEnd:answer" && event.accepted) {
        later(() => emit({ type: "event", event: { type: "session:ended" } }), ACK_DELAY_MS);
      }
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
