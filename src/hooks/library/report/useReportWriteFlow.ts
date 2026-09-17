import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { REPORT_PATH } from "@/constants/library/report";
import { draftReportQuery } from "@/hooks/library/report/useReportQueries";

export type ReportWriteTarget = {
  bookId: number;
  title: string;
};

export type ReportWriteFlowStep =
  | { step: "idle" }
  | { step: "draftExists" }
  | { step: "selectBook" }
  | { step: "confirm"; book: ReportWriteTarget }
  | { step: "unlockGuide"; bookId: number };

type WriteBookOptions = {
  confirm?: boolean;
  replace?: boolean;
};

export const useReportWriteFlow = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [flow, setFlow] = useState<ReportWriteFlowStep>({ step: "idle" });

  const close = useCallback(() => setFlow({ step: "idle" }), []);

  // 해금예정 책의 퀴즈도 풀 수 있도록 목록은 작성 중 독후감과 무관하게 오픈
  const startWrite = () => setFlow({ step: "selectBook" });

  // 작성 중인 독후감은 하나만 허용, 있으면 작성 대신 안내
  const writeBook = async (
    book: ReportWriteTarget,
    { confirm = true, replace = false }: WriteBookOptions = {},
  ) => {
    try {
      if ((await queryClient.fetchQuery(draftReportQuery)) !== null) {
        setFlow({ step: "draftExists" });
        return;
      }
    } catch {
      close();
      return;
    }

    if (confirm) {
      setFlow({ step: "confirm", book });
      return;
    }

    navigate(REPORT_PATH.write(book.bookId), { replace });
  };

  const openUnlockGuide = (bookId: number) => setFlow({ step: "unlockGuide", bookId });

  const confirmWrite = () => {
    if (flow.step !== "confirm") return;

    navigate(REPORT_PATH.write(flow.book.bookId));
  };

  return { flow, close, startWrite, writeBook, openUnlockGuide, confirmWrite };
};

export type ReportWriteFlow = ReturnType<typeof useReportWriteFlow>;
