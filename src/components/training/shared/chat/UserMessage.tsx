import ChatBubble from "@/components/training/shared/chat/ChatBubble";

type UserMessageProps = {
  text: string;
  failed?: boolean;
  onRetry?: () => void;
};

export default function UserMessage({ text, failed, onRetry }: UserMessageProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <ChatBubble variant="user">{text}</ChatBubble>

      {failed && (
        <button
          type="button"
          onClick={onRetry}
          className="text-[12px] font-semibold text-[#A1A7AD] underline"
        >
          전송 실패, 다시 보내기
        </button>
      )}
    </div>
  );
}
