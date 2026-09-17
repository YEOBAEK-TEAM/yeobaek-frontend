import QuickReplyButton from "@/components/training/chat/QuickReplyButton";

import type { QuickReply } from "@/types/training/bookReportChat";

type QuickReplyGroupProps = {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void | Promise<void>;
};

export default function QuickReplyGroup({ replies, onSelect }: QuickReplyGroupProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {replies.map((reply) => (
        <QuickReplyButton key={reply.id} reply={reply} onSelect={onSelect} />
      ))}
    </div>
  );
}
