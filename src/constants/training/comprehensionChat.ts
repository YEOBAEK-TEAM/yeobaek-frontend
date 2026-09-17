import type { ChatQuickReply } from "@/types/training/chat";

export const COMPREHENSION_TITLE = "이해력 증진";

export const LIBRARY_SECTION_TITLE = "내 서재";

export const BOOKMARK_SECTION_TITLE = "내 책갈피";

export const START_BUTTON_LABEL = "이 내용으로 시작하기";

export const LIBRARY_EMPTY_TEXT = "서재에 담은 책이 없습니다";

export const BOOKMARK_EMPTY_TEXT = "저장한 책갈피가 없습니다";

export const RECONNECTING_TEXT = "연결이 끊겨 다시 연결하는 중입니다";

export const RECONNECT_FAILED_TEXT = "연결에 실패했습니다";

export const RETRY_BUTTON_LABEL = "다시 시도";

export const COMPREHENSION_GREETING =
  "선택한 부분을 함께 살펴볼까요?\n\n이 구간에서 이해가 잘 안되는 부분이 있나요?\n어려운 문장, 인물의 행동, 상황의 의미등\n어떤 것이든 좋아요.";

export const ANOTHER_TOPIC_TEXT = "좋아요. 같은 책에서 또 궁금한 부분을 말씀해 주세요.";

export const COMPREHENSION_QUICK_REPLIES: ChatQuickReply[] = [
  { id: "scene-meaning", label: "이 장면의 의미가 궁금해요" },
  { id: "unclear-meaning", label: "무슨 뜻인지 잘 모르겠어요" },
  { id: "character-action", label: "이 인물의 행동이 이해가 안가요" },
];

export const COMPREHENSION_COMPLETE_SUBTITLE =
  "어려웠던 부분을 스스로 질문하고\n생각하며 이해하는 힘이 더 길러졌어요";
