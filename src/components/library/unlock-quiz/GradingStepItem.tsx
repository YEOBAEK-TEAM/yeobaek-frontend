import { Check } from "lucide-react";

export type GradingStepState = "waiting" | "checking" | "done";

type GradingStepItemProps = {
  label: string;
  state: GradingStepState;
};

const STATE_TEXT: Record<GradingStepState, string> = {
  waiting: "대기",
  checking: "확인 중",
  done: "확인 완료",
};

export default function GradingStepItem({ label, state }: GradingStepItemProps) {
  const isDone = state === "done";

  return (
    <li className="flex items-center gap-4">
      {/* 확인 끝난 문제는 채운 원, 확인 중인 문제는 테두리만 깜빡임 */}
      <span
        aria-hidden="true"
        className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border-2 border-[#8A916B] transition-colors duration-300 motion-reduce:transition-none ${
          isDone ? "bg-[#8A916B]" : "bg-transparent"
        } ${state === "checking" ? "motion-safe:animate-pulse" : ""}`}
      >
        {isDone && <Check strokeWidth={2.5} className="h-5 w-5 text-white" />}
      </span>

      <span className="text-[17px] font-semibold text-[#6B6B6B]">
        {label}
        <span className="sr-only"> {STATE_TEXT[state]}</span>
      </span>
    </li>
  );
}
