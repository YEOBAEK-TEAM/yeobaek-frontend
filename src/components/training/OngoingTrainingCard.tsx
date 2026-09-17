import { resolveOngoingTraining } from "@/utils/training/resolveOngoingTraining";

import type { OngoingTraining } from "@/types/training/ongoingTraining";

type OngoingTrainingCardProps = {
  training: OngoingTraining;
  onClick?: () => void;
};

export default function OngoingTrainingCard({ training, onClick }: OngoingTrainingCardProps) {
  const { label, title, description, character, characterClassName } =
    resolveOngoingTraining(training);

  // 완료 상태는 제목이 두 줄이라 한 단계 작은 크기
  const titleClassName = training.status === "completed" ? "text-[16px]" : "text-[20px]";

  return (
    <article
      onClick={onClick}
      // 외곽선 3px은 시안상 바깥쪽 정렬이라 레이아웃에 영향 없는 outline 사용
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
      </div>

      <img
        src={character}
        alt=""
        className={`absolute w-auto object-contain ${characterClassName}`}
      />
    </article>
  );
}
