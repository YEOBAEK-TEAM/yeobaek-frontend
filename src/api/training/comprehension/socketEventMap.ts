import type { ChatClientEvent, ChatServerEvent } from "@/types/training/chatSocket";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readString = (value: unknown) => (typeof value === "string" ? value : "");

// 서버 이벤트명이 바뀌면 이 표만 수정
const SERVER_EVENT_NAME: Record<string, ChatServerEvent["type"]> = {
  "session:ready": "session:ready",
  "message:ack": "message:ack",
  "ai:thinking": "ai:thinking",
  "ai:message": "ai:message",
  "ai:chunk": "ai:chunk",
  "ai:done": "ai:done",
  "session:confirmEnd": "session:confirmEnd",
  "session:ended": "session:ended",
  error: "error",
};

// 서버 원본 페이로드를 앱 이벤트로 변환, 형식이 맞지 않으면 버림
export const toServerEvent = (raw: unknown): ChatServerEvent | null => {
  if (!isRecord(raw)) return null;

  const type = SERVER_EVENT_NAME[readString(raw.type)];
  if (!type) return null;

  switch (type) {
    case "session:ready":
      return { type, sessionId: readString(raw.sessionId) };

    case "message:ack":
      return {
        type,
        clientMessageId: readString(raw.clientMessageId),
        messageId: readString(raw.messageId),
        sentAt: readString(raw.sentAt),
      };

    case "ai:message":
      return {
        type,
        messageId: readString(raw.messageId),
        text: readString(raw.text),
        sentAt: readString(raw.sentAt),
      };

    case "ai:chunk":
      return { type, messageId: readString(raw.messageId), text: readString(raw.text) };

    case "ai:done":
      return { type, messageId: readString(raw.messageId) };

    case "error":
      return { type, message: readString(raw.message) };

    default:
      return { type };
  }
};

// 앱 이벤트를 서버 전송 형식으로 변환
export const toServerPayload = (event: ChatClientEvent) => JSON.stringify(event);
