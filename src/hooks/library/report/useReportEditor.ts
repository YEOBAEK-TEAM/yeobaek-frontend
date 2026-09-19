import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createBookReview, getBookReviewDetail, updateBookReview } from "@/api/library/report";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";
import { toReportEditorView } from "@/utils/library/report/toReportView";

import type { SaveBookReviewRequest } from "@/types/library/report";

export const useReportDetail = (reviewId: number | null) =>
  useQuery({
    queryKey: libraryReportKeys.detail(reviewId ?? 0),
    queryFn: ({ signal }) => getBookReviewDetail(reviewId ?? 0, signal),
    select: toReportEditorView,
    enabled: reviewId !== null,
    refetchOnWindowFocus: false,
    retry: false,
  });

// 새 독후감은 작성, 이미 있는 독후감은 수정으로 저장
export const useSaveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, bookId, ...body }: SaveBookReviewRequest) =>
      reviewId === null ? createBookReview({ bookId, ...body }) : updateBookReview(reviewId, body),
    retry: 0,
    onSuccess: (review) => {
      // 첫 저장 후 주소가 바뀌어도 입력 화면이 끊기지 않도록 상세 캐시 선반영
      queryClient.setQueryData(libraryReportKeys.detail(review.reviewId), review);

      [libraryReportKeys.latest(), libraryReportKeys.mine()].forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      );
    },
  });
};
