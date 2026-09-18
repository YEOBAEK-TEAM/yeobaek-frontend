import { create } from "zustand";

// 서재 헤더 버튼과 독후감 탭이 함께 여는 책 선택 시트
type ReportWriteState = {
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
};

export const useReportWriteStore = create<ReportWriteState>((set) => ({
  isSheetOpen: false,

  openSheet: () => set({ isSheetOpen: true }),

  closeSheet: () => set({ isSheetOpen: false }),
}));
