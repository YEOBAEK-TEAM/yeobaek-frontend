import {
  getRememberedCompletion,
  getRememberedCompletions,
  getRememberedUnlocks,
  isRememberedCompleted,
  rememberCompleted,
  rememberUnlocked,
} from "@/api/library/mockUnlockMemory";
import { getMyReports, getUnlockedBooks } from "@/api/library/report";
import {
  buildMockQuizQuestions,
  findMockBook,
  getMockBookTitle,
  MOCK_GRADE_DELAY_MS,
  mockCompletedBooks,
  mockGradeScenario,
  mockReadingStatusOverride,
} from "@/mocks/library/unlockQuiz";
import { MOCK_UNLOCK_ANSWER_KEY } from "@/mocks/library/unlockQuizAnswerKey";

import type {
  GradeUnlockQuizRequest,
  GradeUnlockQuizResponse,
  PendingUnlockBookResponse,
  ReportUnlockStatusResponse,
  UnlockQuizResponse,
} from "@/types/library/unlockQuiz";

const MOCK_DELAY_MS = 300;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

// 책의 완독·해금·독후감 작성 여부 조회
export const getReportUnlockStatus = async (
  bookId: number,
): Promise<ReportUnlockStatusResponse> => {
  const override = mockReadingStatusOverride;

  const myReports = await getMyReports();

  // 뷰어는 실제 책 id를 쓰므로 서재 목 목록과 무관하게 실제 완독 기록과 퀴즈 통과로만 판단
  const isUnlockedByQuiz = getRememberedUnlocks().some(([unlockedId]) => unlockedId === bookId);
  const isUnlocked = isUnlockedByQuiz || override === "unlocked";

  return {
    bookId,
    isCompleted:
      isUnlocked ||
      override === "completed" ||
      (override !== "incomplete" && isRememberedCompleted(bookId)),
    isUnlocked,
    hasReport: myReports.some((report) => report.bookId === bookId),
    quizQuestionCount: Object.keys(MOCK_UNLOCK_ANSWER_KEY).length,
  };
};

// 해금 예정 도서 조회, 완독했지만 퀴즈를 통과하지 않은 책
export const getPendingUnlockBooks = async (): Promise<PendingUnlockBookResponse[]> => {
  const unlockedIds = new Set([
    ...(await getUnlockedBooks()).map((book) => book.bookId),
    ...getRememberedUnlocks().map(([bookId]) => bookId),
  ]);

  const completions = new Map([
    ...mockCompletedBooks.map(
      (book): [number, { completedAt: string; bookTitle: string | null }] => [
        book.bookId,
        { completedAt: book.completedAt, bookTitle: null },
      ],
    ),
    ...getRememberedCompletions(),
  ]);

  return [...completions]
    .filter(([bookId]) => !unlockedIds.has(bookId))
    .map(([bookId, { completedAt, bookTitle }]) => {
      const book = findMockBook(bookId);

      return {
        bookId,
        bookTitle: bookTitle ?? book?.title ?? "",
        author: book?.author ?? "",
        coverUrl: book?.coverUrl ?? "",
        completedAt,
      };
    });
};

// 완독 처리
export const completeReading = async ({
  bookId,
  bookTitle,
}: {
  bookId: number;
  bookTitle: string | null;
}): Promise<void> => {
  await wait(MOCK_DELAY_MS);

  rememberCompleted(bookId, bookTitle);
};

// 해금 퀴즈 조회, 문제와 보기만 내려옴
export const getUnlockQuiz = async (bookId: number): Promise<UnlockQuizResponse> => {
  await wait(MOCK_DELAY_MS);

  // 완독하지 않은 책은 퀴즈를 받을 수 없음
  const [{ isCompleted }, pendingBooks] = await Promise.all([
    getReportUnlockStatus(bookId),
    getPendingUnlockBooks(),
  ]);
  const pendingBook = pendingBooks.find((book) => book.bookId === bookId);

  if (!isCompleted && !pendingBook) throw new Error("NOT_COMPLETED");

  const bookTitle =
    getRememberedCompletion(bookId)?.bookTitle ||
    pendingBook?.bookTitle ||
    getMockBookTitle(bookId);

  return {
    quizId: `quiz-${bookId}-${Date.now()}`,
    bookId,
    bookTitle,
    questions: buildMockQuizQuestions(bookTitle),
  };
};

// 답안 채점, 모두 맞으면 해금
export const gradeUnlockQuiz = async ({
  bookId,
  answers,
}: GradeUnlockQuizRequest): Promise<GradeUnlockQuizResponse> => {
  await wait(MOCK_GRADE_DELAY_MS);

  if (mockGradeScenario === "error") throw new Error("GRADE_FAILED");

  const isAllCorrect = Object.entries(MOCK_UNLOCK_ANSWER_KEY).every(
    ([questionId, choiceId]) => answers[questionId] === choiceId,
  );

  if (!isAllCorrect) return { result: "failed" };

  rememberUnlocked(bookId);

  return { result: "unlocked" };
};
