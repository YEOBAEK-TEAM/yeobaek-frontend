// 진입 시 0에서 목표 값까지 채움
export default function ReadingProgressBar({ percent }: { percent: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-3 w-full overflow-hidden rounded-full bg-[#E0DDCE]"
    >
      <div
        className="h-full origin-left rounded-full bg-[#BEC5A5]"
        style={{ width: `${percent}%`, animation: "progress-grow 700ms ease-out both" }}
      />
    </div>
  );
}
