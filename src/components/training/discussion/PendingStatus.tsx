import { PENDING_STATUS_LABEL } from "@/constants/training/discussion/discussion";

// 버튼이 아닌 상태 표시 요소
export default function PendingStatus() {
  return (
    <p className="flex h-7.5 w-full items-center justify-center rounded-xl bg-[#A59E93] text-[13px] font-medium text-white">
      {PENDING_STATUS_LABEL}
    </p>
  );
}
