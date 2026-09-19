import ChatBubble from "@/components/training/shared/chat/ChatBubble";
import QuickReplyGroup from "@/components/training/shared/chat/QuickReplyGroup";
import RitiMessage from "@/components/training/shared/chat/RitiMessage";
import SystemMessage from "@/components/training/shared/chat/SystemMessage";
import TypingIndicator from "@/components/training/shared/chat/TypingIndicator";
import UserMessage from "@/components/training/shared/chat/UserMessage";

import type { ChatBaseMessage, ChatQuickReply } from "@/types/training/chat";

type ChatMessageRowProps = {
  message: ChatBaseMessage;
  onQuickReply: (reply: ChatQuickReply) => void | Promise<void>;
  onRetry: (messageId: string, text: string) => void;
};

// 두 채팅이 공유하는 메시지 한 줄
export default function ChatMessageRow({ message, onQuickReply, onRetry }: ChatMessageRowProps) {
  if (message.kind === "system") {
    return <SystemMessage text={message.text} />;
  }

  if (message.kind === "loading") {
    return (
      <RitiMessage>
        <TypingIndicator />
      </RitiMessage>
    );
  }

  if (message.kind === "quickReplies") {
    return (
      <RitiMessage showAvatar={false}>
        <QuickReplyGroup
          replies={message.replies}
          direction={message.direction}
          onSelect={onQuickReply}
        />
      </RitiMessage>
    );
  }

  if (message.role === "user") {
    return (
      <UserMessage
        text={message.text}
        failed={message.status === "failed"}
        onRetry={() => onRetry(message.id, message.text)}
      />
    );
  }

  return (
    <RitiMessage showAvatar={!message.hideAvatar}>
      <ChatBubble variant="riti">{message.text}</ChatBubble>
    </RitiMessage>
  );
}
