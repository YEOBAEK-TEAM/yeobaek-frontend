import {
  mockReadingProgress,
  mockRecentReport,
  mockTasteBooks,
  mockTasteTopBooks,
  mockTodaySentence,
} from "@/mocks/home/home";

import type { ReadingProgress, RecentReport, TasteBook, TodaySentence } from "@/types/home/home";

// 현재 읽는 책 진행률 조회
export const getReadingProgress = async (): Promise<ReadingProgress | null> => {
  return mockReadingProgress;
};

// 최근 독후감 조회
export const getRecentReport = async (): Promise<RecentReport | null> => {
  return mockRecentReport;
};

// 오늘의 문장 조회
export const getTodaySentence = async (): Promise<TodaySentence> => {
  return mockTodaySentence;
};

// 취향 반영 추천 도서 조회
export const getTasteBooks = async (): Promise<TasteBook[]> => {
  return mockTasteBooks;
};

// 취향 도서 TOP 10 조회
export const getTasteTopBooks = async (): Promise<TasteBook[]> => {
  return mockTasteTopBooks;
};
