import { books } from "@/mocks/books";
import type { MyBook, MyProfile, ReadingCategory, ReadingDay } from "@/types/my";

export const myProfile: MyProfile = {
  userId: 1,
  nickname: "서후",
  consecutiveDays: 5,
  completedBooks: 12,
  collectedSentences: 148,
  aiTraining: 32,
};
export const myReferenceDate = "2026-09-16";
export const myBooks: MyBook[] = books.map((book) => ({
  bookId: book.id,
  bookTitle: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
}));
function getBook(bookId: number): MyBook {
  return myBooks.find((book) => book.bookId === bookId)!;
}

// 월별 기록은 날짜 키로 분리하며, 하루에 여러 권을 읽을 수 있습니다.
export const mockReadingDays: ReadingDay[] = [
  ...[8, 9, 10].flatMap((month) =>
    [2, 5, 8, 12, 13, 14, 15, 16].map((day, index) => {
      const date = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const counts = [20, 45, 70, 30, 60, 90, 25, 120];
      const total = counts[index] + (month === 8 ? 5 : month === 10 ? 10 : 0);
      const bookIds = day === 16 ? [6, 9, 8] : [index % 2 === 0 ? 9 : 6];
      return {
        date,
        sessions: bookIds.map((bookId, position) => ({
          ...getBook(bookId),
          id: `${date}-${bookId}`,
          userId: 1,
          page: 24,
          endPage:
            23 +
            (position === bookIds.length - 1
              ? total - Math.floor(total / bookIds.length) * position
              : Math.floor(total / bookIds.length)),
          minutes: Math.round((total * 1.5) / bookIds.length),
          completed: day === 16,
          createdAt: `${date}T20:00:00+09:00`,
        })),
      };
    }),
  ),
];
export const readingCategories: ReadingCategory[] = [
  { name: "소설", percentage: 60, color: "#60694B" },
  { name: "에세이", percentage: 20, color: "#BBC1AA" },
  { name: "인문", percentage: 10, color: "#9CA58A" },
  { name: "자기계발", percentage: 10, color: "#7D886A" },
];
