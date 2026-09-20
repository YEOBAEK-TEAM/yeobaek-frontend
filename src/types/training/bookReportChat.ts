import type { OtherPerspectiveResponse } from "@/types/training/bookReportTraining";
import type { ChatBaseMessage } from "@/types/training/chat";

export type ThoughtComparison = {
  before: string;
  after: string;
};

export type BookReportMessage =
  | ChatBaseMessage
  | { id: string; role: "riti"; kind: "perspectiveCard"; perspectives: OtherPerspectiveResponse[] }
  | { id: string; role: "riti"; kind: "thoughtSummary"; thought: ThoughtComparison };

export type ChatPhase =
  | { type: "select" }
  | { type: "chatting" }
  // 다른 관점 선택 전까지는 전송이 막힘
  | { type: "perspectivePrompt" }
  | { type: "summarizing" }
  | { type: "summary"; thought: ThoughtComparison }
  | { type: "ended" };
