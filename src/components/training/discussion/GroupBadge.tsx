type GroupBadgeProps = {
  label: string;
};

export default function GroupBadge({ label }: GroupBadgeProps) {
  return (
    <span className="inline-flex h-6.5 shrink-0 items-center rounded-full bg-[#BEC5A5] px-4 text-[12px] font-semibold text-[#4F4D4E]">
      {label}
    </span>
  );
}
