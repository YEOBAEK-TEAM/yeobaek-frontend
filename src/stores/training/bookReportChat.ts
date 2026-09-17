import { create } from "zustand";

import type { BookReportMessage, ChatPhase } from "@/types/training/bookReportChat";

type BookReportChatState = {
  phase: ChatPhase;
  messages: BookReportMessage[];
  // 대화 차례
  turn: number;

  setPhase: (phase: ChatPhase) => void;
  pushMessage: (message: BookReportMessage) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  appendText: (id: string, text: string) => void;
  finishStreaming: (id: string) => void;
  markFailed: (id: string, failed: boolean) => void;
  nextTurn: () => void;
  reset: () => void;
};

const initialState = {
  phase: { type: "select" } as ChatPhase,
  messages: [] as BookReportMessage[],
  turn: 0,
};

export const useBookReportChatStore = create<BookReportChatState>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  pushMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  removeMessage: (id) =>
    set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),

  clearMessages: () => set({ messages: [] }),

  appendText: (id, text) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id && message.kind === "text"
          ? { ...message, text: message.text + text }
          : message,
      ),
    })),

  finishStreaming: (id) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id && message.kind === "text" ? { ...message, streaming: false } : message,
      ),
    })),

  markFailed: (id, failed) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id && message.kind === "text"
          ? { ...message, status: failed ? ("failed" as const) : ("sent" as const) }
          : message,
      ),
    })),

  nextTurn: () => set((state) => ({ turn: state.turn + 1 })),

  reset: () => set({ ...initialState, messages: [] }),
}));
