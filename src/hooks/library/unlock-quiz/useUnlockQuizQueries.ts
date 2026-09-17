import {
  queryOptions,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { completeReading, getUnlockQuiz, submitUnlockQuiz } from "@/api/library/unlockQuiz";
import { getReadingRecords } from "@/api/readingRecord";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";
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

      void queryClient.invalidateQueries({ queryKey: libraryReportKeys.unlockedBooks() });
    },
  });
};

// 실제 읽기 기록이 완독이거나 진행률 저장 응답이 100%면 완독으로 판단
export const useReadingCompletion = (bookId: number) => {
  const queryClient = useQueryClient();

  const completedRecordsQuery = useQuery({
    queryKey: ["reading-records", "COMPLETED", COMPLETED_RECORD_SIZE],
    queryFn: ({ signal }) =>
      getReadingRecords({ status: "COMPLETED", size: COMPLETED_RECORD_SIZE }, signal),
    enabled: isValidBookId(bookId),
  });
  const hasCompletedRecord =
    completedRecordsQuery.data?.items.some(
      (record) => record.bookId === bookId && record.completedAt,
    ) ?? false;

  const progressRates = useMutationState({
    filters: { mutationKey: ["reading-progress", bookId], status: "success" },
    select: (mutation) =>
      (mutation.state.data as UpdateReadingProgressResponse | undefined)?.progressRate ?? 0,
  });

  const hasReachedEnd = progressRates.some((rate) => rate >= 100);

  const { mutate, isIdle } = useMutation({
    mutationFn: completeReading,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["reading-records"] }),
  });

  useEffect(() => {
    // 기록상 이미 완독한 책이거나 한 번 요청했으면 다시 보내지 않음
    if (hasCompletedRecord || !hasReachedEnd || !isIdle) return;

    mutate(bookId);
  }, [bookId, hasCompletedRecord, hasReachedEnd, isIdle, mutate]);

  return {
    isCompleted: hasCompletedRecord || hasReachedEnd,
    isReady: !completedRecordsQuery.isPending,
  };
};
