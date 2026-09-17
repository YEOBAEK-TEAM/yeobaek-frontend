import { books } from "@/mocks/books";
import type { LikedComment, MyBook, MyProfile, ReadingCategory, ReadingDay } from "@/types/my";

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

export const mockLikedComments: LikedComment[] = [
  {
    id: "comment-1",
    commentId: "comment-1",
    ...getBook(2),
    userId: 2,
    userName: "하루",
    page: 30,
    content: "저도 이 부분에서 비슷한 감정을 느꼈어요. 정말 공감됩니다!",
    createdAt: "2026-03-14T09:00:00+09:00",
    liked: true,
  },
  {
    id: "comment-2",
    commentId: "comment-2",
    ...getBook(1),
    userId: 3,
    userName: "여름",
    page: 12,
    content: "다시 읽으니 처음과는 다른 문장이 마음에 남네요.",
    createdAt: "2026-03-13T09:00:00+09:00",
    liked: true,
  },
  {
    id: "comment-3",
    commentId: "comment-3",
    ...getBook(9),
    userId: 2,
    userName: "하루",
    page: 34,
    content: "한참을 멈춰 생각하게 하는 장면이었어요.",
    createdAt: "2026-03-12T09:00:00+09:00",
    liked: true,
  },
  {
    id: "comment-4",
    commentId: "comment-4",
    ...getBook(6),
    userId: 4,
    userName: "달",
    page: 24,
    content: "서로 다른 시선으로 읽은 이야기를 나눌 수 있어서 좋아요.",
    createdAt: "2026-03-11T09:00:00+09:00",
    liked: true,
  },
  {
    id: "comment-5",
    commentId: "comment-5",
    ...getBook(8),
    userId: 5,
    userName: "가을",
    page: 65,
    content: "책을 덮은 뒤에도 오래 기억하고 싶은 문장이에요.",
    createdAt: "2026-03-10T09:00:00+09:00",
    liked: true,
  },
];
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
