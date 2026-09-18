import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import { likeBookReview, unlikeBookReview } from "@/api/library/report";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";

import type { BookReviewListResponse } from "@/types/library/report";

const SEND_DELAY_MS = 400;

type LikeRequest = {
  reviewId: number;
  isLiked: boolean;
};

// 화면은 즉시 반영, 연타가 멈춘 뒤 마지막 상태만 서버에 전송
export const useToggleReportLike = (onError: () => void) => {
  const queryClient = useQueryClient();

  const pendingRef = useRef(new Map<number, { timer: number; isLiked: boolean }>());

  const { mutate } = useMutation({
    mutationFn: ({ reviewId, isLiked }: LikeRequest) =>
      isLiked ? likeBookReview(reviewId) : unlikeBookReview(reviewId),
    // 누른 자리에서 카드가 튀지 않도록 재정렬은 다음 진입 때 반영
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: libraryReportKeys.mine(),
        refetchType: "none",
      }),
    onError: () => {
      // 실패하면 서버 상태로 되돌림
      void queryClient.invalidateQueries({ queryKey: libraryReportKeys.mine() });
      onError();
    },
  });

  const toggle = useCallback(
    (reviewId: number) => {
      let nextLiked = false;

      queryClient.setQueriesData<InfiniteData<BookReviewListResponse, number>>(
        { queryKey: libraryReportKeys.mine() },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => {
                if (item.reviewId !== reviewId) return item;

                nextLiked = !item.isLiked;
                return { ...item, isLiked: nextLiked };
              }),
            })),
          },
      );

      const pending = pendingRef.current;
      window.clearTimeout(pending.get(reviewId)?.timer);

      const timer = window.setTimeout(() => {
        pending.delete(reviewId);
        mutate({ reviewId, isLiked: nextLiked });
      }, SEND_DELAY_MS);

      pending.set(reviewId, { timer, isLiked: nextLiked });
    },
    [queryClient, mutate],
  );

  // 화면을 떠날 때 대기 중인 요청은 바로 전송
  useEffect(() => {
    const pending = pendingRef.current;

    return () => {
      pending.forEach(({ timer, isLiked }, reviewId) => {
        window.clearTimeout(timer);
        mutate({ reviewId, isLiked });
      });
      pending.clear();
    };
  }, [mutate]);

  return toggle;
};
