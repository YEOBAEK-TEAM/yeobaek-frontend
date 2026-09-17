export type ChatConnectionStatus =
  "idle" | "connecting" | "open" | "reconnecting" | "closed" | "error";

export type ChatSessionPayload = {
  bookId: number;
  bookmarkId: string | null;
};

// 서버에서 내려오는 이벤트
export type ChatServerEvent =
  | { type: "session:ready"; sessionId: string }
  | { type: "message:ack"; clientMessageId: string; messageId: string; sentAt: string }
  | { type: "ai:thinking" }
  | { type: "ai:message"; messageId: string; text: string; sentAt: string }
  | { type: "ai:chunk"; messageId: string; text: string }
  | { type: "ai:done"; messageId: string }
  | { type: "session:confirmEnd" }
  | { type: "session:ended" }
  | { type: "error"; message: string };

// 클라이언트에서 올려보내는 이벤트
export type ChatClientEvent =
  | {
      type: "session:join";
      bookId: number;
      bookmarkId: string | null;
      // 재연결 시 이 id 이후 메시지만 다시 수신
      afterMessageId: string | null;
    }
  | { type: "message:send"; clientMessageId: string; text: string }
  | { type: "quickReply:select"; clientMessageId: string; replyId: string; label: string }
  | { type: "session:confirmEnd:answer"; accepted: boolean }
  | { type: "session:leave" };

export type ChatSocketSignal =
  { type: "status"; status: ChatConnectionStatus } | { type: "event"; event: ChatServerEvent };

export type ChatSocketListener = (signal: ChatSocketSignal) => void;

// 소켓 전송 계층 추상화
export interface ChatSocketTransport {
  connect(payload: ChatSessionPayload): void;
  disconnect(): void;
  send(event: ChatClientEvent): void;
  subscribe(listener: ChatSocketListener): () => void;
  getStatus(): ChatConnectionStatus;
}
