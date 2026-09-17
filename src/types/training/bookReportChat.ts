import type { ReadingReport } from "@/types/training/readingReport";

export type ThoughtComparison = {
  before: string;
  after: string;
};

export type QuickReplyAction =
  | { type: "select-recent-report" }
  | { type: "open-report-list" }
  | { type: "another-view" }
  | { type: "guide-other-training" }
  | { type: "go-comprehension" };

export type QuickReply = {
  id: string;
  label: string;
  action: QuickReplyAction;
  // 화살표가 붙는 링크형 버튼 여부
  link?: boolean;
};

export type ChatMessage =
  | {
      id: string;
      role: "riti" | "user";
      kind: "text";
      text: string;
      streaming?: boolean;
      failed?: boolean;
      // 아바타 숨김 여부
      hideAvatar?: boolean;
    }
  | { id: string; role: "riti"; kind: "reportCard"; report: ReadingReport }
  | { id: string; role: "riti"; kind: "quickReplies"; replies: QuickReply[] }
  | { id: string; role: "riti"; kind: "thoughtSummary"; thought: ThoughtComparison }
  | { id: string; role: "riti"; kind: "loading" }
  | { id: string; role: "system"; kind: "system"; text: string };

export type ChatPhase =
  | { type: "empty" }
  | { type: "select" }
  | { type: "analyzing"; report: ReadingReport }
  | { type: "chatting"; report: ReadingReport }
  | { type: "summary"; report: ReadingReport; thought: ThoughtComparison }
  | { type: "ended"; report: ReadingReport };
