import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { REPORT_PATH } from "@/constants/library/report";
import { latestReportQuery } from "@/hooks/library/report/useReportQueries";

export type ReportWriteTarget = {
  bookId: number;
  title: string;
};

export type ReportWriteFlowStep =
  | { step: "idle" }
  | { step: "draftExists" }
  | { step: "selectBook" }
  | { step: "confirm"; book: ReportWriteTarget }
  | { step: "unlockGuide"; book: ReportWriteTarget };

type WriteBookOptions = {
  confirm?: boolean;
  replace?: boolean;
};

export const useReportWriteFlow = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [flow, setFlow] = useState<ReportWriteFlowStep>({ step: "idle" });

  const close = useCallback(() => setFlow({ step: "idle" }), []);

  const goWrite = (book: ReportWriteTarget, replace = false) =>
    navigate(REPORT_PATH.write(book.bookId), { replace, state: { bookTitle: book.title } });

  // 해금예정 책의 퀴즈도 풀 수 있도록 목록은 작성 중 독후감과 무관하게 오픈
  const startWrite = () => setFlow({ step: "selectBook" });

  // 작성 중인 독후감은 하나만 허용, 서버 배너 독후감이 임시저장 상태면 안내
  const writeBook = async (
    book: ReportWriteTarget,
    { confirm = true, replace = false }: WriteBookOptions = {},
  ) => {
    try {
      const latest = await queryClient.fetchQuery({ ...latestReportQuery, staleTime: 0 });

      if (latest?.status === "DRAFT") {
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

    goWrite(book, replace);
  };

  const openUnlockGuide = (book: ReportWriteTarget) => setFlow({ step: "unlockGuide", book });

  const confirmWrite = () => {
    if (flow.step !== "confirm") return;

    goWrite(flow.book);
  };

  return { flow, close, startWrite, writeBook, openUnlockGuide, confirmWrite };
};

export type ReportWriteFlow = ReturnType<typeof useReportWriteFlow>;
