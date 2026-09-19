export const COMPREHENSION_TITLE = "이해력 증진";

export const BOOKMARK_SECTION_TITLE = "내 책갈피";

export const START_BUTTON_LABEL = "이 내용으로 시작하기";

export const BOOKMARK_EMPTY_TEXT = "저장한 책갈피가 없습니다";

export const ENDED_SYSTEM_TEXT = "채팅이 종료되었습니다";

// 서버가 이 값을 그대로 받아 종료 여부를 판단
export const COMPREHENSION_END_ANSWER = {
  accept: "예",
  decline: "아니요",
};

export const getAnalyzingPagesText = (nickname: string) =>
  `리티가 지금 ${nickname}님이 고른 부분을\n살펴보고 있습니다\n잠시 기다려주세요`;

export const ONGOING_TRAINING_BLOCKED_TEXT =
  "진행 중인 훈련이 있어요.\n먼저 마무리한 뒤에 새 훈련을 시작할 수 있어요.";

export const ONGOING_TRAINING_CONFIRM_TEXT = "진행 중인 훈련이 있어요.\n이어서 진행하시겠어요?";

export const START_ERROR_TEXT = "훈련을 시작하지 못했어요. 다시 시도해 주세요";

export const MESSAGES_ERROR_TEXT = "대화 내용을 불러오지 못했어요.\n잠시 후 다시 시도해 주세요.";

export const SUMMATION_ERROR_TEXT = "대화를 정리하지 못했어요. 다시 시도해 주세요";

export const COMPREHENSION_COMPLETE_SUBTITLE =
  "어려웠던 부분을 스스로 질문하고\n생각하며 이해하는 힘이 더 길러졌어요";
