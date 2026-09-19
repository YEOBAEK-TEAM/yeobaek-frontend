import CompleteCharacter from "@/assets/images/Training/CompleteCharacter.png";
import ComprehensiveingCharacter from "@/assets/images/Training/ComprehensiveingCharacter.png";
import NothingcCharcter from "@/assets/images/Training/NothingcCharcter.png";
import TrainingCharacter from "@/assets/images/Training/TrainingCharacter.png";

// 상태별 캐릭터 이미지와 배치
export const ONGOING_TRAINING_CHARACTER = {
  bookReport: { src: TrainingCharacter, className: "h-36 -right-4 bottom-0" },
  comprehension: { src: ComprehensiveingCharacter, className: "h-36 -right-4 bottom-0" },
  completed: { src: CompleteCharacter, className: "h-28 right-0 -bottom-1" },
  empty: { src: NothingcCharcter, className: "h-40 -right-4 -bottom-4" },
};

export const ONGOING_TRAINING_LABEL = "지금 훈련 중";

export const ONGOING_TRAINING_ACTION_LABEL = "마저 진행하기";

export const EMPTY_ONGOING_TRAINING = {
  title: "아직 훈련 기록이 없습니다",
  description: "리티와 함께 생각의 풀을 넓혀봐요",
};
