import type { OtherPerspectiveResponse } from "@/types/training/bookReportTraining";
import type { ChatBaseMessage } from "@/types/training/chat";

export type ThoughtComparison = {
  before: string;
  after: string;
};

export type BookReportMessage =
  | ChatBaseMessage
  | { id: string; role: "riti"; kind: "perspectiveCard"; perspective: OtherPerspectiveResponse }
  | { id: string; role: "riti"; kind: "thoughtSummary"; thought: ThoughtComparison };

export type ChatPhase =
  | { type: "select" }
  | { type: "chatting" }
  // 다른 관점 선택 전까지는 전송이 막힘
  | { type: "perspectivePrompt" }
  // 관점을 본 뒤 더 보기 버튼과 함께 대화 계속
  | { type: "perspectiveShown" }
  | { type: "summarizing" }
  | { type: "summary"; thought: ThoughtComparison }
  | { type: "ended" };
