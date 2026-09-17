import type { ChatBaseMessage } from "@/types/training/chat";
import type { ReadingReport } from "@/types/training/readingReport";

export type ThoughtComparison = {
  before: string;
  after: string;
};

export type BookReportMessage =
  | ChatBaseMessage
  | { id: string; role: "riti"; kind: "reportCard"; report: ReadingReport }
  | { id: string; role: "riti"; kind: "thoughtSummary"; thought: ThoughtComparison };

export type ChatPhase =
  | { type: "empty" }
  | { type: "select" }
  | { type: "analyzing"; report: ReadingReport }
  | { type: "chatting"; report: ReadingReport }
  | { type: "summary"; report: ReadingReport; thought: ThoughtComparison }
  | { type: "ended"; report: ReadingReport };
