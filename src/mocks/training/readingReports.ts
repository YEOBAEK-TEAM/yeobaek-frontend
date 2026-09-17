import { books } from "@/mocks/books";

import type { LearningSummary, ReadingReport } from "@/types/training/readingReport";

// 도서 목데이터 표지 참조
const coverOf = (title: string) => books.find((book) => book.title === title)?.coverUrl ?? "";

// 독후감 목록 목데이터
export const mockReadingReports: ReadingReport[] = [
  {
    reportId: 1,
    bookId: 5,
    bookTitle: "모순",
    coverUrl: coverOf("모순"),
    reportTitle: "선택하지 않은 삶은 어디로 가는가",
    createdAt: "2026-09-06",
  },
  {
    reportId: 2,
    bookId: 4,
    bookTitle: "인간실격",
    coverUrl: coverOf("참을 수 없는 존재의 가벼움"),
    reportTitle: "인간실격은 정말 인간으로서 실패한 것 일까?",
    createdAt: "2026-09-05",
  },
  {
    reportId: 3,
    bookId: 2,
    bookTitle: "불편한 편의점",
    coverUrl: coverOf("수족관"),
    reportTitle: "작은 친절이 사람을 다시 살아가게 하는 방법이란",
    createdAt: "2026-09-04",
  },
  {
    reportId: 4,
    bookId: 6,
    bookTitle: "위로의 미술관",
    coverUrl: coverOf("우리가 빛의 속도로 갈 수 없다면"),
    reportTitle: "그림이 건네는 조용한 위로",
    createdAt: "2026-09-03",
  },
];

export const mockLearningSummary: LearningSummary = {
  bookTitle: "인간실격",
  topic: "요조는 인간으로서 실패한 사람인가",
  growthPoint: "실패의 기준을 타인의 시선에서 자기 자신으로 옮겨 생각함",
};
