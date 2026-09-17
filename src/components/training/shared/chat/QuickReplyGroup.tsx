import QuickReplyButton from "@/components/training/shared/chat/QuickReplyButton";

import type { ChatQuickReply } from "@/types/training/chat";

type QuickReplyGroupProps = {
  replies: ChatQuickReply[];
  direction?: "row" | "column";
  onSelect: (reply: ChatQuickReply) => void | Promise<void>;
};

export default function QuickReplyGroup({
  replies,
  direction = "row",
  onSelect,
}: QuickReplyGroupProps) {
  return (
    <div className={`flex gap-3 ${direction === "column" ? "flex-col items-start" : "flex-wrap"}`}>
      {replies.map((reply) => (
        <QuickReplyButton key={reply.id} reply={reply} onSelect={onSelect} />
      ))}
    </div>
  );
}
