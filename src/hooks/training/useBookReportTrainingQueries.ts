import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import {
  createTrainingSummation,
  getTrainingEntry,
  getTrainingMessages,
  getTrainingReview,
  getTrainingReviews,
  getTrainingSummation,
  sendTrainingMessage,
  startTraining,
} from "@/api/training/bookReportTraining";
import { getApiErrorStatus } from "@/utils/common/getApiErrorMessage";
import {
  toLearningSummary,
  toReadingReport,
  toTrainingChatMessages,
} from "@/utils/training/toTrainingView";

import type {
  SendTrainingMessageRequest,
  TrainingMessageListResponse,
} from "@/types/training/bookReportTraining";

// 독후감 훈련 query key 팩토리
export const bookReportTrainingKeys = {
  all: ["trainings", "book-report"] as const,
  entry: () => [...bookReportTrainingKeys.all, "entry"] as const,
  reviews: () => [...bookReportTrainingKeys.all, "reviews"] as const,
  review: (reviewId: number) => [...bookReportTrainingKeys.all, "review", reviewId] as const,
  messages: (trainingRoomId: number) =>
    [...bookReportTrainingKeys.all, "messages", trainingRoomId] as const,
  summation: (trainingRoomId: number) =>
    [...bookReportTrainingKeys.all, "summation", trainingRoomId] as const,
};

// 없음·권한 없음 응답은 다시 요청하지 않음
const retryUnlessNotFound = (failureCount: number, error: unknown) =>
  getApiErrorStatus(error) !== 404 && failureCount < 2;

export const useTrainingEntry = (enabled: boolean) =>
  useQuery({
    queryKey: bookReportTrainingKeys.entry(),
    queryFn: ({ signal }) => getTrainingEntry(signal),
    enabled,
    retry: retryUnlessNotFound,
    refetchOnWindowFocus: false,
  });

export const useTrainingReviews = (enabled: boolean) =>
  useInfiniteQuery({
    queryKey: bookReportTrainingKeys.reviews(),
    queryFn: ({ pageParam, signal }) => getTrainingReviews(pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    select: (data) => data.pages.flatMap((page) => page.items.map(toReadingReport)),
    enabled,
  });

export const trainingReviewQuery = (reviewId: number) =>
  queryOptions({
    queryKey: bookReportTrainingKeys.review(reviewId),
    queryFn: ({ signal }) => getTrainingReview(reviewId, signal),
    staleTime: 60_000,
  });

export const useTrainingReview = (reviewId: number | null) =>
  useQuery({
    ...trainingReviewQuery(reviewId ?? 0),
    select: toReadingReport,
    enabled: reviewId !== null,
    retry: retryUnlessNotFound,
  });

export const useStartTraining = () => useMutation({ mutationFn: startTraining, retry: 0 });

export const useTrainingMessages = (trainingRoomId: number | null) =>
  useInfiniteQuery({
    queryKey: bookReportTrainingKeys.messages(trainingRoomId ?? 0),
    queryFn: ({ pageParam, signal }) =>
      getTrainingMessages({ trainingRoomId: trainingRoomId ?? 0, cursor: pageParam, signal }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    select: (data) => toTrainingChatMessages(data.pages),
    enabled: trainingRoomId !== null,
    retry: retryUnlessNotFound,
    refetchOnWindowFocus: false,
  });

// AI 중복 호출 방지를 위해 자동 재시도 없음
export const useSendTrainingMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendTrainingMessage,
    retry: 0,
    onSuccess: (reply, { trainingRoomId, content }: SendTrainingMessageRequest) => {
      const queryKey = bookReportTrainingKeys.messages(trainingRoomId);

      // 이력 전체 재조회 없이 내 메시지와 AI 답변을 최신 페이지 앞에 추가
      queryClient.setQueryData<InfiniteData<TrainingMessageListResponse, number | null>>(
        queryKey,
        (data) => {
          if (!data) return data;

          const [latestPage, ...olderPages] = data.pages;
          const sentItems = [
            {
              role: "AI",
              content: reply.content,
              type: reply.messageType,
              createdAt: reply.createdAt,
            },
            { role: "USER", content, type: "TEXT", createdAt: reply.createdAt },
          ] as const;

          return {
            ...data,
            pages: [{ ...latestPage, items: [...sentItems, ...latestPage.items] }, ...olderPages],
          };
        },
      );
    },
  });
};

// 이미 만든 요약이면 생성 대신 조회
export const useCreateTrainingSummation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trainingRoomId: number) => {
      try {
        return await createTrainingSummation(trainingRoomId);
      } catch (error) {
        if (getApiErrorStatus(error) !== 409) throw error;

        return getTrainingSummation(trainingRoomId);
      }
    },
    retry: 0,
    onSuccess: (summation) => {
      queryClient.setQueryData(
        bookReportTrainingKeys.summation(summation.trainingRoomId),
        summation,
      );
      void queryClient.invalidateQueries({ queryKey: bookReportTrainingKeys.entry() });
    },
  });
};

export const useTrainingSummation = (trainingRoomId: number | null) =>
  useQuery({
    queryKey: bookReportTrainingKeys.summation(trainingRoomId ?? 0),
    queryFn: ({ signal }) => getTrainingSummation(trainingRoomId ?? 0, signal),
    select: toLearningSummary,
    enabled: trainingRoomId !== null,
    retry: retryUnlessNotFound,
  });
