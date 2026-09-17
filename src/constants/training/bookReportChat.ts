import type { ReportSortOrder } from "@/types/training/readingReport";

export const BOOK_REPORT_CHAT_TITLE = "독후감으로 훈련하기";

export const CHAT_INPUT_PLACEHOLDER = "채팅을 입력해주세요";

export const ANALYZING_TEXT = "분석중입니다";

export const ANALYZED_TEXT = "분석완료!";

export const ENDING_TEXT = "오늘 하루도 수고했어! 다음에 또 만나";

export const ENDED_SYSTEM_TEXT = "채팅이 종료되었습니다";

export const EMPTY_REPORT_TEXT =
  "아직 작성하신 독후감이 없어서 훈련을\n진행할 수 없습니다. 다른 훈련을 원하시면\n안내를 도와드리겠습니다.";

export const COMPREHENSION_GUIDE_TEXT =
  "책을 읽다가 막히는 부분이 있거나\n생각을 조금 더 깊게 확장해 보고 싶으신가요?\n'이해력 증진' 훈련 세션을 활용해 보세요.\n아래 버튼을 클릭하시면 바로\n시작하실 수 있습니다.";

export const REPORT_SHEET_TITLE = "내 독후감 목록";

export const REPORT_SORT_LABEL: Record<ReportSortOrder, string> = {
  latest: "최신순",
  oldest: "오래된순",
};

export const SUMMARY_CLOSING_TEXT = "이 내용을 바탕으로 독후감을 더 풍부하게\n수정해볼까요?";

export const TRAINING_COMPLETE_TITLE = "오늘도 수고했어요!";

export const TRAINING_COMPLETE_SUBTITLE =
  "기존에 가지고있던 생각에서 멈추지 않고\n확장시켜나갔습니다!";

export const LEARNING_SUMMARY_TITLE = "오늘의 학습 요약";

export const EXIT_BEFORE_START_TEXT = "독후감 훈련을 중단하시겠습니까?";

export const EXIT_IN_PROGRESS_TEXT =
  "현재까지 훈련한 내용을 저장하고\n다음에 다시 시작하시겠습니까?";
