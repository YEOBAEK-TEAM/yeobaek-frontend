import TrainingTagChip from "@/components/training/TrainingTagChip";

import type { TrainingProgram } from "@/types/training/trainingProgram";

type TrainingProgramCardProps = {
  program: TrainingProgram;
  onClick?: () => void;
};

export default function TrainingProgramCard({ program, onClick }: TrainingProgramCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-28 w-full items-center overflow-hidden rounded-[20px] text-left ${program.cardClassName}`}
    >
      {/* 좌측 영역 가로 중앙, 카드 하단선에 맞춘 배치 */}
      <span className="absolute bottom-0 left-0 flex w-25 justify-center">
        <img src={program.character} alt="" className="h-23 w-auto object-contain" />
      </span>

      <div className="ml-25 min-w-0 flex-1 pr-7">
        <h3 className="text-[15px] leading-tight font-bold text-[#4F4D4E]">{program.title}</h3>

        {/* 12px 유지하며 두 줄에 맞추기 위한 자간 조정 */}
        <p className="mt-1 text-[12px] leading-4 font-medium tracking-[-0.03em] break-keep whitespace-pre-line text-[#54555A]">
          {program.description}
        </p>

        <div className="mt-2 flex gap-1.5">
          {program.tags.map((tag) => (
            <TrainingTagChip key={tag} label={tag} className={program.tagClassName} />
          ))}
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-[#54555A]"
      >
        <path d="m9 4 8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
