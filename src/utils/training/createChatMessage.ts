import type { ChatBaseMessage, ChatQuickReply } from "@/types/training/chat";

let sequence = 0;

export const createMessageId = () => {
  sequence += 1;
  return `chat-${sequence}`;
};

export const ritiText = (text: string, streaming = false): ChatBaseMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "text",
  text,
  streaming,
});

export const userText = (text: string): ChatBaseMessage => ({
  id: createMessageId(),
  role: "user",
  kind: "text",
  text,
});

export const ritiLoading = (): ChatBaseMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "loading",
});

export const ritiQuickReplies = (
  replies: ChatQuickReply[],
  direction: "row" | "column" = "row",
): ChatBaseMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "quickReplies",
  replies,
  direction,
});

export const systemText = (text: string): ChatBaseMessage => ({
  id: createMessageId(),
  role: "system",
  kind: "system",
  text,
});
