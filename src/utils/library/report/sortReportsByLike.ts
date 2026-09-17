import type { MyReportResponse } from "@/types/library/report";

// 좋아요 우선, 같은 그룹 안에서는 작성일 최신순
export const sortReportsByLike = (reports: MyReportResponse[]) =>
  [...reports].sort((a, b) => {
    if (a.isLiked !== b.isLiked) return a.isLiked ? -1 : 1;

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
