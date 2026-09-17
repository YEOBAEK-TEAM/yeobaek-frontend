import { useQuery } from "@tanstack/react-query";
import {
  getLikedPages,
  getLikedPagesByBook,
  getBookmarkedPages,
  getBookmarkedPagesByBook,
} from "@/api/activity";
import type { ActivityPage, ActivityPageParams } from "@/types/activity";

// Search covers the entire collection, not just the first cursor page.
async function getAllPages(
  getPage: typeof getLikedPages,
  bookId: number | undefined,
  signal: AbortSignal,
) {
  const items = new Map<number, ActivityPage>();
  const cursors = new Set<string>();
  let params: ActivityPageParams = { bookId, size: 50 };
  while (true) {
    signal.throwIfAborted();
    const page = await getPage(params, signal);
    page.items.forEach((item) => items.set(item.pageId, item));
    if (!page.hasNext) return [...items.values()];
    const { nextCursorSavedAt, nextCursorId } = page;
    const cursor = `${nextCursorSavedAt}:${nextCursorId}`;
    if (nextCursorSavedAt === null || nextCursorId === null || cursors.has(cursor)) {
      throw new Error("활동 목록의 다음 페이지를 불러올 수 없습니다.");
    }
    cursors.add(cursor);
    params = { bookId, size: 50, cursorSavedAt: nextCursorSavedAt, cursorId: nextCursorId };
  }
}

export const useLikedPages = (enabled = true, bookId?: number) =>
  useQuery({
    queryKey: ["activity", "liked-pages", { bookId }],
    queryFn: ({ signal }) => getAllPages(getLikedPages, bookId, signal),
    enabled,
  });

export const useBookmarkedPages = (enabled = true, bookId?: number) =>
  useQuery({
    queryKey: ["activity", "bookmarked-pages", { bookId }],
    queryFn: ({ signal }) => getAllPages(getBookmarkedPages, bookId, signal),
    enabled,
  });

export const useLikedPagesByBook = (enabled = true) =>
  useQuery({
    queryKey: ["activity", "liked-pages", "books"],
    queryFn: ({ signal }) => getLikedPagesByBook(signal),
    enabled,
  });

export const useBookmarkedPagesByBook = (enabled = true) =>
  useQuery({
    queryKey: ["activity", "bookmarked-pages", "books"],
    queryFn: ({ signal }) => getBookmarkedPagesByBook(signal),
    enabled,
  });
