import { LoaderCircle } from "lucide-react";

import { getAnalyzingReportText } from "@/constants/training/bookReportChat";

type AnalyzingOverlayProps = {
  nickname: string;
};

// 훈련방 생성과 첫 질문 생성이 끝날 때까지 화면 전체를 덮는 대기 표시
export default function AnalyzingOverlay({ nickname }: AnalyzingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/92"
    >
      <LoaderCircle
        aria-hidden="true"
        strokeWidth={2.5}
        className="h-11 w-11 animate-spin text-[#8B9475] motion-reduce:animate-none"
      />

      <p className="text-center text-[16px] leading-[25px] font-medium whitespace-pre-line text-[#4F4D4E]">
        {getAnalyzingReportText(nickname)}
      </p>
    </div>
  );
}
