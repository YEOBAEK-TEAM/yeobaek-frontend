import ChatBubble from "@/components/training/chat/ChatBubble";
import QuickReplyGroup from "@/components/training/chat/QuickReplyGroup";
import ReportCard from "@/components/training/chat/ReportCard";
import RitiMessage from "@/components/training/chat/RitiMessage";
import SystemMessage from "@/components/training/chat/SystemMessage";
import ThoughtCompareBubble from "@/components/training/chat/ThoughtCompareBubble";
import TypingIndicator from "@/components/training/chat/TypingIndicator";
import UserMessage from "@/components/training/chat/UserMessage";
import { useAutoScroll } from "@/hooks/training/useAutoScroll";

import type { ChatMessage, QuickReply } from "@/types/training/bookReportChat";

type MessageListProps = {
  messages: ChatMessage[];
  nickname: string;
  onQuickReply: (reply: QuickReply) => void | Promise<void>;
  onRetry: (messageId: string, text: string) => void;
};

export default function MessageList({
  messages,
  nickname,
  onQuickReply,
  onRetry,
}: MessageListProps) {
  const { containerRef, handleScroll } = useAutoScroll(messages);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      aria-live="polite"
      className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
    >
      {messages.map((message) => {
        if (message.role === "system") {
          return <SystemMessage key={message.id} text={message.text} />;
        }

        if (message.role === "user") {
          return (
            <UserMessage
              key={message.id}
              text={message.text}
              failed={message.failed}
              onRetry={() => onRetry(message.id, message.text)}
            />
          );
        }

        if (message.kind === "loading") {
          return (
            <RitiMessage key={message.id} showAvatar={false}>
              <TypingIndicator />
            </RitiMessage>
          );
        }

        if (message.kind === "reportCard") {
          return (
            <RitiMessage key={message.id}>
              <ReportCard report={message.report} variant="message" />
            </RitiMessage>
          );
        }

        if (message.kind === "quickReplies") {
          return (
            <RitiMessage key={message.id} showAvatar={false}>
              <QuickReplyGroup replies={message.replies} onSelect={onQuickReply} />
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
          <RitiMessage key={message.id} showAvatar={!message.hideAvatar}>
            <ChatBubble variant="riti">{message.text}</ChatBubble>
          </RitiMessage>
        );
      })}
    </div>
  );
}
