// 정답 정보는 응답에 포함하지 않음
export type UnlockQuizQuestionResponse = {
  quizId: number;
  questionOrder: number;
  question: string;
  choices: string[];
};

export type UnlockQuizResponse = {
  questions: UnlockQuizQuestionResponse[];
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
  questions: UnlockQuizQuestion[];
};

// 문제 id별 선택한 보기 id
export type UnlockQuizAnswers = Record<string, string>;
