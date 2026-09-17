type TrainingTagChipProps = {
  label: string;
  className: string;
};

export default function TrainingTagChip({ label, className }: TrainingTagChipProps) {
  return (
    <span
      className={`inline-flex h-[22px] shrink-0 items-center rounded-full px-2.5 text-[12px] font-bold tracking-[-0.03em] whitespace-nowrap text-[#54555A] ${className}`}
    >
      {label}
    </span>
  );
}
