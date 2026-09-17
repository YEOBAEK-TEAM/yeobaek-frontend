import { SECTION_RETRY_LABEL } from "@/constants/home/home";

type SectionStateProps = {
  isError: boolean;
  onRetry: () => void;
  className?: string;
};

// 섹션별 로딩과 실패 표시
export default function SectionState({ isError, onRetry, className = "" }: SectionStateProps) {
  if (!isError) return <div className={`animate-pulse rounded-xl bg-[#EFEDE7] ${className}`} />;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl bg-[#F7F6F1] ${className}`}
    >
      <p className="text-[14px] text-[#8F8F8F]">불러오지 못했습니다</p>

      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-[#C4BFB6] bg-white px-4 py-1.5 text-[13px] font-bold text-[#60564C]"
      >
        {SECTION_RETRY_LABEL}
      </button>
    </div>
  );
}
