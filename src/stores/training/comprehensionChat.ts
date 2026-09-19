import { create } from "zustand";

import type { ComprehensionMessage, ComprehensionPhase } from "@/types/training/comprehension";

type ComprehensionChatState = {
  phase: ComprehensionPhase;
  // 대화 이력은 Query 캐시, 화면 단계와 서버에 없는 메시지만 보관
  messages: ComprehensionMessage[];
  // 방 생성 응답에만 담겨 오는 예시 질문
  options: string[];

  setPhase: (phase: ComprehensionPhase) => void;
  setOptions: (options: string[]) => void;
  pushMessage: (message: ComprehensionMessage) => void;
  removeMessage: (id: string) => void;
  markFailed: (id: string, failed: boolean) => void;
  reset: () => void;
};

export const useComprehensionChatStore = create<ComprehensionChatState>((set) => ({
  phase: { type: "selecting" },
  messages: [],
  options: [],

  setPhase: (phase) => set({ phase }),

  setOptions: (options) => set({ options }),

  pushMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  removeMessage: (id) =>
    set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),

  markFailed: (id, failed) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id && message.kind === "text"
          ? { ...message, status: failed ? "failed" : "sending" }
          : message,
      ),
    })),

  reset: () => set({ phase: { type: "selecting" }, messages: [], options: [] }),
}));
