export type ChatStreamChunk = { type: "delta"; text: string } | { type: "done" };

export type SendChatInput = {
  reportId: number;
  text: string;
  // 대화 차례
  turn: number;
};

// 스트리밍 전송 계층
export interface ChatTransport {
  send(input: SendChatInput, signal: AbortSignal): AsyncIterable<ChatStreamChunk>;
}
