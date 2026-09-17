import { Lightbulb, NotepadText, Quote } from "lucide-react";

import FailCharacter from "@/assets/images/books/question/FailCharacter.png";

export const UNLOCK_QUIZ_PATH = (bookId: number) => `/library/books/${bookId}/unlock-quiz`;

export const REPORT_UNLOCK_BUTTON_LABEL = "독후감 쓰기";

export const UNLOCK_GUIDE = {
  title: "완독을 축하합니다",
  getDescription: (questionCount: number) =>
    `독후감을 작성하기 전에,\n책의 내용을 확인하는 ${questionCount}개의\n문제가 제시됩니다`,
  startLabel: "시작하기",
  loadErrorText: "문제를 불러오지 못했어요. 다시 시도해 주세요",
};

export const UNLOCK_GUIDE_RULES = [
  "모든 문제는 객관식으로 출제됩니다",
  "책의 주요 내용에서 출제됩니다",
  "모든 문제를 다 맞춰야 독후감이 해금됩니다",
];

export const UNLOCK_QUIZ = {
  getTitle: (bookTitle: string) => `${bookTitle}에 대해서`,
  nextLabel: "다음문제",
  submitLabel: "제출하기",
  exitMessage:
    "문제를 나중에 푸시겠어요?\n서재 > 독후감 쓰기 > 해금 예정에서\n언제든 다시 풀 수 있어요.",
  loadErrorText: "문제를 불러오지 못했어요",
};

export const CHOICE_LABELS = ["A", "B", "C", "D", "E", "F"];

export const GRADING = {
  title: "리티가 답안을 확인하고 있어요",
  description: "책의 내용을 종합적으로 분석하여\n응답을 검토하고 있습니다.",
  getStepLabel: (questionNumber: number) => `${questionNumber}번문제 확인`,
  waitingText: "잠시만 기다려주세요...",
  errorText: "답안을 확인하지 못했어요\n잠시 후 다시 시도해 주세요",
  retryLabel: "다시 시도",
  exitLabel: "나가기",
};

// 채점 연출에서 문제 하나를 확인하는 간격
export const GRADING_STEP_MS = 800;

// 마지막 문제까지 확인 표시 후 결과 화면으로 넘어가기 전 대기
export const GRADING_HOLD_MS = 600;

export const UNLOCK_SUCCESS = {
  getTitle: (bookTitle: string) => `축하합니다!\n'${bookTitle}' 독후감이 해금되었습니다`,
  getDescription: (bookTitle: string) =>
    `${bookTitle}의 이야기는 여기서 끝이지만\n당신의 생각은 계속될 수 있어요\n독후감을 써볼까요?`,
  laterLabel: "나중에",
  writeLabel: "지금 쓰기",
};

export const UNLOCK_FAIL = {
  title: "아쉬워요 책을 다시\n읽고 문제를 풀어봐요",
  laterLabel: "나중에",
  retryLabel: "다시풀기",
};

export const UNLOCK_FAIL_CHARACTER = FailCharacter;

export const REFLECTION_PROMPTS = [
  { id: "scene", icon: Lightbulb, text: "가장 인상 깊은 장면은 무엇인가요?" },
  { id: "legacy", icon: NotepadText, text: "이 책이 당신에게 남긴 것은 무엇인가요?" },
  { id: "meaning", icon: Quote, text: "지금의 나에게 이 책은 어떤 의미인가요?" },
];
