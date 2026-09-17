import { useCallback, useEffect, useRef, useState } from "react";

import { chatTransport } from "@/api/training/chatTransport";

import type { SendChatInput } from "@/types/training/chatTransport";

type StreamHandlers = {
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: unknown) => void;
};

export const useChatStream = () => {
  const abortRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  // 화면 이탈 시 스트림 취소
  useEffect(() => () => abortRef.current?.abort(), []);

  const start = useCallback(async (input: SendChatInput, handlers: StreamHandlers) => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    try {
      for await (const chunk of chatTransport.send(input, controller.signal)) {
        if (controller.signal.aborted) return;

        if (chunk.type === "delta") {
          handlers.onDelta(chunk.text);
          continue;
        }

        handlers.onDone();
      }
    } catch (error) {
      if (!controller.signal.aborted) handlers.onError(error);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsStreaming(false);
      }
    }
  }, []);

  return { start, stop, isStreaming };
};
