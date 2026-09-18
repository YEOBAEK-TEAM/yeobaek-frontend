// 정답 정보는 응답에 포함하지 않음
export type UnlockQuizQuestionResponse = {
  quizId: number;
  questionOrder: number;
  question: string;
  choices: string[];
};

export type UnlockQuizResponse = {
  bookTitle: string;
  questions: UnlockQuizQuestionResponse[];
};

// 완독했지만 퀴즈를 아직 통과하지 못한 책
export type PendingUnlockBookResponse = {
  bookId: number;
  bookTitle: string;
  author: string;
  coverImageUrl: string | null;
  completedAt: string;
};

export type PendingUnlockBookView = {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  completedLabel: string;
};

export type SubmitUnlockQuizRequest = {
  // 선택지 번호는 1부터 시작
  answers: { quizId: number; selectedIndex: number }[];
};

export type SubmitUnlockQuizResponse = {
  passed: boolean;
  correctCount: number;
  totalCount: number;
};

export type CompleteReadingResponse = {
  recordId: number;
  bookId: number;
  bookTitle: string;
  progressRate: number;
  completedAt: string;
};

export type UnlockQuizChoice = {
  choiceId: string;
  text: string;
};

export type UnlockQuizQuestion = {
  questionId: string;
  text: string;
  choices: UnlockQuizChoice[];
};

export type UnlockQuizView = {
  bookTitle: string;
  questions: UnlockQuizQuestion[];
};

// 문제 id별 선택한 보기 id
export type UnlockQuizAnswers = Record<string, string>;
