import { create } from "zustand";

import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  BookSelection,
  ComprehensionMessage,
  ComprehensionPhase,
} from "@/types/training/comprehension";

type QueuedMessage = {
  clientMessageId: string;
  text: string;
  replyId?: string;
};

type ComprehensionChatState = {
  phase: ComprehensionPhase;
  status: ChatConnectionStatus;
  messages: ComprehensionMessage[];
  selection: BookSelection | null;
  // 연결이 끊긴 동안 보낸 메시지 대기열
  queue: QueuedMessage[];

  setSelection: (selection: BookSelection | null) => void;
  setPhase: (phase: ComprehensionPhase) => void;
  setStatus: (status: ChatConnectionStatus) => void;
  pushMessage: (message: ComprehensionMessage) => void;
  removeMessage: (id: string) => void;
  removeByKind: (kind: ComprehensionMessage["kind"]) => void;
  replaceMessageId: (from: string, to: string, sentAt: string) => void;
  setMessageStatus: (id: string, status: "sending" | "sent" | "failed") => void;
  enqueue: (message: QueuedMessage) => void;
  clearQueue: () => void;
  resetConversation: () => void;
};

// 서버 타임스탬프 기준 정렬 후 삽입
const insertMessage = (messages: ComprehensionMessage[], message: ComprehensionMessage) => {
  const next = [...messages, message];

  return next.sort((a, b) => {
    const left = "sentAt" in a && a.sentAt ? a.sentAt : "";
    const right = "sentAt" in b && b.sentAt ? b.sentAt : "";

    if (!left || !right) return 0;
    return left.localeCompare(right);
  });
};

export const useComprehensionChatStore = create<ComprehensionChatState>((set) => ({
  phase: { type: "selecting" },
  status: "idle",
  messages: [],
  selection: null,
  queue: [],

  setSelection: (selection) => set({ selection }),

  setPhase: (phase) => set({ phase }),

  setStatus: (status) => set({ status }),

  pushMessage: (message) =>
    set((state) =>
      // 서버 id 기준 중복 수신 제거
      state.messages.some((item) => item.id === message.id)
        ? state
        : { messages: insertMessage(state.messages, message) },
    ),

  removeMessage: (id) =>
    set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),

  removeByKind: (kind) =>
    set((state) => ({ messages: state.messages.filter((message) => message.kind !== kind) })),

  replaceMessageId: (from, to, sentAt) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === from && message.kind === "text"
          ? { ...message, id: to, sentAt, status: "sent" as const }
          : message,
      ),
    })),

  setMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id && message.kind === "text" ? { ...message, status } : message,
      ),
    })),

  enqueue: (message) => set((state) => ({ queue: [...state.queue, message] })),

  clearQueue: () => set({ queue: [] }),

  resetConversation: () => set({ messages: [], queue: [], phase: { type: "selecting" } }),
}));
