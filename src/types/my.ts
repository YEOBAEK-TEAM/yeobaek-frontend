export type MonthlyReadingRecord = {
  year: number;
  month: number;
  completedBooks: number;
  pagesRead: number;
  readingHours: number;
};
export type WeeklyReadingPage = { date: string; pagesRead: number };
export type MyPageResponse = {
  nickname: string;
  profileImageUrl: string;
  streakDays: number;
  totalCompletedBooks: number;
  totalCollectedSentences: number;
  totalTrainingCount: number;
  monthlyRecord: MonthlyReadingRecord;
  weeklyPages: WeeklyReadingPage[];
};
export type MyPageParams = { year?: number; month?: number };

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

export type ReadingCategory = { name: string; percentage: number; color: string };
