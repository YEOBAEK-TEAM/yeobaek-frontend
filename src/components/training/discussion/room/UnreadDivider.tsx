import { UNREAD_DIVIDER_TEXT } from "@/constants/training/discussion/roomChat";

import type { Ref } from "react";

type UnreadDividerProps = {
  ref: Ref<HTMLDivElement>;
};

export default function UnreadDivider({ ref }: UnreadDividerProps) {
  return (
    <div ref={ref} role="separator" className="flex items-center gap-3 py-6">
      <span aria-hidden="true" className="h-px flex-1 bg-[#DAD8D3]" />
      <span className="text-[16px] font-semibold text-[#CFCCC7]">{UNREAD_DIVIDER_TEXT}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-[#DAD8D3]" />
    </div>
  );
}
