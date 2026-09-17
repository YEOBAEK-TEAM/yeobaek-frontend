import { ArrowRight } from "lucide-react";

import type { ChatQuickReply } from "@/types/training/chat";

type QuickReplyButtonProps = {
  reply: ChatQuickReply;
  onSelect: (reply: ChatQuickReply) => void | Promise<void>;
};

export default function QuickReplyButton({ reply, onSelect }: QuickReplyButtonProps) {
  return (
    <button
      type="button"
      onClick={() => void onSelect(reply)}
      className="inline-flex items-center gap-2 rounded-xl border border-[#C4BFB6] bg-[#FFFEFB] px-5 py-3 text-[13px] font-bold text-[#60564C]"
    >
      {reply.label}
      {reply.link && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}
