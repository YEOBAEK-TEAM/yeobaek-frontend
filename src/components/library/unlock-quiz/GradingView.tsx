import { useEffect, useState } from "react";

import answerCharacter from "@/assets/images/books/question/answerCharacter.png";
import CompletionLayout from "@/components/common/completion/CompletionLayout";
import GradingStepItem from "@/components/library/unlock-quiz/GradingStepItem";
import { GRADING, GRADING_STEP_MS } from "@/constants/library/unlockQuiz";

type GradingViewProps = {
  questionCount: number;
  isDone: boolean;
  isError: boolean;
  onRetry: () => void;
  onExit: () => void;
};

export default function GradingView({
  questionCount,
  isDone,
  isError,
  onRetry,
  onExit,
}: GradingViewProps) {
  const [checkedCount, setCheckedCount] = useState(0);

  // 응답 전에는 마지막 문제 직전까지만 확인하고 대기
  useEffect(() => {
    const limit = isDone ? questionCount : questionCount - 1;
    if (isError || checkedCount >= limit) return;

    const timer = window.setTimeout(
      () => setCheckedCount((count) => count + 1),
      isDone ? GRADING_STEP_MS / 2 : GRADING_STEP_MS,
    );

    return () => window.clearTimeout(timer);
  }, [checkedCount, isDone, isError, questionCount]);

  return (
    <CompletionLayout
      character={answerCharacter}
      title={GRADING.title}
      description={GRADING.description}
      characterClassName="h-45"
      topClassName="pt-20"
      footer={
        isError ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onExit}
              className="h-16 rounded-xl border-[1.5px] border-[#8E8A7E] bg-white text-[17px] font-bold text-[#6B6340]"
            >
              {GRADING.exitLabel}
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="h-16 rounded-xl bg-[#B8BC9F] text-[17px] font-bold text-white"
            >
              {GRADING.retryLabel}
            </button>
          </div>
        ) : (
          <p className="pb-10 text-center text-[18px] font-bold text-[#1E1E1E]">
            {GRADING.waitingText}
          </p>
        )
      }
    >
      {isError ? (
        <p
          role="alert"
          className="mt-14 text-center text-[16px] leading-6 font-semibold whitespace-pre-line text-[#D91414]"
        >
          {GRADING.errorText}
        </p>
      ) : (
        <ol aria-live="polite" className="mx-auto mt-10 flex w-fit flex-col gap-6">
          {Array.from({ length: questionCount }, (_, index) => (
            <GradingStepItem
              key={index}
              label={GRADING.getStepLabel(index + 1)}
              state={
                index < checkedCount ? "done" : index === checkedCount ? "checking" : "waiting"
              }
            />
          ))}
        </ol>
      )}
    </CompletionLayout>
  );
}
