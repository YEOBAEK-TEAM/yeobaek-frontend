export type MyProfile = {
  userId: number;
  nickname: string;
  consecutiveDays: number;
  completedBooks: number;
  collectedSentences: number;
  aiTraining: number;
};
export type MyBook = { bookId: number; bookTitle: string; author: string; coverUrl: string };
export type ReadingSession = MyBook & {
  id: string;
  userId: number;
  page: number;
  endPage: number;
  minutes: number;
  completed: boolean;
  createdAt: string;
};
export type ReadingDay = { date: string; sessions: ReadingSession[] };
export type LikedPage = MyBook & {
  id: string;
  userId: number;
  page: number;
  content: string;
  createdAt: string;
  liked: boolean;
};
export type LikedComment = MyBook & {
  id: string;
  commentId: string;
  userId: number;
  userName: string;
  page: number;
  content: string;
  createdAt: string;
  liked: boolean;
};
export type ReadingCategory = { name: string; percentage: number; color: string };
