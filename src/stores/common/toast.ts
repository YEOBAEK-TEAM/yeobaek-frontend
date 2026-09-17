import { create } from "zustand";

export type ToastTone = "success" | "error";

type ToastState = {
  toast: { id: number; message: string; tone: ToastTone } | null;
  showToast: (message: string, tone?: ToastTone) => void;
  hideToast: (id: number) => void;
};

let toastSequence = 0;

// 화면 이동 후에도 이어서 보이도록 앱 전역에서 관리하는 토스트
export const useToastStore = create<ToastState>((set) => ({
  toast: null,

  showToast: (message, tone = "success") => {
    toastSequence += 1;
    set({ toast: { id: toastSequence, message, tone } });
  },

  hideToast: (id) => set((state) => (state.toast?.id === id ? { toast: null } : state)),
}));
