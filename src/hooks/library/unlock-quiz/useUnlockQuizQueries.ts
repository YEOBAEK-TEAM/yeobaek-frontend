import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  completeReading,
  getPendingUnlockBooks,
  getUnlockQuiz,
  submitUnlockQuiz,
} from "@/api/library/unlockQuiz";
import { getReadingRecords } from "@/api/readingRecord";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";
import { toPendingUnlockBookViews } from "@/utils/library/unlock-quiz/toPendingUnlockBookView";
import { toUnlockQuizView } from "@/utils/library/unlock-quiz/toUnlockQuizView";

import type { UpdateReadingProgressResponse } from "@/types/readingRecord";

// 독후감 해금 query key 팩토리
export const unlockQuizKeys = {
  all: ["library", "unlock"] as const,
  quiz: (bookId: number) => [...unlockQuizKeys.all, "quiz", bookId] as const,
};

// 완독 기록 조회 최대 개수
const COMPLETED_RECORD_SIZE = 50;

export const isValidBookId = (bookId: number) => Number.isSafeInteger(bookId) && bookId > 0;

// 퀴즈 생성에 시간이 걸려 자동 재시도 없이 사용자가 다시 시도
const unlockQuizQuery = (bookId: number) =>
  queryOptions({
    queryKey: unlockQuizKeys.quiz(bookId),
    queryFn: ({ signal }) => getUnlockQuiz(bookId, signal),
    staleTime: 0,
    retry: false,
  });

// 시작하기에서 받아 둔 문제를 그대로 쓰고, 주소로 바로 들어왔을 때만 새로 조회
export const useUnlockQuiz = (bookId: number) =>
  useQuery({
    ...unlockQuizQuery(bookId),
    select: toUnlockQuizView,
    enabled: isValidBookId(bookId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export const usePendingUnlockBooks = (enabled: boolean) =>
  useQuery({
    queryKey: libraryReportKeys.pendingUnlockBooks(),
    queryFn: ({ signal }) => getPendingUnlockBooks(signal),
    select: toPendingUnlockBookViews,
    staleTime: 30_000,
    enabled,
  });

// 시작하기 시점마다 새로 조회
export const useStartUnlockQuiz = (bookId: number) => {
  const queryClient = useQueryClient();

  return useMutation({ mutationFn: () => queryClient.fetchQuery(unlockQuizQuery(bookId)) });
};

// 중복 채점 방지를 위해 자동 재시도 없음
export const useSubmitUnlockQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitUnlockQuiz,
    retry: 0,
    onSuccess: ({ passed }) => {
      if (!passed) return;

      [libraryReportKeys.unlockedBooks(), libraryReportKeys.pendingUnlockBooks()].forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      );
    },
  });
};

// 최초 완독 이력은 해금 UI에, 현재 세션의 진행 저장은 회차별 완독 처리에 사용
export const useReadingCompletion = (bookId: number) => {
  const queryClient = useQueryClient();

  const completedRecordsQuery = useQuery({
    queryKey: ["reading-records", "COMPLETED", COMPLETED_RECORD_SIZE],
    queryFn: ({ signal }) =>
      getReadingRecords({ status: "COMPLETED", size: COMPLETED_RECORD_SIZE }, signal),
    enabled: isValidBookId(bookId),
  });
  const hasEverCompleted =
    completedRecordsQuery.data?.items.some(
      (record) => record.bookId === bookId && record.completedAt,
    ) ?? false;

  const [hasCompletedInSession, setHasCompletedInSession] = useState(false);

  const { mutate } = useMutation({
    mutationFn: completeReading,
    retry: 0,
    onSuccess: () => {
      setHasCompletedInSession(true);
      [["reading-records"], libraryReportKeys.pendingUnlockBooks()].forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      );
    },
  });

  useEffect(() => {
    if (!isValidBookId(bookId)) return;

    // Only mutations created after this Reader session starts can trigger completion.
    const sessionMutations = new Set<number>();
    let completionRequested = false;
    let completionPending = false;
    let latestRate: number | undefined;

    return queryClient.getMutationCache().subscribe((event) => {
      if (!event.mutation) return;
      const key = event.mutation.options.mutationKey;
      if (key?.length !== 2 || key[0] !== "reading-progress" || key[1] !== bookId) return;
      if (event.type === "added") {
        sessionMutations.add(event.mutation.mutationId);
        return;
      }
      if (event.type === "removed") {
        sessionMutations.delete(event.mutation.mutationId);
        return;
      }
      if (
        event.type !== "updated" ||
        event.action.type !== "success" ||
        !sessionMutations.has(event.mutation.mutationId)
      )
        return;

      const rate = (event.mutation.state.data as UpdateReadingProgressResponse | undefined)
        ?.progressRate;
      if (rate === undefined || !Number.isFinite(rate)) return;
      latestRate = rate;
      if (rate < 100) {
        if (!completionPending) completionRequested = false;
        return;
      }
      if (completionRequested || completionPending) return;

      // Lock synchronously before mutate: repeated 100% saves must not submit twice.
      completionRequested = true;
      completionPending = true;
      mutate(bookId, {
        onSettled: () => {
          completionPending = false;
          if (latestRate !== undefined && latestRate < 100) completionRequested = false;
        },
      });
    });
  }, [bookId, mutate, queryClient]);

  return {
    isCompleted: hasEverCompleted || hasCompletedInSession,
    isReady: !completedRecordsQuery.isPending,
  };
};
