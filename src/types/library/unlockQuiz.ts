export type ReportUnlockStatusResponse = {
  bookId: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  hasReport: boolean;
  quizQuestionCount: number;
};

// 다 읽었지만 퀴즈를 아직 통과하지 못한 책
export type PendingUnlockBookResponse = {
  bookId: number;
  bookTitle: string;
  author: string;
  coverUrl: string;
  completedAt: string;
};

export type PendingUnlockBookView = {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  completedAt: string;
  completedLabel: string;
};

export type UnlockQuizChoice = {
  choiceId: string;
  text: string;
};

// 정답 정보는 응답에 포함하지 않음
export type UnlockQuizQuestion = {
  questionId: string;
  text: string;
  choices: UnlockQuizChoice[];
};

export type UnlockQuizResponse = {
  quizId: string;
  bookId: number;
  bookTitle: string;
  questions: UnlockQuizQuestion[];
};

// 문제 id별 선택한 보기 id
export type UnlockQuizAnswers = Record<string, string>;

export type GradeUnlockQuizRequest = {
  quizId: string;
  bookId: number;
  answers: UnlockQuizAnswers;
};

export type GradeUnlockQuizResponse = {
  result: "unlocked" | "failed";
};
