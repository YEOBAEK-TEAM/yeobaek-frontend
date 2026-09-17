import ChatMessageRow from "@/components/training/shared/chat/ChatMessageRow";
import MessageScroller from "@/components/training/shared/chat/MessageScroller";

import type { ChatQuickReply } from "@/types/training/chat";
import type { ComprehensionMessage } from "@/types/training/comprehension";

type ComprehensionMessageListProps = {
  messages: ComprehensionMessage[];
  onQuickReply: (reply: ChatQuickReply) => void;
  onRetry: (messageId: string, text: string) => void;
};

export default function ComprehensionMessageList({
  messages,
  onQuickReply,
  onRetry,
}: ComprehensionMessageListProps) {
  return (
    <MessageScroller dependency={messages}>
      {messages.map((message) => (
        <ChatMessageRow
          key={message.id}
          message={message}
          onQuickReply={onQuickReply}
          onRetry={onRetry}
        />
      ))}
    </MessageScroller>
  );
}
