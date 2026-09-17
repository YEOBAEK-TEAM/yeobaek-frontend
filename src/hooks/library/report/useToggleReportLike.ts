import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import { updateReportLike } from "@/api/library/report";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";

import type { MyReportResponse } from "@/types/library/report";

const SEND_DELAY_MS = 400;

// 화면은 즉시 반영, 연타가 멈춘 뒤 마지막 상태만 서버에 전송
export const useToggleReportLike = (onError: () => void) => {
  const queryClient = useQueryClient();

  const pendingRef = useRef(new Map<number, { timer: number; isLiked: boolean }>());

  const { mutate } = useMutation({
    mutationFn: updateReportLike,
    onError: () => {
      // 실패하면 서버 상태로 되돌림
      void queryClient.invalidateQueries({ queryKey: libraryReportKeys.mine() });
      onError();
    },
  });

  const toggle = useCallback(
    (reportId: number) => {
      let nextLiked = false;

      queryClient.setQueryData<MyReportResponse[]>(libraryReportKeys.mine(), (reports) =>
        reports?.map((report) => {
          if (report.reportId !== reportId) return report;

          nextLiked = !report.isLiked;
          return { ...report, isLiked: nextLiked };
        }),
      );

      const pending = pendingRef.current;
      window.clearTimeout(pending.get(reportId)?.timer);

      const timer = window.setTimeout(() => {
        pending.delete(reportId);
        mutate({ reportId, isLiked: nextLiked });
      }, SEND_DELAY_MS);

      pending.set(reportId, { timer, isLiked: nextLiked });
    },
    [queryClient, mutate],
  );

  // 화면을 떠날 때 대기 중인 요청은 바로 전송
  useEffect(() => {
    const pending = pendingRef.current;

    return () => {
      pending.forEach(({ timer, isLiked }, reportId) => {
        window.clearTimeout(timer);
        mutate({ reportId, isLiked });
      });
      pending.clear();
    };
  }, [mutate]);

  return toggle;
};
