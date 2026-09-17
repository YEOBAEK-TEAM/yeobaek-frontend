import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { REPORT_PATH } from "@/constants/library/report";

export type ReportWriteTarget = {
  bookId: number;
  title: string;
};

export type ReportWriteFlowStep =
  { step: "idle" } | { step: "selectBook" } | { step: "confirm"; book: ReportWriteTarget };

type WriteBookOptions = {
  confirm?: boolean;
  replace?: boolean;
};

// 작성 가능 여부는 저장 시점에 서버에서 확인
export const useReportWriteFlow = () => {
  const navigate = useNavigate();

  const [flow, setFlow] = useState<ReportWriteFlowStep>({ step: "idle" });

  const close = useCallback(() => setFlow({ step: "idle" }), []);

  const goWrite = (book: ReportWriteTarget, replace = false) =>
    navigate(REPORT_PATH.write(book.bookId), { replace, state: { bookTitle: book.title } });

  const startWrite = () => setFlow({ step: "selectBook" });

  const writeBook = (
    book: ReportWriteTarget,
    { confirm = true, replace = false }: WriteBookOptions = {},
  ) => {
    if (confirm) {
      setFlow({ step: "confirm", book });
      return;
    }

    goWrite(book, replace);
  };

  const confirmWrite = () => {
    if (flow.step !== "confirm") return;

    goWrite(flow.book);
  };

  return { flow, close, startWrite, writeBook, confirmWrite };
};

export type ReportWriteFlow = ReturnType<typeof useReportWriteFlow>;
