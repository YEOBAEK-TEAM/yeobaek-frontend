import { ANALYZING_TEXT } from "@/constants/training/bookReportChat";

// 분석 대기 표시
export default function TypingIndicator() {
  return (
    <div className="flex max-w-[78%] items-center gap-2 rounded-2xl bg-[#DEE2D0] px-4 py-3 text-[13px] text-[#54555A]">
      <span>{ANALYZING_TEXT}</span>

      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1 w-1 animate-bounce rounded-full bg-[#54555A]"
            style={{ animationDelay: `${dot * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
