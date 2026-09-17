import type { ChatMessage, QuickReply, ThoughtComparison } from "@/types/training/bookReportChat";
import type { ReadingReport } from "@/types/training/readingReport";

let sequence = 0;

export const createMessageId = () => {
  sequence += 1;
  return `chat-${sequence}`;
};

export const ritiText = (text: string, streaming = false): ChatMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "text",
  text,
  streaming,
});

export const ritiPlainText = (text: string): ChatMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "text",
  text,
  hideAvatar: true,
});

export const userText = (text: string): ChatMessage => ({
  id: createMessageId(),
  role: "user",
  kind: "text",
  text,
});

export const ritiLoading = (): ChatMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "loading",
});

export const ritiReportCard = (report: ReadingReport): ChatMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "reportCard",
  report,
});

export const ritiQuickReplies = (replies: QuickReply[]): ChatMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "quickReplies",
  replies,
});

export const ritiThoughtSummary = (thought: ThoughtComparison): ChatMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "thoughtSummary",
  thought,
});

export const systemText = (text: string): ChatMessage => ({
  id: createMessageId(),
  role: "system",
  kind: "system",
  text,
});
