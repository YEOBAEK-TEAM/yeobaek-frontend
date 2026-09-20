import { ArrowRight } from "lucide-react";

import { resolveOngoingTraining } from "@/utils/training/resolveOngoingTraining";

import type { OngoingTraining } from "@/types/training/ongoingTraining";

type OngoingTrainingCardProps = {
  training: OngoingTraining;
  onContinue?: () => void;
};

export default function OngoingTrainingCard({ training, onContinue }: OngoingTrainingCardProps) {
  const { label, title, description, character, characterClassName, actionLabel } =
    resolveOngoingTraining(training);

  // 상태별 제목 크기
  const titleClassName = training.status === "completed" ? "text-[16px]" : "text-[20px]";

  const canContinue = actionLabel !== null && onContinue !== undefined;

  return (
    <article
      // 배너 외곽선
      className="relative flex min-h-36 w-full flex-col justify-center overflow-hidden rounded-[10px] bg-[#FBFBFB] px-3 py-4 outline-3 outline-[#E8E9E1]"
    >
      <div className="pr-22">
        {label && <p className="text-[14px] font-semibold text-[#54555A]">{label}</p>}

        <h3
          className={`${label ? "mt-1" : ""} ${titleClassName} font-bold whitespace-pre-line text-[#4F4D4E]`}
        >
          {title}
        </h3>

        <p className="mt-1 text-[13px] leading-[19px] font-medium tracking-[-0.03em] break-keep whitespace-pre-line text-[#54555A]">
          {description}
        </p>

        {canContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="mt-2.5 flex items-center gap-1 text-[14px] font-bold text-[#4F4D4E]"
          >
            {actionLabel}
            <ArrowRight aria-hidden="true" strokeWidth={2.5} className="h-4 w-4" />
          </button>
        )}
      </div>

      <img
        src={character}
        alt=""
        className={`absolute w-auto object-contain ${characterClassName}`}
      />
    </article>
  );
}
