import type { TrainingHistoryTab } from "@/types/training/trainingHistory";

export const TRAINING_HISTORY_TITLE = "훈련 기록";

export const TRAINING_HISTORY_TABS: { id: TrainingHistoryTab; label: string }[] = [
  { id: "book-report", label: "독후감 훈련" },
  { id: "comprehension", label: "이해력 증진" },
];

export const TRAINING_HISTORY_EMPTY_TEXT = "아직 훈련 기록이 없습니다";

export const TRAINING_HISTORY_ERROR_TEXT = "훈련 기록을 불러오지 못했어요";

// 기록에서 들어오면 대화를 볼 수만 있음
export const HISTORY_ENTRY_PARAM = "from";

export const HISTORY_ENTRY_VALUE = "history";
