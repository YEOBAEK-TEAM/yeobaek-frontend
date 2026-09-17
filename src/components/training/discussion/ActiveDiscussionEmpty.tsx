import { ACTIVE_DISCUSSION_EMPTY_TEXT } from "@/constants/training/discussion/discussion";

// 참여 카드와 같은 높이 유지
export default function ActiveDiscussionEmpty() {
  return (
    <div className="flex h-36.5 items-center justify-center rounded-xl border border-[#EEECE6] bg-[#F7F6F1]">
      <p className="text-[16px] font-bold text-[#4F4D4E]">{ACTIVE_DISCUSSION_EMPTY_TEXT}</p>
    </div>
  );
}
