import type { ChatStreamChunk, ChatTransport, SendChatInput } from "@/types/training/chatTransport";

const CHAT_STREAM_URL = "/api/v1/trainings/book-report/messages";

// SSE 스트리밍 전송 구현
export const sseChatTransport: ChatTransport = {
  async *send(input: SendChatInput, signal: AbortSignal): AsyncIterable<ChatStreamChunk> {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${CHAT_STREAM_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(input),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`채팅 응답을 받지 못했습니다. (${response.status})`);
    }

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += value;

      // SSE 이벤트 분리
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const data = event
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("");

        if (!data || data === "[DONE]") continue;

        yield { type: "delta", text: JSON.parse(data).text ?? "" };
      }
    }

    yield { type: "done" };
  },
};
