import ComprehensiveCharacter from "@/assets/images/Training/ComprehensiveCharacter.png";
import ReadingCharacter from "@/assets/images/Training/ReadingCharacter.png";

import type { TrainingProgram, TrainingTab } from "@/types/training/trainingProgram";

// 훈련 화면 경로
export const TRAINING_PATH = {
  main: "/training",
  bookReportSelect: "/training/book-report/select",
  bookReportChat: "/training/book-report",
  bookReportComplete: "/training/complete",
  comprehension: "/training/comprehension",
  comprehensionChat: "/training/comprehension/chat",
  comprehensionComplete: "/training/comprehension/complete",
};

export const TRAINING_TABS: { id: TrainingTab; label: string }[] = [
  { id: "lity", label: "리티와 훈련" },
  { id: "debate", label: "토론장 참여" },
];

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: "book-report",
    title: "독후감 훈련",
    description: "내가 쓴 독후감을 바탕으로 리티와 대화하며\n생각을 더 깊고 논리적으로 확장해요",
    tags: ["논리력", "표현력", "비판적 사고"],
    character: ReadingCharacter,
    cardClassName: "bg-[#F2F2EA]",
    tagClassName: "bg-[#C7C9BB]",
  },
  {
    id: "comprehension",
    title: "이해력 증진",
    description:
      "책이나 페이지를 골라, 이해가 잘 안 되는 부분을\n리티와 함께 질문하고 생각하며 풀어가요",
    tags: ["내용 이해", "추론력", "핵심 파악"],
    character: ComprehensiveCharacter,
    cardClassName: "bg-[#F6F3EE]",
    tagClassName: "bg-[#DAD6CE]",
  },
];
