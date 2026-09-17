import { mockChatReplies, mockFallbackReply } from "@/mocks/training/bookReportChatScript";

import type { ChatStreamChunk, ChatTransport, SendChatInput } from "@/types/training/chatTransport";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CHAR_INTERVAL_MS = 18;

const FIRST_CHUNK_DELAY_MS = 400;

export const mockChatTransport: ChatTransport = {
  async *send(input: SendChatInput, signal: AbortSignal): AsyncIterable<ChatStreamChunk> {
    const reply = mockChatReplies[input.turn] ?? mockFallbackReply;

    await delay(FIRST_CHUNK_DELAY_MS);

    // 글자 단위 스트리밍
    for (const char of reply) {
      if (signal.aborted) return;

      await delay(CHAR_INTERVAL_MS);
      yield { type: "delta", text: char };
    }

    yield { type: "done" };
  },
};
