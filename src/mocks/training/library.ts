import { books } from "@/mocks/books";

import type { Bookmark, ComprehensionSummary, LibraryBook } from "@/types/training/comprehension";

const findBook = (title: string) => books.find((book) => book.title === title);

const toLibraryBook = (title: string, author: string): LibraryBook => {
  const book = findBook(title);

  return {
    bookId: book?.id ?? 0,
    title,
    author,
    coverUrl: book?.coverUrl ?? "",
  };
};

// 내 서재 목데이터
export const mockLibraryBooks: LibraryBook[] = [
  toLibraryBook("투명한 나선", "히가시노 게이고 · 김선영(옮긴이)"),
  toLibraryBook("우리가 빛의 속도로 갈 수 없다면", "김초엽"),
  toLibraryBook("급류", "정대건"),
  toLibraryBook("양면의 조개껍데기", "김초엽"),
];

// 내 책갈피 목데이터
export const mockBookmarks: Bookmark[] = [
  { ...mockLibraryBooks[0], bookmarkId: "bm-1", startPage: 25, endPage: 25 },
  { ...mockLibraryBooks[2], bookmarkId: "bm-2", startPage: 25, endPage: 25 },
  { ...mockLibraryBooks[2], bookmarkId: "bm-3", startPage: 100, endPage: 102 },
  { ...mockLibraryBooks[2], bookmarkId: "bm-4", startPage: 110, endPage: 110 },
];

// 학습 요약 목데이터
export const mockComprehensionSummary: ComprehensionSummary = {
  bookTitle: "투명한 나선",
  pageRange: "25페이지",
  topic: "인물이 규칙 앞에서 어떤 선택을 했는가",
};
