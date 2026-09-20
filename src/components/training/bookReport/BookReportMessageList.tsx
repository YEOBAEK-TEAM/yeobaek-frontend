import { useEffect, useLayoutEffect, useRef } from "react";

import PerspectiveCard from "@/components/training/bookReport/PerspectiveCard";
import ThoughtCompareBubble from "@/components/training/bookReport/ThoughtCompareBubble";
import ChatMessageRow from "@/components/training/shared/chat/ChatMessageRow";
import MessageScroller from "@/components/training/shared/chat/MessageScroller";
import RitiMessage from "@/components/training/shared/chat/RitiMessage";

import type { BookReportMessage } from "@/types/training/bookReportChat";
import type { ChatQuickReply } from "@/types/training/chat";

type OlderMessages = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

type BookReportMessageListProps = {
  messages: BookReportMessage[];
  nickname: string;
  olderMessages: OlderMessages;
  onQuickReply: (reply: ChatQuickReply) => void | Promise<void>;
  onRetry: (messageId: string, text: string) => void;
};

export default function BookReportMessageList({
  messages,
  nickname,
  olderMessages,
  onQuickReply,
  onRetry,
}: BookReportMessageListProps) {
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = olderMessages;

  const topRef = useRef<HTMLDivElement>(null);
  // 이전 대화 추가 전 아래 끝 기준 스크롤 거리
  const bottomOffsetRef = useRef<number | null>(null);

  // 맨 위에 닿으면 이전 대화 요청
  useEffect(() => {
    const target = topRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      const scroller = target.parentElement;
      if (!entry.isIntersecting || !scroller) return;

      bottomOffsetRef.current = scroller.scrollHeight - scroller.scrollTop;
      void fetchNextPage();
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 이전 대화가 위에 붙어도 보던 위치 유지
  useLayoutEffect(() => {
    const scroller = topRef.current?.parentElement;
    if (!scroller || bottomOffsetRef.current === null || isFetchingNextPage) return;

    scroller.scrollTo({ top: scroller.scrollHeight - bottomOffsetRef.current });
    bottomOffsetRef.current = null;
  }, [messages, isFetchingNextPage]);

  return (
    <MessageScroller dependency={messages}>
      <div ref={topRef} aria-hidden="true" className="h-px" />

      {messages.map((message) => {
        if (message.kind === "perspectiveCard") {
          return (
            <RitiMessage key={message.id}>
              <PerspectiveCard perspectives={message.perspectives} />
            </RitiMessage>
          );
        }

        if (message.kind === "thoughtSummary") {
          return (
            <RitiMessage key={message.id}>
              <ThoughtCompareBubble nickname={nickname} thought={message.thought} />
            </RitiMessage>
          );
        }

        return (
          <ChatMessageRow
            key={message.id}
            message={message}
            onQuickReply={onQuickReply}
            onRetry={onRetry}
          />
        );
      })}
    </MessageScroller>
  );
}
