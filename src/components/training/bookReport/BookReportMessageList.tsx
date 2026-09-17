import ReportCard from "@/components/training/bookReport/ReportCard";
import ThoughtCompareBubble from "@/components/training/bookReport/ThoughtCompareBubble";
import ChatMessageRow from "@/components/training/shared/chat/ChatMessageRow";
import MessageScroller from "@/components/training/shared/chat/MessageScroller";
import RitiMessage from "@/components/training/shared/chat/RitiMessage";

import type { BookReportMessage } from "@/types/training/bookReportChat";
import type { ChatQuickReply } from "@/types/training/chat";

type BookReportMessageListProps = {
  messages: BookReportMessage[];
  nickname: string;
  onQuickReply: (reply: ChatQuickReply) => void | Promise<void>;
  onRetry: (messageId: string, text: string) => void;
};

export default function BookReportMessageList({
  messages,
  nickname,
  onQuickReply,
  onRetry,
}: BookReportMessageListProps) {
  return (
    <MessageScroller dependency={messages}>
      {messages.map((message) => {
        if (message.kind === "reportCard") {
          return (
            <RitiMessage key={message.id}>
              <ReportCard report={message.report} variant="message" />
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
