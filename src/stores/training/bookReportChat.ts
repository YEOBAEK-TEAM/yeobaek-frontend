import { create } from "zustand";

import type { BookReportMessage, ChatPhase } from "@/types/training/bookReportChat";

// 대화 이력은 Query 캐시, 화면 단계와 서버에 없는 메시지만 보관
type BookReportChatState = {
  phase: ChatPhase;
  messages: BookReportMessage[];

  setPhase: (phase: ChatPhase) => void;
  pushMessage: (message: BookReportMessage) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  markFailed: (id: string, failed: boolean) => void;
  reset: () => void;
};

const initialState = {
  phase: { type: "select" } as ChatPhase,
  messages: [] as BookReportMessage[],
};

export const useBookReportChatStore = create<BookReportChatState>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  pushMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  removeMessage: (id) =>
    set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),

  clearMessages: () => set({ messages: [] }),

  markFailed: (id, failed) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id && message.kind === "text"
          ? { ...message, status: failed ? ("failed" as const) : ("sending" as const) }
          : message,
      ),
    })),

  reset: () => set({ ...initialState, messages: [] }),
}));
