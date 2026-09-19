import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { REPORT_PATH, REPORT_WRITE_PARAM } from "@/constants/library/report";

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

  const [searchParams, setSearchParams] = useSearchParams();

  const [guideBook, setGuideBook] = useState<ReportWriteTarget | null>(null);

  // 시트 열림은 주소에만 두어 뒤로가기로도 닫힘
  const isSheetOpen = searchParams.get(REPORT_WRITE_PARAM) === "1";

  const openSheet = useCallback(
    () =>
      setSearchParams((params) => {
        params.set(REPORT_WRITE_PARAM, "1");
        return params;
      }),
    [setSearchParams],
  );

  const closeSheet = useCallback(
    () =>
      setSearchParams(
        (params) => {
          params.delete(REPORT_WRITE_PARAM);
          return params;
        },
        { replace: true },
      ),
    [setSearchParams],
  );

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
