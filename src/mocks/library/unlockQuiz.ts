import { books } from "@/mocks/books";
import { josa } from "@/utils/training/josa";

import type { UnlockQuizQuestion } from "@/types/library/unlockQuiz";

export type MockReadingStatus = "incomplete" | "completed" | "unlocked";

// 뷰어 책 상태를 한 번에 바꿔 확인, null이면 실제 완독 기록과 퀴즈 통과 기준
export const mockReadingStatusOverride: MockReadingStatus | null = null;

// 서재 해금예정 목록에 보일 완독했지만 아직 해금 전인 책과 완독일
export const mockCompletedBooks: { bookId: number; completedAt: string }[] = [
  { bookId: 1, completedAt: "2026-09-10" },
];

// 채점 요청 결과 확인용, error면 네트워크 오류
export const mockGradeScenario: "graded" | "error" = "graded";

export const MOCK_GRADE_DELAY_MS = 900;

export const findMockBook = (bookId: number) => books.find((book) => book.id === bookId);

export const getMockBookTitle = (bookId: number) => findMockBook(bookId)?.title ?? "이 책";

// 문제 문장은 시안 샘플, 실제 책 내용과 무관
export const buildMockQuizQuestions = (bookTitle: string): UnlockQuizQuestion[] => [
  {
    questionId: "q1",
    text: `'${bookTitle}'에서 주인공이 자전거를 타고 가는 이유로 가장 알맞은 것은 무엇인가요?`,
    choices: [
      { choiceId: "q1-a", text: "새로운 곳으로 도망치기 위해" },
      { choiceId: "q1-b", text: "잊고 있던 기억을 찾기 위해" },
      { choiceId: "q1-c", text: "누군가를 만나기 위해" },
      { choiceId: "q1-d", text: "단순히 운동을 하기 위해" },
    ],
  },
  {
    questionId: "q2",
    text: `작품 속에서 '${bookTitle}'${josa(bookTitle, "이", "가")} 상징하는 의미로 가장 적절한 것은 무엇인가요?`,
    choices: [
      { choiceId: "q2-a", text: "자유와 모험" },
      { choiceId: "q2-b", text: "고립된 세계" },
      { choiceId: "q2-c", text: "새로운 시작" },
      { choiceId: "q2-d", text: "과거의 기억" },
    ],
  },
  {
    questionId: "q3",
    text: "다음 중 작품의 결말에 대한 설명으로 가장 적절한 것은 무엇인가요?",
    choices: [
      { choiceId: "q3-a", text: "주인공은 고향으로 돌아간다" },
      { choiceId: "q3-b", text: "주인공은 여전히 같은 곳에 머문다" },
      { choiceId: "q3-c", text: "주인공은 자신만의 방식으로 앞으로 나아가기로 한다" },
      { choiceId: "q3-d", text: "주인공은 모든 것을 포기한다" },
    ],
  },
];
