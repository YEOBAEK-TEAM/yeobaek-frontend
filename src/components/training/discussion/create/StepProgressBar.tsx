type StepProgressBarProps = {
  step: number;
  totalSteps: number;
};

export default function StepProgressBar({ step, totalSteps }: StepProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label="진행 단계"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={step}
      className="mx-auto h-1 w-88 bg-[#D5DAE0]"
    >
      <span
        className="block h-full bg-[#4F4D4E] transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  );
}
