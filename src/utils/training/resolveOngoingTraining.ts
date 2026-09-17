import {
  EMPTY_ONGOING_TRAINING,
  ONGOING_TRAINING_CHARACTER,
  ONGOING_TRAINING_LABEL,
} from "@/constants/training/ongoingTraining";

import type { OngoingTraining, OngoingTrainingView } from "@/types/training/ongoingTraining";

// 책 제목은 모서리 괄호로 감싸 노출
const withBracket = (bookTitle: string) => `『${bookTitle}』`;

// 받침 유무에 따른 조사 선택
const josa = (word: string, withFinal: string, withoutFinal: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const isHangul = code >= 0 && code <= 11171;

  return isHangul && code % 28 !== 0 ? withFinal : withoutFinal;
};

export const resolveOngoingTraining = (training: OngoingTraining): OngoingTrainingView => {
  const { status, programId, bookTitle } = training;

  if (status === "empty" || !programId || !bookTitle) {
    return {
      label: null,
      ...EMPTY_ONGOING_TRAINING,
      character: ONGOING_TRAINING_CHARACTER.empty.src,
      characterClassName: ONGOING_TRAINING_CHARACTER.empty.className,
    };
  }

  const book = withBracket(bookTitle);

  if (status === "in-progress") {
    if (programId === "book-report") {
      return {
        label: ONGOING_TRAINING_LABEL,
        title: "독후감으로 리티와 훈련하기",
        description: `${book}${josa(bookTitle, "을", "를")} 읽으며 남긴 생각을 바탕으로 공백의\nAI의 리티와 함께 더 깊이 생각하고 있어요`,
        character: ONGOING_TRAINING_CHARACTER.bookReport.src,
        characterClassName: ONGOING_TRAINING_CHARACTER.bookReport.className,
      };
    }

    return {
      label: ONGOING_TRAINING_LABEL,
      title: "리티와 이해력 증진중",
      description: `현재 ${book}${josa(bookTitle, "을", "를")} 읽으며 이해가 잘되지 않는\n부분을 짚어보고, 그 내용을 바탕으로\n생각을 한 단계 더 깊게 확장하고 있습니다.`,
      character: ONGOING_TRAINING_CHARACTER.comprehension.src,
      characterClassName: ONGOING_TRAINING_CHARACTER.comprehension.className,
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
  };
};
