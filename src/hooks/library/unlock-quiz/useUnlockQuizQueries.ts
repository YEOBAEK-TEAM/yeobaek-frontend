import {
  queryOptions,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

import {
  completeReading,
  getPendingUnlockBooks,
  getReportUnlockStatus,
  getUnlockQuiz,
  gradeUnlockQuiz,
} from "@/api/library/unlockQuiz";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";
import { useReadingRecords } from "@/hooks/useReadingRecords";

import { toPendingUnlockBookViews } from "@/utils/library/unlock-quiz/toPendingUnlockBookView";

import type { UpdateReadingProgressResponse } from "@/types/readingRecord";

// 독후감 해금 query key 팩토리
export const unlockQuizKeys = {
  all: ["library", "unlock"] as const,
  status: (bookId: number) => [...unlockQuizKeys.all, "status", bookId] as const,
  quiz: (bookId: number) => [...unlockQuizKeys.all, "quiz", bookId] as const,
  pendingBooks: () => [...unlockQuizKeys.all, "pending-books"] as const,
};

const isValidBookId = (bookId: number) => Number.isSafeInteger(bookId) && bookId > 0;

const unlockQuizQuery = (bookId: number) =>
  queryOptions({
    queryKey: unlockQuizKeys.quiz(bookId),
    queryFn: () => getUnlockQuiz(bookId),
    staleTime: 0,
  });

export const useReportUnlockStatus = (bookId: number) =>
  useQuery({
    queryKey: unlockQuizKeys.status(bookId),
    queryFn: () => getReportUnlockStatus(bookId),
    enabled: isValidBookId(bookId),
  });

// 시작하기에서 받아 둔 문제를 그대로 쓰고, 주소로 바로 들어왔을 때만 새로 조회
export const useUnlockQuiz = (bookId: number) =>
  useQuery({
    ...unlockQuizQuery(bookId),
    enabled: isValidBookId(bookId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export const usePendingUnlockBooks = (enabled: boolean) =>
  useQuery({
    queryKey: unlockQuizKeys.pendingBooks(),
    queryFn: getPendingUnlockBooks,
    select: toPendingUnlockBookViews,
    enabled,
  });

// 시작하기 시점마다 새 문제 조회
export const useStartUnlockQuiz = (bookId: number) => {
  const queryClient = useQueryClient();

  return useMutation({ mutationFn: () => queryClient.fetchQuery(unlockQuizQuery(bookId)) });
};

export const useGradeUnlockQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gradeUnlockQuiz,
    onSuccess: ({ result }, { bookId }) => {
      if (result !== "unlocked") return;

      [
        unlockQuizKeys.status(bookId),
        unlockQuizKeys.pendingBooks(),
        libraryReportKeys.unlockedBooks(),
      ].forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
    },
  });
};

// 실제 읽기 기록이 완독이거나 진행률 저장 응답이 100%가 되면 완독 처리 요청
export const useReadingCompletion = (
  bookId: number,
  bookTitle: string,
  isCompleted: boolean | undefined,
) => {
  const queryClient = useQueryClient();

  const { data: completedRecords } = useReadingRecords("COMPLETED", isCompleted === false);
  const hasCompletedRecord =
    completedRecords?.items.some((record) => record.bookId === bookId && record.completedAt) ??
    false;

  const progressRates = useMutationState({
    filters: { mutationKey: ["reading-progress", bookId], status: "success" },
    select: (mutation) =>
      (mutation.state.data as UpdateReadingProgressResponse | undefined)?.progressRate ?? 0,
  });

  const hasReachedEnd = hasCompletedRecord || progressRates.some((rate) => rate >= 100);

  const { mutate, isIdle } = useMutation({
    mutationFn: completeReading,
    onSuccess: () =>
      [unlockQuizKeys.status(bookId), unlockQuizKeys.pendingBooks()].forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      ),
  });

  useEffect(() => {
    // 이미 완독한 책이거나 한 번 요청했으면 다시 보내지 않음
    if (isCompleted !== false || !hasReachedEnd || !isIdle) return;

    mutate({ bookId, bookTitle: bookTitle || null });
  }, [bookId, bookTitle, isCompleted, hasReachedEnd, isIdle, mutate]);
};
