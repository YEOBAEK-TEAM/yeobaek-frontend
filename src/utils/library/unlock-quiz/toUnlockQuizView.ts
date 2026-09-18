import type {
  SubmitUnlockQuizRequest,
  UnlockQuizAnswers,
  UnlockQuizResponse,
  UnlockQuizView,
} from "@/types/library/unlockQuiz";

// 선택지 id는 서버 선택 번호(1부터)를 문자열로 사용
export const toUnlockQuizView = (response: UnlockQuizResponse): UnlockQuizView => ({
  bookTitle: response.bookTitle,
  questions: [...response.questions]
    .sort((a, b) => a.questionOrder - b.questionOrder)
    .map((question) => ({
      questionId: String(question.quizId),
      text: question.question,
      choices: question.choices.map((choice, index) => ({
        choiceId: String(index + 1),
        text: choice,
      })),
    })),
});

export const toSubmitUnlockQuizRequest = (answers: UnlockQuizAnswers): SubmitUnlockQuizRequest => ({
  answers: Object.entries(answers).map(([questionId, choiceId]) => ({
    quizId: Number(questionId),
    selectedIndex: Number(choiceId),
  })),
});
