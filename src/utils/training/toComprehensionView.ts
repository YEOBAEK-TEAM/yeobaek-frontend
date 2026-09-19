import { formatPageRange } from "@/utils/training/formatPageRange";

import type {
  BookmarkItemResponse,
  BookmarkView,
  ComprehensionMessage,
  ComprehensionSummary,
  UnderstandMessageItemResponse,
  UnderstandMessageListResponse,
  UnderstandStartResponse,
  UnderstandSummationResponse,
} from "@/types/training/comprehension";

export const toBookmarkViews = (items: BookmarkItemResponse[]): BookmarkView[] =>
  items.map((item) => ({
    key: `${item.bookId}-${item.startPageNumber}-${item.endPageNumber}`,
    bookId: item.bookId,
    title: item.bookTitle,
    author: item.author ?? "",
    coverUrl: item.coverImageUrl ?? "",
    pageLabel: formatPageRange(item.startPageNumber, item.endPageNumber),
    targetIds: item.pages.map((page) => page.pageId),
  }));

export const toComprehensionBook = (room: UnderstandStartResponse) => ({
  title: room.bookTitle,
  author: room.author ?? "",
  coverUrl: room.bookImageUrl ?? "",
  pageLabel: formatPageRange(room.startPageNumber, room.endPageNumber),
});

// 최신순 페이지를 오래된 메시지부터 화면 메시지로 변환
export const toComprehensionMessages = (
  pages: UnderstandMessageListResponse[],
): ComprehensionMessage[] => {
  const items = pages.flatMap((page) => page.items).reverse();
  const counts = new Map<string, number>();

  return items.map((item: UnderstandMessageItemResponse) => {
    // 응답에 메시지 id가 없어 시각·발신자 기준 key 생성
    const baseId = `${item.role}-${item.createdAt}`;
    const count = counts.get(baseId) ?? 0;
    counts.set(baseId, count + 1);

    return {
      id: `understand-${baseId}-${count}`,
      role: item.role === "AI" ? "riti" : "user",
      kind: "text",
      text: item.content,
      sentAt: item.createdAt,
    };
  });
};

export const toComprehensionSummary = (
  summation: UnderstandSummationResponse,
): ComprehensionSummary => ({
  bookTitle: summation.bookTitle,
  pageRange: summation.range,
  topic: summation.subject,
});
