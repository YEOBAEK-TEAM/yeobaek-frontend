import {
  ONGOING_TRAINING_ACTION_LABEL,
  ONGOING_TRAINING_CHARACTER,
  ONGOING_TRAINING_LABEL,
} from "@/constants/training/ongoingTraining";

import { josa } from "@/utils/training/josa";

import type { OngoingTraining, OngoingTrainingView } from "@/types/training/ongoingTraining";

// 책 제목 모서리 괄호 표기
const withBracket = (bookTitle: string) => `『${bookTitle}』`;

export const resolveOngoingTraining = (training: OngoingTraining): OngoingTrainingView => {
  const { status, programId, bookTitle } = training;

  const book = withBracket(bookTitle);

  if (status === "in-progress") {
    if (programId === "book-report") {
      return {
        label: ONGOING_TRAINING_LABEL,
        title: "독후감으로 리티와 훈련하기",
        description: `${book}${josa(bookTitle, "을", "를")} 읽으며 남긴 생각을 바탕으로\n리티와 함께 더 깊이 생각하고 있어요`,
        character: ONGOING_TRAINING_CHARACTER.bookReport.src,
        characterClassName: ONGOING_TRAINING_CHARACTER.bookReport.className,
        actionLabel: ONGOING_TRAINING_ACTION_LABEL,
      };
    }

    return {
      label: ONGOING_TRAINING_LABEL,
      title: "리티와 이해력 증진중",
      description: `현재 ${book}${josa(bookTitle, "을", "를")} 읽으며 이해가 잘되지 않는\n부분을 짚어보고, 그 내용을 바탕으로\n생각을 한 단계 더 깊게 확장하고 있습니다.`,
      character: ONGOING_TRAINING_CHARACTER.comprehension.src,
      characterClassName: ONGOING_TRAINING_CHARACTER.comprehension.className,
      actionLabel: ONGOING_TRAINING_ACTION_LABEL,
    };
  }

  return {
    label: null,
    title: `제일 최근에 ${book}에 대한\n${programId === "book-report" ? "독후감" : "이해력 증진"} 훈련을 진행하셨습니다!`,
    description:
      programId === "book-report"
        ? "다양한 독후감에 대해 리티와 대화하며\n기존에 있던 생각들을 확장시켜나가봐요"
        : "꾸준히 책을 읽으며 새로운 지식을 쌓고,\n더 넓고 깊은 생각으로 나아가 보세요",
    character: ONGOING_TRAINING_CHARACTER.completed.src,
    characterClassName: ONGOING_TRAINING_CHARACTER.completed.className,
    actionLabel: null,
  };
};
