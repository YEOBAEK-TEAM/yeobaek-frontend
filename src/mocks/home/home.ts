import { books } from "@/mocks/books";

import type { ReadingProgress, RecentReport, TasteBook, TodaySentence } from "@/types/home/home";

const findBook = (title: string) => books.find((book) => book.title === title);

const toProgress = (title: string, currentPage: number): ReadingProgress => {
  const book = findBook(title);

  return {
    bookId: book?.id ?? 0,
    bookTitle: title,
    coverUrl: book?.coverUrl ?? "",
    currentPage,
    totalPages: book?.totalPages ?? 300,
  };
};

// 상태별 확인용 목데이터
export const mockReadingProgressStates = {
  reading: toProgress("수족관", 150),
  finished: toProgress("수족관", 300),
  none: null,
};

export const mockRecentReportStates = {
  writing: {
    reportId: 1,
    bookId: findBook("궤도")?.id ?? 0,
    bookTitle: "궤도",
    coverUrl: findBook("궤도")?.coverUrl ?? "",
    reportTitle: "궤도를 도는 마음에 대해서",
    status: "writing",
  },
  completed: {
    reportId: 2,
    bookId: findBook("궤도")?.id ?? 0,
    bookTitle: "궤도",
    coverUrl: findBook("궤도")?.coverUrl ?? "",
    reportTitle: "궤도를 도는 마음에 대해서",
    status: "completed",
  },
  none: null,
} satisfies Record<string, RecentReport | null>;

// 목록을 바꾸면 각 상태를 바로 확인 가능
export const mockReadingProgress = mockReadingProgressStates.reading;

export const mockRecentReport: RecentReport | null = mockRecentReportStates.completed;

export const mockTodaySentence: TodaySentence = {
  content:
    "읽는 동안에는 나의 시간이 잠시 멈춘다.\n페이지를 넘길 때마다 조금씩 다른 사람이 되어\n책을 덮는 순간의 나는 펼치던 때와 다르다.",
  author: "여백",
  genre: "산문",
  bookTitle: "여백의 기록",
};

export const mockTasteBooks: TasteBook[] = books
  .filter((book) => book.isInLibrary)
  .map((book) => ({
    bookId: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publishedAt: book.publishedAt,
    coverUrl: book.coverUrl,
  }));

export const mockTasteTopBooks: TasteBook[] = mockTasteBooks.slice(0, 10);
