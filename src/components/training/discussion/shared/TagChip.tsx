import { X } from "lucide-react";

type TagChipProps = {
  label: string;
  onRemove?: () => void;
};

export default function TagChip({ label, onRemove }: TagChipProps) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#A89F94] bg-[#EDEAE4] px-2.5 text-[13px] font-medium whitespace-nowrap text-[#54555A]">
      {label}

      {onRemove && (
        <button
          type="button"
          aria-label={`${label} 태그 삭제`}
          onClick={onRemove}
          className="-mr-1.5 flex h-5 w-5 items-center justify-center text-[#8F8B85]"
        >
          <X aria-hidden="true" strokeWidth={2.5} className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
