import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { REPORT_PATH } from "@/constants/library/report";
import { useReportWriteStore } from "@/stores/library/reportWrite";

export type ReportWriteTarget = {
  bookId: number;
  title: string;
};

type WriteBookOptions = {
  replace?: boolean;
};

// 책을 고르면 바로 작성 화면, 해금예정 책은 완독 안내부터
export const useReportWriteFlow = () => {
  const navigate = useNavigate();

  const isSheetOpen = useReportWriteStore((state) => state.isSheetOpen);
  const openSheet = useReportWriteStore((state) => state.openSheet);
  const closeSheet = useReportWriteStore((state) => state.closeSheet);

  const [guideBook, setGuideBook] = useState<ReportWriteTarget | null>(null);

  const close = useCallback(() => {
    closeSheet();
    setGuideBook(null);
  }, [closeSheet]);

  const writeBook = (book: ReportWriteTarget, { replace = false }: WriteBookOptions = {}) =>
    navigate(REPORT_PATH.write(book.bookId), { replace, state: { bookTitle: book.title } });

  const openUnlockGuide = (book: ReportWriteTarget) => {
    closeSheet();
    setGuideBook(book);
  };

  return { isSheetOpen, guideBook, startWrite: openSheet, close, writeBook, openUnlockGuide };
};

export type ReportWriteFlow = ReturnType<typeof useReportWriteFlow>;
