import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createUnderstandRoom,
  createUnderstandSummation,
  getBookmarks,
  getUnderstandMessages,
  getUnderstandSummation,
  sendUnderstandMessage,
} from "@/api/training/comprehension/understandApi";
import { getApiErrorStatus } from "@/utils/common/getApiErrorMessage";
import {
  toBookmarkViews,
  toComprehensionBook,
  toComprehensionMessages,
  toComprehensionSummary,
} from "@/utils/training/toComprehensionView";

// 이해력 증진 query key 팩토리
export const understandKeys = {
  all: ["trainings", "understand"] as const,
  bookmarks: () => [...understandKeys.all, "bookmarks"] as const,
  messages: (understandRoomId: number) =>
    [...understandKeys.all, "messages", understandRoomId] as const,
  summation: (understandRoomId: number) =>
    [...understandKeys.all, "summation", understandRoomId] as const,
};

// 없음·권한 없음 응답은 다시 요청하지 않음
const retryUnlessNotFound = (failureCount: number, error: unknown) =>
  getApiErrorStatus(error) !== 404 && failureCount < 2;

export const useBookmarks = () =>
  useInfiniteQuery({
    queryKey: understandKeys.bookmarks(),
    queryFn: ({ pageParam, signal }) => getBookmarks({ ...pageParam, signal }),
    initialPageParam: {} as { cursorSavedAt?: string; cursorId?: number },
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursorSavedAt && lastPage.nextCursorId
        ? { cursorSavedAt: lastPage.nextCursorSavedAt, cursorId: lastPage.nextCursorId }
        : undefined,
    select: (data) => toBookmarkViews(data.pages.flatMap((page) => page.items)),
    staleTime: 60_000,
  });

export const useCreateUnderstandRoom = () =>
  useMutation({ mutationFn: createUnderstandRoom, retry: 0 });

export const useUnderstandMessages = (understandRoomId: number | null) =>
  useInfiniteQuery({
    queryKey: understandKeys.messages(understandRoomId ?? 0),
    queryFn: ({ pageParam, signal }) =>
      getUnderstandMessages({ understandRoomId: understandRoomId ?? 0, cursor: pageParam, signal }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    select: (data) => ({
      messages: toComprehensionMessages(data.pages),
      status: data.pages[0]?.status ?? null,
      book: data.pages[0] ? toComprehensionBook(data.pages[0]) : null,
    }),
    enabled: understandRoomId !== null,
    retry: retryUnlessNotFound,
    refetchOnWindowFocus: false,
  });

// AI 중복 호출 방지를 위해 자동 재시도 없음
export const useSendUnderstandMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendUnderstandMessage,
    retry: 0,
    onSuccess: (reply, { understandRoomId, content }) => {
      // 이력 전체 재조회 없이 내 메시지와 AI 답변을 최신 페이지 앞에 추가
      queryClient.setQueryData(understandKeys.messages(understandRoomId), (data: unknown) => {
        const cached = data as { pages: { items: unknown[] }[]; pageParams: unknown[] } | undefined;
        if (!cached) return cached;

        const [latestPage, ...olderPages] = cached.pages;
        const sentItems = [
          {
            role: "AI",
            content: reply.content,
            type: reply.messageType,
            createdAt: reply.createdAt,
          },
          { role: "USER", content, type: "TEXT", createdAt: reply.createdAt },
        ];

        return {
          ...cached,
          pages: [{ ...latestPage, items: [...sentItems, ...latestPage.items] }, ...olderPages],
        };
      });
    },
  });
};

// 이미 만든 요약이면 조회로 대체
export const useUnderstandSummation = (understandRoomId: number | null) =>
  useQuery({
    queryKey: understandKeys.summation(understandRoomId ?? 0),
    queryFn: ({ signal }) => getUnderstandSummation(understandRoomId ?? 0, signal),
    select: toComprehensionSummary,
    enabled: understandRoomId !== null,
    retry: retryUnlessNotFound,
  });

export const useCreateUnderstandSummation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (understandRoomId: number) => {
      try {
        return await getUnderstandSummation(understandRoomId);
      } catch (error) {
        // 아직 요약이 없을 때만 생성
        if (getApiErrorStatus(error) !== 404) throw error;

        return createUnderstandSummation(understandRoomId);
      }
    },
    retry: 0,
    onSuccess: (summation) => {
      queryClient.setQueryData(understandKeys.summation(summation.understandRoomId), summation);
      void queryClient.invalidateQueries({ queryKey: ["trainings", "understand", "latest"] });
    },
  });
};
