type StepHeaderProps = {
  title: string;
  step: number;
  totalSteps: number;
  onBack: () => void;
};

export default function StepHeader({ title, step, totalSteps, onBack }: StepHeaderProps) {
  return (
    <header className="relative flex h-[92px] items-center justify-center px-5 text-[#30201D]">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로가기"
        className="absolute left-3 flex h-11 w-11 items-center justify-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          <path d="m15 4-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="text-xl font-bold">{title}</h1>

      <p className="absolute right-5 text-[16px] font-bold tabular-nums">
        <span aria-hidden="true">
          {step}/{totalSteps}
        </span>
        <span className="sr-only">
          {totalSteps}단계 중 {step}단계
        </span>
      </p>
    </header>
  );
}
