import {
  EMPTY_ONGOING_TRAINING,
  ONGOING_TRAINING_CHARACTER,
} from "@/constants/training/ongoingTraining";

// 두 훈련 모두 기록이 없을 때만 노출
export default function EmptyTrainingCard() {
  return (
    <article className="relative flex min-h-36 w-full flex-col justify-center overflow-hidden rounded-[10px] bg-[#FBFBFB] px-3 py-4 outline-3 outline-[#E8E9E1]">
      <div className="pr-22">
        <h3 className="text-[20px] font-bold whitespace-pre-line text-[#4F4D4E]">
          {EMPTY_ONGOING_TRAINING.title}
        </h3>

        <p className="mt-1 text-[13px] leading-[19px] font-medium tracking-[-0.03em] break-keep whitespace-pre-line text-[#54555A]">
          {EMPTY_ONGOING_TRAINING.description}
        </p>
      </div>

      <img
        src={ONGOING_TRAINING_CHARACTER.empty.src}
        alt=""
        className={`absolute w-auto object-contain ${ONGOING_TRAINING_CHARACTER.empty.className}`}
      />
    </article>
  );
}
