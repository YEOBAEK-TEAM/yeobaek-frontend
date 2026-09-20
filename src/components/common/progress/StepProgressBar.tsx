type StepProgressBarProps = {
  step: number;
  totalSteps: number;
  variant?: "default" | "quiz";
};

const VARIANT_CLASS = {
  default: { track: "w-88 bg-[#D5DAE0]", fill: "bg-[#4F4D4E]" },
  quiz: { track: "w-83 bg-[#E5E5E5]", fill: "bg-[#4F5340]" },
};

export default function StepProgressBar({
  step,
  totalSteps,
  variant = "default",
}: StepProgressBarProps) {
  const variantClass = VARIANT_CLASS[variant];

  return (
    <div
      role="progressbar"
      aria-label="진행 단계"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={step}
      className={`mx-auto h-1 ${variantClass.track}`}
    >
      <span
        className={`block h-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${variantClass.fill}`}
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  );
}
