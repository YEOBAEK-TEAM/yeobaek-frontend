import { create } from "zustand";

import type { UnlockQuizAnswers } from "@/types/library/unlockQuiz";

// 정답은 서버 채점, 클라이언트에는 선택값만 보관
type UnlockQuizState = {
  answers: UnlockQuizAnswers;
  selectAnswer: (questionId: string, choiceId: string) => void;
  reset: () => void;
};

export const useUnlockQuizStore = create<UnlockQuizState>((set) => ({
  answers: {},

  selectAnswer: (questionId, choiceId) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: choiceId } })),

  reset: () => set({ answers: {} }),
}));
