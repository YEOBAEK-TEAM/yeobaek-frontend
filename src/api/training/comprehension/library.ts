import {
  mockBookmarks,
  mockComprehensionSummary,
  mockLibraryBooks,
} from "@/mocks/training/library";

import type { Bookmark, ComprehensionSummary, LibraryBook } from "@/types/training/comprehension";

// 내 서재 조회
export const getLibraryBooks = async (): Promise<LibraryBook[]> => {
  return mockLibraryBooks;
};

// 내 책갈피 조회
export const getBookmarks = async (): Promise<Bookmark[]> => {
  return mockBookmarks;
};

// 이해력 증진 학습 요약 조회
export const getComprehensionSummary = async (): Promise<ComprehensionSummary> => {
  return mockComprehensionSummary;
};
